document.addEventListener('DOMContentLoaded', () => {
    // ==================================================================
    //  ゲームデータと状態管理
    // ==================================================================
    let player = {};
    let currentEnemy = {};
    let battleLog = [];
    const mapSize = 15;
    const gameMap = [];

    // --- データベース ---
    const enemyDatabase = {
        forest: [
            { name: "スライム", sprite: "💧", stats: { hp: 40, atk: 10, def: 5 }, exp: 25, gold: 10, drops: [{ name: "魔石", chance: 0.5 }] },
            { name: "ゴブリン", sprite: "👺", stats: { hp: 60, atk: 14, def: 8 }, exp: 40, gold: 20, drops: [{ name: "薬草", chance: 0.3 }] }
        ],
        plains: [
            { name: "コウモリ", sprite: "🦇", stats: { hp: 30, atk: 12, def: 3 }, exp: 20, gold: 8, drops: [] }
        ]
    };

    const spellDatabase = {
        "攻撃魔法": { type: "damage", cost: 5, power: 1.2, name: "攻撃魔法" },
        "火の魔法": { type: "damage", cost: 15, power: 2.5, name: "火の魔法" },
        "回復魔法": { type: "heal", cost: 10, power: 30, name: "回復魔法" }
    };

    // --- DOM要素 ---
    const screens = document.querySelectorAll('.screen');
    const mapContainer = document.getElementById('map-container');
    const logWindow = document.getElementById('log-window');

    // ==================================================================
    //  画面切り替え
    // ==================================================================
    const showScreen = (screenId) => {
        screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        if (screenId === 'status-screen') updateStatusScreen();
        if (screenId === 'inventory-screen') updateInventoryScreen();
    };

    // ==================================================================
    //  ログ出力
    // ==================================================================
    function addLog(message, type = 'system') {
        const p = document.createElement('p');
        p.textContent = message;
        p.className = `log-${type}`;
        logWindow.appendChild(p);
        logWindow.scrollTop = logWindow.scrollHeight;
    }

    // ==================================================================
    //  キャラクター作成
    // ==================================================================
    document.getElementById('start-creation-button').addEventListener('click', () => {
        showScreen('character-creation-screen');
    });

    document.getElementById('complete-creation-button').addEventListener('click', () => {
        const name = document.getElementById('player-name').value;
        const race = 'elf'; // 種族をエルフに固定

        player = {
            name, race, pClass: 'mage',
            level: 1, exp: 0, nextLevelExp: 100,
            x: 7, y: 7,
            gold: 50,
            inventory: [{ name: "薬草", quantity: 3 }],
            spells: ["攻撃魔法", "火の魔法", "回復魔法"],
            stats: { hp: 0, maxHp: 0, mp: 0, maxMp: 0, atk: 0, def: 0, spd: 0, luck: 0 }
        };

        const baseStats = {
            elf: { hp: 80, mp: 120, atk: 8, def: 8, spd: 12, luck: 10 }
        };
        const classMods = { mage: { hp: 0.8, mp: 1.5, atk: 0.8, def: 0.9, spd: 1.0, luck: 1.0 } };

        Object.keys(player.stats).forEach(key => {
            const base = baseStats[race][key];
            const mod = classMods.mage[key];
            player.stats[key] = Math.floor(base * mod);
        });
        player.stats.maxHp = player.stats.hp;
        player.stats.maxMp = player.stats.mp;

        initializeGame();
    });
    
    // ==================================================================
    //  ゲーム初期化
    // ==================================================================
    function initializeGame() {
        createMap();
        drawMap();
        updateHUD();
        addLog(`${player.name}の旅が始まった。`, 'system');
        showScreen('main-game-screen');
    }

    // ==================================================================
    //  マップ関連
    // ==================================================================
    function createMap() {
        mapContainer.innerHTML = '';
        mapContainer.style.gridTemplateColumns = `repeat(${mapSize}, 1fr)`;
        mapContainer.style.gridTemplateRows = `repeat(${mapSize}, 1fr)`;
        for (let y = 0; y < mapSize; y++) {
            gameMap[y] = [];
            for (let x = 0; x < mapSize; x++) {
                const tile = document.createElement('div');
                tile.classList.add('map-tile');
                tile.id = `tile-${x}-${y}`;
                let type = 'forest';
                if (Math.random() > 0.6) type = 'plains';
                if (x === 3 && y === 3) type = 'town';
                gameMap[y][x] = { type };
                mapContainer.appendChild(tile);
            }
        }
    }

    function drawMap() {
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const tileEl = document.getElementById(`tile-${x}-${y}`);
                const tileData = gameMap[y][x];
                tileEl.innerHTML = '';
                tileEl.classList.remove('player-tile');
                let symbol = '🌳'; let color = '#228B22';
                if (tileData.type === 'plains') { symbol = '🌾'; color = '#90EE90'; }
                if (tileData.type === 'town') { symbol = '🏰'; color = '#D3D3D3'; }
                tileEl.textContent = symbol;
                tileEl.style.color = color;
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
            if (newX >= 0 && newX < mapSize && newY >= 0 && newY < mapSize) {
                player.x = newX;
                player.y = newY;
                drawMap();
                checkTileEvent();
            }
        }
    });

    function checkTileEvent() {
        const tile = gameMap[player.y][player.x];
        if (tile.type === 'town') {
            addLog('町に入った。', 'system');
            showScreen('town-screen');
        } else {
            const encounterRate = tile.type === 'forest' ? 0.25 : 0.15;
            if (Math.random() < encounterRate) {
                startBattle(tile.type);
            }
        }
    }

    // ==================================================================
    //  UI更新
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
    //  戦闘関連
    // ==================================================================
    function startBattle(terrain) {
        addLog('魔物が現れた！', 'battle');
        const possibleEnemies = enemyDatabase[terrain];
        currentEnemy = { ...possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)] };
        currentEnemy.hp = currentEnemy.stats.hp; // 現在HPを初期化
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
    }

    const playerAction = (spellName) => {
        const spell = spellDatabase[spellName];
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
        
        currentEnemy.drops.forEach(drop => {
            if (Math.random() < drop.chance) {
                addItemToInventory(drop.name, 1);
                addLog(`${drop.name}を手に入れた！`, 'item');
            }
        });

        checkLevelUp();
        updateHUD();
        showScreen('main-game-screen');
    }
    
    function loseBattle() {
        addLog('目の前が真っ暗になった...', 'system');
        player.gold = Math.floor(player.gold / 2);
        player.x = 3; player.y = 3;
        player.stats.hp = 1;
        updateHUD();
        drawMap();
        showScreen('main-game-screen');
    }

    // ==================================================================
    //  その他システム
    // ==================================================================
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
    //  ボタンイベントリスナー
    // ==================================================================
    document.getElementById('status-button').addEventListener('click', () => showScreen('status-screen'));
    document.getElementById('inventory-button').addEventListener('click', () => showScreen('inventory-screen'));
    document.getElementById('status-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('inventory-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('inn-button').addEventListener('click', useInn);
    document.getElementById('town-exit-button').addEventListener('click', () => showScreen('main-game-screen'));

});
