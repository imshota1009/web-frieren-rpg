document.addEventListener('DOMContentLoaded', () => {
    // ==================================================================
    //  Game Data and State Management
    // ==================================================================
    let player = {};
    let currentEnemy = {};
    let battleLog = [];
    let gameMap = [];
    let mapSize = 0;
    let temporaryMapChanges = {};

    // --- Databases ---
    const itemDatabase = {
        "薬草": { type: "item", sellPrice: 5 },
        "魔石": { type: "item", sellPrice: 10 },
    };

    const weaponDatabase = {
        "見習いの杖": { type: "weapon", atk: 5, price: 50 },
        "樫の杖": { type: "weapon", atk: 12, price: 200 },
    };
    
    const enemyDatabase = {
        forest: [
            { name: "スライム", sprite: "💧", stats: { hp: 40, atk: 10, def: 5 }, exp: 25, gold: 10, drops: [{ name: "魔石", chance: 0.5 }] },
            { name: "ゴブリン", sprite: "🧌", stats: { hp: 60, atk: 14, def: 8 }, exp: 40, gold: 20, drops: [{ name: "薬草", chance: 0.3 }] }
        ],
        // ... 他の敵データ
    };

    const spellDatabase = {
        "ゾルトラーク": { type: "damage", cost: 5, power: 2.2, name: "ゾルトラーク" },
        "回復魔法": { type: "heal", cost: 10, power: 30, name: "回復魔法" },
        // ... 他の魔法データ
    };

    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const mapContainer = document.getElementById('map-container');
    const logWindow = document.getElementById('log-window');

    // ==================================================================
    //  Screen & Modal Management
    // ==================================================================
    const showScreen = (screenId) => {
        screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        if (screenId === 'status-screen') updateStatusScreen();
        if (screenId === 'inventory-screen') updateInventoryScreen();
        if (screenId === 'spellbook-screen') updateSpellbookScreen();
        if (screenId === 'quest-log-screen') updateQuestLogScreen();
    };

    const showModal = (modalId, show = true) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.toggle('active', show);
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
    //  Character Creation & Initialization
    // ==================================================================
    document.getElementById('start-creation-button').addEventListener('click', () => {
        showScreen('character-creation-screen');
    });

    document.getElementById('complete-creation-button').addEventListener('click', () => {
        const name = document.getElementById('player-name').value || "フリーレン";
        player = {
            name, race: 'elf', pClass: 'mage',
            level: 1, exp: 0, nextLevelExp: 100,
            x: 0, y: 0, currentMap: 'northernForest',
            gold: 50,
            equipment: { weapon: { name: "見習いの杖", atk: 5, level: 1 } },
            inventory: [{ name: "薬草", quantity: 10 }],
            spells: ["ゾルトラーク", "回復魔法"],
            quests: [], // クエストを配列で管理
            stats: { hp: 0, maxHp: 0, mp: 0, maxMp: 0, baseAtk: 0, def: 0, spd: 0, luck: 0 }
        };

        const baseStats = { elf: { hp: 120, mp: 300, atk: 8, def: 50, spd: 12, luck: 10 } };
        const classMods = { mage: { hp: 0.8, mp: 1.5, atk: 0.8, def: 0.9, spd: 1.0, luck: 1.0 } };

        player.stats.maxHp = Math.floor(baseStats.elf.hp * classMods.mage.hp);
        player.stats.hp = player.stats.maxHp;
        player.stats.maxMp = Math.floor(baseStats.elf.mp * classMods.mage.mp);
        player.stats.mp = player.stats.maxMp;
        player.stats.baseAtk = Math.floor(baseStats.elf.atk * classMods.mage.atk);
        player.stats.def = Math.floor(baseStats.elf.def * classMods.mage.def);
        player.stats.spd = Math.floor(baseStats.elf.spd * classMods.mage.spd);
        player.stats.luck = Math.floor(baseStats.elf.luck * classMods.mage.luck);
        
        initializeGame();
    });
    
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
        temporaryMapChanges = {};
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
                if ('dAo'.includes(tileCode)) type = {d: 'desert', A: 'association_city', o: 'oasis'}[tileCode];
                if ('RU'.includes(tileCode)) type = {R: 'ruins', U: 'ruins_portal'}[tileCode];
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
                
                const tempChange = temporaryMapChanges[`${y}-${x}`];
                if (tempChange && tempChange.type === 'flower_garden') {
                     symbol = '🌼'; color = '#FFB6C1';
                } else {
                    switch(tileData.type) {
                        case 'forest': symbol = '🌳'; color = '#228B22'; break;
                        case 'plains': symbol = '🌾'; color = '#90EE90'; break;
                        case 'town': symbol = '🏰'; color = '#D3D3D3'; break;
                        case 'cave_entrance': symbol = '🕳️'; color = '#654321'; break;
                        case 'wall': bgColor = '#333'; break;
                        case 'floor': bgColor = '#666'; break;
                        case 'cave_exit': symbol = '⬆️'; color = '#fff'; bgColor = '#666'; break;
                        case 'snow': symbol = '❄️'; color = '#ADD8E6'; break;
                        case 'desert': symbol = '🏜️'; color = '#EDC9AF'; break;
                        case 'ruins': symbol = '🏛️'; color = '#888'; break;
                        case 'oasis': symbol = '💧'; color = '#4682B4'; break;
                        case 'association_city': symbol = '📖'; color = '#c9a46a'; break;
                        case 'snow_portal': case 'forest_portal': case 'ruins_portal': symbol = '🌀'; color = '#fff'; break;
                        case 'chest':
                            const chestState = currentMapData.chests[`${y}-${x}`];
                            symbol = chestState && !chestState.opened ? '🎁' : '📦';
                            color = '#FFD700';
                            break;
                    }
                }

                tileEl.textContent = symbol;
                tileEl.style.color = color;
                tileEl.style.backgroundColor = bgColor;
            }
        }
        const playerTile = document.getElementById(`tile-${player.x}-${player.y}`);
        if(!temporaryMapChanges[`${player.y}-${player.x}`]) {
             playerTile.textContent = '🧙';
        }
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
                openCastle(portal);
            } else {
                addLog('別のエリアに移動した。', 'system');
                loadMap(portal.targetMap, portal.targetX, portal.targetY);
            }
        } else {
             const terrain = currentMapData.terrainType;
             if (terrain) {
                const encounterRate = { forest: 0.2, plains: 0.1, cave: 0.3, snow: 0.25, desert: 0.15, ruins: 0.28 }[terrain] || 0;
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
    
    function getTotalAtk() {
        return player.stats.baseAtk + (player.equipment.weapon ? player.equipment.weapon.atk : 0);
    }
    
    function updateStatusScreen() {
        // ... (updateStatusScreen logic)
    }

    function updateInventoryScreen() {
        // ... (updateInventoryScreen logic)
    }
    
    function updateSpellbookScreen() {
        // ... (updateSpellbookScreen logic)
    }

    function updateQuestLogScreen() {
        const list = document.getElementById('quest-list');
        list.innerHTML = '';
        if (player.quests.length === 0) {
            list.innerHTML = '<li>現在受けているクエストはありません。</li>';
            return;
        }

        player.quests.forEach(quest => {
            const questData = questDatabase[quest.id];
            const li = document.createElement('li');
            const progress = quest.progress >= questData.objective.required ? "達成" : `${quest.progress} / ${questData.objective.required}`;
            li.innerHTML = `
                <h3>${questData.title}</h3>
                <p>${questData.description}</p>
                <p>進捗: ${progress}</p>
            `;
            list.appendChild(li);
        });
    }

    // ==================================================================
    //  Castle & NPC Logic
    // ==================================================================
    function openCastle(portalData) {
        document.getElementById('castle-name').textContent = portalData.name;
        const npcContainer = document.getElementById('npc-container');
        npcContainer.innerHTML = '';

        if(portalData.npcs && portalData.npcs.length > 0) {
            portalData.npcs.forEach(npcId => {
                const npcData = npcDatabase[npcId];
                const npcEl = document.createElement('div');
                npcEl.className = 'npc';
                npcEl.textContent = npcData.sprite;
                npcEl.style.top = npcData.position.top;
                npcEl.style.left = npcData.position.left;
                npcEl.onclick = () => talkToNpc(npcId);
                npcContainer.appendChild(npcEl);
            });
        }
        showScreen('castle-screen');
    }

    function talkToNpc(npcId) {
        const npcData = npcDatabase[npcId];
        document.getElementById('dialogue-npc-name').textContent = npcData.name;
        document.getElementById('dialogue-text').textContent = npcData.dialogue;

        const optionsContainer = document.getElementById('dialogue-options');
        optionsContainer.innerHTML = '';

        const questData = questDatabase[npcData.questId];
        if (questData) {
            const activeQuest = player.quests.find(q => q.id === npcData.questId);
            const isQuestCompleted = activeQuest && activeQuest.progress >= questData.objective.required;

            if (isQuestCompleted) {
                document.getElementById('dialogue-text').textContent = "ありがとう、助かったよ。これはお礼だ。";
                const completeButton = document.createElement('button');
                completeButton.textContent = 'クエストを完了する';
                completeButton.className = 'game-button';
                completeButton.onclick = () => completeQuest(npcData.questId);
                optionsContainer.appendChild(completeButton);
            } else if (!activeQuest) {
                const acceptButton = document.createElement('button');
                acceptButton.textContent = `「${questData.title}」を受ける`;
                acceptButton.className = 'game-button';
                acceptButton.onclick = () => acceptQuest(npcData.questId);
                optionsContainer.appendChild(acceptButton);
            }
        }
        showModal('dialogue-modal');
    }

    // ==================================================================
    //  Quest Logic
    // ==================================================================
    function acceptQuest(questId) {
        if (!player.quests.some(q => q.id === questId)) {
            const questData = questDatabase[questId];
            player.quests.push({
                id: questId,
                progress: 0,
            });
            addLog(`クエスト「${questData.title}」を受注した。`, 'system');
        }
        showModal('dialogue-modal', false);
    }

    function completeQuest(questId) {
        const questData = questDatabase[questId];
        const reward = questData.reward;

        if (reward.type === 'gold') {
            player.gold += reward.amount;
            addLog(`報酬として ${reward.amount}G を手に入れた！`, 'item');
        } else if (reward.type === 'item') {
            addItemToInventory(reward.name, reward.quantity);
            addLog(`報酬として ${reward.name}を${reward.quantity}個手に入れた！`, 'item');
        }
        player.quests = player.quests.filter(q => q.id !== questId);
        showModal('dialogue-modal', false);
        updateHUD();
    }
    
    function checkQuestProgress(type, target) {
         player.quests.forEach(quest => {
            const questData = questDatabase[quest.id];
             if (quest.progress < questData.objective.required && quest.objective.type === type && quest.objective.target === target) {
                quest.progress++;
                 addLog(`クエスト進捗: ${quest.progress}/${questData.objective.required}`, 'system');
            }
        });
    }

    function addItemToInventory(itemName, quantity) {
        const existingItem = player.inventory.find(item => item.name === itemName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            player.inventory.push({ name: itemName, quantity });
        }
        // Check for collection quests
        checkQuestProgress('collect', itemName);
    }

    // ==================================================================
    //  Battle Logic
    // ==================================================================
    function startBattle(terrain) {
        //...
    }
    
     function updateBattleScreen() {
        //...
    }
    
    const playerAction = (action) => {
        //...
    };
    
    function enemyAction() {
        //...
    }
    
     function winBattle() {
        addLog(`${currentEnemy.name}を倒した！`, 'system');
        player.exp += currentEnemy.exp;
        player.gold += currentEnemy.gold;
        addLog(`${currentEnemy.exp}の経験値と${currentEnemy.gold}Gを手に入れた。`, 'system');
        
        checkQuestProgress('kill', currentEnemy.name);

        if (currentEnemy.drops) {
            currentEnemy.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    addItemToInventory(drop.name, drop.quantity || 1);
                    addLog(`${drop.name}を手に入れた！`, 'item');
                }
            });
        }

        checkLevelUp();
        updateHUD();
        showScreen('main-game-screen');
    }
    
    // ... (other functions: loseBattle, checkLevelUp)
    
    // ==================================================================
    //  Button Event Listeners
    // ==================================================================
    document.getElementById('status-button').addEventListener('click', () => showScreen('status-screen'));
    document.getElementById('inventory-button').addEventListener('click', () => showScreen('inventory-screen'));
    document.getElementById('spellbook-button').addEventListener('click', () => showScreen('spellbook-screen'));
    document.getElementById('quest-log-button').addEventListener('click', () => showScreen('quest-log-screen'));
    
    document.getElementById('status-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('inventory-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('spellbook-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('quest-log-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    
    document.getElementById('castle-exit-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('dialogue-close-button').addEventListener('click', () => showModal('dialogue-modal', false));

});

