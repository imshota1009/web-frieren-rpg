document.addEventListener('DOMContentLoaded', () => {
    // ==================================================================
    //  Game Data and State Management
    // ==================================================================
    let player = {};
    let currentEnemy = {};
    let battleLog = [];
    let gameMap = [];
    let mapSize = 0;

    // --- Databases (Enemies, Spells) ---
    const enemyDatabase = {
        forest: [
            { name: "スライム", sprite: "💧", stats: { hp: 40, atk: 10, def: 5 }, exp: 25, gold: 10, drops: [{ name: "魔石", chance: 0.5 }] },
            { name: "ゴブリン", sprite: "🧌", stats: { hp: 60, atk: 14, def: 8 }, exp: 40, gold: 20, drops: [{ name: "薬草", chance: 0.3 }] }
        ],
        plains: [
            { name: "コウモリ", sprite: "🦇", stats: { hp: 30, atk: 12, def: 3 }, exp: 20, gold: 8, drops: [] }
        ],
        cave: [
            { name: "大コウモリ", sprite: "🦇", stats: { hp: 70, atk: 15, def: 5 }, exp: 50, gold: 25, drops: [] },
            { name: "ゴブリン兵", sprite: "🧌", stats: { hp: 80, atk: 18, def: 10 }, exp: 60, gold: 30, drops: [{ name: "魔石", chance: 0.8 }] }
        ],
        snow: [
            { name: "氷狼", sprite: "🐺", stats: { hp: 70, atk: 16, def: 6 }, exp: 55, gold: 28, drops: [] },
            { name: "フロストゴブリン", sprite: "🧌", stats: { hp: 90, atk: 20, def: 12 }, exp: 70, gold: 40, drops: [{ name: "魔石", chance: 0.9 }] }
        ]
    };

    const spellDatabase = {
        "ゾルトラーク": { type: "damage", cost: 5, power: 1.2, name: "ゾルトラーク" },
        "火の魔法": { type: "damage", cost: 15, power: 2.5, name: "火の魔法" },
        "回復魔法": { type: "heal", cost: 10, power: 30, name: "回復魔法" },
        "氷の矢": { type: "damage", cost: 12, power: 2.0, name: "氷の矢" },
    };

    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const mapContainer = document.getElementById('map-container');
    const logWindow = document.getElementById('log-window');

    // ==================================================================
    //  Screen Transition
    // ==================================================================
    const showScreen = (screenId) => {
        screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        if (screenId === 'status-screen') updateStatusScreen();
        if (screenId === 'inventory-screen') updateInventoryScreen();
    };

    // ==================================================================
    //  Log Output
    // ==================================================================
    function addLog(message, type = 'system') {
        const p = document.createElement('p');
        p.textContent = message;
        p.className = `log-${type}`;
        logWindow.appendChild(p);
        logWindow.scrollTop = logWindow.scrollHeight;
    }

    // ==================================================================
    //  Character Creation
    // ==================================================================
    document.getElementById('start-creation-button').addEventListener('click', () => {
        showScreen('character-creation-screen');
    });

    document.getElementById('complete-creation-button').addEventListener('click', () => {
        const name = document.getElementById('player-name').value;
        player = {
            name, race: 'elf', pClass: 'mage',
            level: 1, exp: 0, nextLevelExp: 100,
            x: 0, y: 0, currentMap: 'northernForest',
            gold: 50,
            inventory: [{ name: "薬草", quantity: 3 }],
            spells: ["ゾルトラーク", "回復魔法"], // Starting spells
            stats: { hp: 0, maxHp: 0, mp: 0, maxMp: 0, atk: 0, def: 0, spd: 0, luck: 0 }
        };

        const baseStats = { elf: { hp: 80, mp: 120, atk: 8, def: 8, spd: 12, luck: 10 } };
        const classMods = { mage: { hp: 0.8, mp: 1.5, atk: 0.8, def: 0.9, spd: 1.0, luck: 1.0 } };

        Object.keys(player.stats).forEach(key => {
            player.stats[key] = Math.floor(baseStats.elf[key] * classMods.mage[key]);
        });
        player.stats.maxHp = player.stats.hp;
        player.stats.maxMp = player.stats.mp;

        initializeGame();
    });
    
    // ==================================================================
    //  Game Initialization
    // ==================================================================
    function initializeGame() {
        loadMap(player.currentMap);
        updateHUD();
        addLog(`${player.name}の旅が始まった。`, 'system');
        showScreen('main-game-screen');
    }

    // ==================================================================
    //  Map Logic
    // ==================================================================
    function loadMap(mapId, targetX, targetY) {
        const mapData = mapDatabase[mapId];
        if (!mapData) return;

        player.currentMap = mapId;
        mapSize = mapData.layout.length;
        gameMap.length = 0;
        mapContainer.innerHTML = '';
        mapContainer.style.gridTemplateColumns = `repeat(${mapSize}, 1fr)`;
        mapContainer.style.gridTemplateRows = `repeat(${mapSize}, 1fr)`;

        for (let y = 0; y < mapSize; y++) {
            gameMap[y] = [];
            for (let x = 0; x < mapSize; x++) {
                const tileCode = mapData.layout[y][x];
                let type = 'floor';
                if ('fpT'.includes(tileCode)) type = {f: 'forest', p: 'plains', T: 'town'}[tileCode];
                if ('CwE'.includes(tileCode)) type = {C: 'cave_entrance', w: 'wall', E: 'cave_exit'}[tileCode];
                if ('sSM'.includes(tileCode)) type = {s: 'snow', S: 'snow_portal', M: 'forest_portal'}[tileCode];
                if (tileCode === 'B') type = 'chest';
                
                gameMap[y][x] = { type };
                const tileEl = document.createElement('div');
                tileEl.classList.add('map-tile');
                tileEl.id = `tile-${x}-${y}`;
                mapContainer.appendChild(tileEl);
            }
        }
        player.x = targetX !== undefined ? targetX : mapData.startPosition.x;
        player.y = targetY !== undefined ? targetY : mapData.startPosition.y;
        drawMap();
    }

    function drawMap() {
        const currentMapData = mapDatabase[player.currentMap];
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const tileEl = document.getElementById(`tile-${x}-${y}`);
                const tileData = gameMap[y][x];
                tileEl.innerHTML = '';
                tileEl.classList.remove('player-tile');
                let symbol = '', color = '#fff', bgColor = '#000';

                switch(tileData.type) {
                    case 'forest': symbol = '🌳'; color = '#228B22'; break;
                    case 'plains': symbol = '🌾'; color = '#90EE90'; break;
                    case 'town': symbol = '🏰'; color = '#D3D3D3'; break;
                    case 'cave_entrance': symbol = '🕳️'; color = '#654321'; break;
                    case 'wall': bgColor = '#333'; break;
                    case 'floor': bgColor = '#666'; break;
                    case 'cave_exit': symbol = '⬆️'; color = '#fff'; bgColor = '#666'; break;
                    case 'snow': symbol = '❄️'; color = '#ADD8E6'; break;
                    case 'snow_portal': symbol = '🏔️'; color = '#fff'; break;
                    case 'forest_portal': symbol = '🌲'; color = '#228B22'; break;
                    case 'chest':
                        const chestState = currentMapData.chests[`${y}-${x}`];
                        symbol = chestState && !chestState.opened ? '🎁' : ' खाली';
                        color = '#FFD700';
                        break;
                }
                tileEl.textContent = symbol;
                tileEl.style.color = color;
                tileEl.style.backgroundColor = bgColor;
            }
        }
        const playerTile = document.getElementById(`tile-${player.x}-${player.y}`);
        playerTile.textContent = '🧙';
        playerTile.classList.add('player-tile');
    }

    window.addEventListener('keydown', (e) => {
        if (document.querySelector('#main-game-screen.active')) {
            let newX = player.x, newY = player.y;
            if (e.key === 'ArrowUp') newY--;
            if (e.key === 'ArrowDown') newY++;
            if (e.key === 'ArrowLeft') newX--;
            if (e.key === 'ArrowRight') newX++;
            
            const targetTile = gameMap[newY] && gameMap[newY][newX];
            if (targetTile && targetTile.type !== 'wall') {
                player.x = newX;
                player.y = newY;
                drawMap();
                checkTileEvent();
            }
        }
    });

    function checkTileEvent() {
        const currentMapData = mapDatabase[player.currentMap];
        const tileCode = currentMapData.layout[player.y][player.x];
        const portal = currentMapData.portals && currentMapData.portals[tileCode];

        if (portal) {
            if (portal.isTown) {
                document.getElementById('town-name').textContent = portal.name;
                addLog(`${portal.name}に入った。`, 'system');
                showScreen('town-screen');
            } else {
                addLog('別のエリアに移動した。', 'system');
                loadMap(portal.targetMap, portal.targetX, portal.targetY);
            }
        } else if (tileCode === 'B') {
            openChest(player.y, player.x);
        } else {
            const terrain = currentMapData.terrainType;
            if (terrain) {
                const encounterRate = { forest: 0.2, plains: 0.1, cave: 0.3, snow: 0.25 }[terrain] || 0;
                if (Math.random() < encounterRate) {
                    startBattle(terrain);
                }
            }
        }
    }

    // ==================================================================
    //  UI Updates
    // ==================================================================
    function updateHUD() {
        document.getElementById('hud-name').textContent = `${player.name} | Lv ${player.level}`;
        document.getElementById('hp-value').textContent = `${player.stats.hp} / ${player.stats.maxHp}`;
        document.getElementById('mp-value').textContent = `${player.stats.mp} / ${player.stats.maxMp}`;
        document.getElementById('exp-value').textContent = `${player.exp} / ${player.nextLevelExp}`;
        document.getElementById('hp-bar').style.width = `${(player.stats.hp / player.stats.maxHp) * 100}%`;
        document.getElementById('mp-bar').style.width = `${(player.stats.mp / player.stats.maxMp) * 100}%`;
        document.getElementById('exp-bar').style.width = `${(player.exp / player.nextLevelExp) * 100}%`;
    }
    
    function updateStatusScreen() {
        document.getElementById('status-grid').innerHTML = `
            <span>HP</span><span>${player.stats.hp} / ${player.stats.maxHp}</span>
            <span>MP</span><span>${player.stats.mp} / ${player.stats.maxMp}</span>
            <span>攻撃力</span><span>${player.stats.atk}</span>
            <span>防御力</span><span>${player.stats.def}</span>
            <span>素早さ</span><span>${player.stats.spd}</span>
            <span>運</span><span>${player.stats.luck}</span>
        `;
    }

    function updateInventoryScreen() {
        document.getElementById('gold-display').textContent = `所持金: ${player.gold} G`;
        const list = document.getElementById('inventory-list');
        list.innerHTML = '';
        player.inventory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} x ${item.quantity}`;
            list.appendChild(li);
        });
        if (player.inventory.length === 0) list.innerHTML = '<li>何も持っていない</li>';
    }

    // ==================================================================
    //  Battle Logic
    // ==================================================================
    function startBattle(terrain) {
        addLog('魔物が現れた！', 'battle');
        const possibleEnemies = enemyDatabase[terrain];
        currentEnemy = { ...possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)] };
        currentEnemy.hp = currentEnemy.stats.hp;
        battleLog = [`${currentEnemy.name}が現れた！`];
        updateBattleScreen();
        showScreen('battle-screen');
    }

    function updateBattleScreen() {
        document.getElementById('player-battle-name').textContent = player.name;
        document.getElementById('player-battle-hp').textContent = `HP: ${player.stats.hp} | MP: ${player.stats.mp}`;
        document.getElementById('enemy-sprite').textContent = currentEnemy.sprite;
        document.getElementById('enemy-battle-name').textContent = currentEnemy.name;
        document.getElementById('enemy-battle-hp').textContent = `HP: ${currentEnemy.hp}`;
        document.getElementById('battle-log').innerHTML = battleLog.join('<br>');

        const actionsContainer = document.getElementById('battle-actions');
        actionsContainer.innerHTML = '';

        player.spells.forEach(spellName => {
            const spell = spellDatabase[spellName];
            const button = document.createElement('button');
            button.className = 'game-button';
            button.textContent = `${spell.name} (MP:${spell.cost})`;
            button.disabled = player.stats.mp < spell.cost;
            button.onclick = () => playerAction(spellName);
            actionsContainer.appendChild(button);
        });

        const runButton = document.createElement('button');
        runButton.className = 'game-button';
        runButton.textContent = '逃げる';
        runButton.onclick = () => playerAction('run');
        actionsContainer.appendChild(runButton);
    }

    const playerAction = (action) => {
        if (action === 'run') {
            battleLog.push(`${player.name}は逃げようと試みた。`);
            if (Math.random() < 0.25) {
                battleLog.push('うまく逃げ切れた！');
                updateBattleScreen();
                setTimeout(() => {
                    showScreen('main-game-screen');
                    addLog('戦闘から逃げ出した。', 'system');
                }, 1500);
            } else {
                battleLog.push('しかし、回り込まれてしまった！');
                document.getElementById('battle-actions').innerHTML = '';
                setTimeout(enemyAction, 1000);
                updateBattleScreen();
            }
            return;
        }

        const spell = spellDatabase[action];
        player.stats.mp -= spell.cost;

        if (spell.type === 'damage') {
            const damage = Math.max(1, Math.floor(player.stats.atk * spell.power) - currentEnemy.stats.def);
            currentEnemy.hp = Math.max(0, currentEnemy.hp - damage);
            battleLog.push(`${player.name}は${spell.name}を唱えた！ ${damage}のダメージ。`);
        } else if (spell.type === 'heal') {
            const healAmount = spell.power;
            player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + healAmount);
            battleLog.push(`${player.name}は${spell.name}を唱えた！ HPが${healAmount}回復した。`);
        }

        if (currentEnemy.hp <= 0) {
            winBattle();
            return;
        }
        
        document.getElementById('battle-actions').innerHTML = '';
        setTimeout(enemyAction, 1000);
        updateBattleScreen();
    };

    function enemyAction() {
        const damage = Math.max(1, currentEnemy.stats.atk - player.stats.def);
        player.stats.hp = Math.max(0, player.stats.hp - damage);
        battleLog.push(`${currentEnemy.name}の攻撃！ ${damage}のダメージを受けた。`);
        updateHUD();
        if (player.stats.hp <= 0) {
            loseBattle();
        } else {
            updateBattleScreen();
        }
    }
    
    function winBattle() {
        addLog(`${currentEnemy.name}を倒した！`, 'system');
        addLog(`${currentEnemy.exp}の経験値と${currentEnemy.gold}Gを手に入れた。`, 'system');
        player.exp += currentEnemy.exp;
        player.gold += currentEnemy.gold;
        
        if (currentEnemy.drops) {
            currentEnemy.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    addItemToInventory(drop.name, 1);
                    addLog(`${drop.name}を手に入れた！`, 'item');
                }
            });
        }

        checkLevelUp();
        updateHUD();
        showScreen('main-game-screen');
    }
    
    function loseBattle() {
        addLog('目の前が真っ暗になった...', 'system');
        player.gold = Math.floor(player.gold / 2);
        const townPortal = findTownPortal();
        if(townPortal) {
            loadMap(townPortal.mapId, townPortal.x, townPortal.y);
        } else {
            loadMap(player.currentMap);
        }
        player.stats.hp = 1;
        updateHUD();
        drawMap();
        showScreen('main-game-screen');
    }
    
    function findTownPortal() {
        for (const mapId in mapDatabase) {
            const mapData = mapDatabase[mapId];
            for (const portalCode in mapData.portals) {
                if (mapData.portals[portalCode].isTown) {
                    const layout = mapData.layout;
                    for (let y = 0; y < layout.length; y++) {
                        for (let x = 0; x < layout[y].length; x++) {
                            if (layout[y][x] === portalCode) {
                                return { mapId: mapId, x: x, y: y };
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    // ==================================================================
    //  Other Systems
    // ==================================================================
    function openChest(y, x) {
        const chest = mapDatabase[player.currentMap].chests[`${y}-${x}`];
        if (!chest) return;

        if (chest.opened) {
            addLog('この宝箱は空だ。', 'system');
            return;
        }

        chest.opened = true;
        const content = chest.content;

        if (content.type === 'item') {
            if (content.name === '金貨') {
                player.gold += content.quantity;
                addLog(`宝箱を開けた！ ${content.quantity}Gを見つけた。`, 'item');
            } else {
                addItemToInventory(content.name, content.quantity);
                addLog(`宝箱を開けた！ ${content.name}を${content.quantity}個見つけた。`, 'item');
            }
        } else if (content.type === 'spell') {
            addLog(`宝箱を開けた！ 「${content.name}」の巻物を見つけた。`, 'item');
            learnSpell(content.name);
        }
        
        drawMap();
        updateHUD();
    }
    
    function learnSpell(spellName) {
        if (!player.spells.includes(spellName)) {
            player.spells.push(spellName);
            addLog(`新たな魔法、${spellName}を覚えた！`, 'system');
        } else {
            addLog('すでにその魔法は知っているようだ。', 'system');
        }
    }

    function addItemToInventory(itemName, quantity) {
        const existingItem = player.inventory.find(item => item.name === itemName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            player.inventory.push({ name: itemName, quantity: quantity });
        }
    }

    function checkLevelUp() {
        if (player.exp >= player.nextLevelExp) {
            player.level++;
            player.exp -= player.nextLevelExp;
            player.nextLevelExp = Math.floor(player.nextLevelExp * 1.5);
            player.stats.maxHp += 10;
            player.stats.maxMp += 8;
            player.stats.atk += 3;
            player.stats.def += 2;
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
            addLog(`レベルアップ！ ${player.level}になった！`, 'system');
        }
    }
    
    function useInn() {
        const cost = 10;
        if (player.gold >= cost) {
            player.gold -= cost;
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
            addLog(`宿屋に泊まり、HPとMPが全回復した。`, 'system');
            updateHUD();
        } else {
            addLog('お金が足りないようだ。', 'system');
        }
    }

    // ==================================================================
    //  Button Event Listeners
    // ==================================================================
    document.getElementById('status-button').addEventListener('click', () => showScreen('status-screen'));
    document.getElementById('inventory-button').addEventListener('click', () => showScreen('inventory-screen'));
    document.getElementById('status-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('inventory-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('inn-button').addEventListener('click', useInn);
    document.getElementById('town-exit-button').addEventListener('click', () => showScreen('main-game-screen'));

});
