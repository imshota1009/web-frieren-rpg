// ==================================================================
//  Map Database
// ==================================================================
// TILE KEY:
// f: Forest, p: Plains, s: Snow, d: Desert, R: Ruins
// T: Town, C: Cave Entrance, A: Magic Association City
// w: Wall, ' ': Floor, B: Chest
// Portals: S, M, D, U (Snow, Forest, Desert, Ruins)
// ==================================================================

const mapDatabase = {
    "northernForest": {
        name: "北の森",
        terrainType: "forest",
        layout: [
            ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['f', 'p', 'p', 'p', 'B', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'T', 'p', 'p', 'f', 'p', 'p', 'p', 'B', 'f', 'f', 'p', 'f'],
            ['f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'f'],
            ['f', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'f', 'B', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f', 'f', 'p', 'f', 'f', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f', 'f', 'p', 'C', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'p', 'B', 'p', 'p', 'f'],
            ['f', 'p', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
        ],
        startPosition: { x: 7, y: 13 },
        portals: {
            'S': { targetMap: 'snowyPlains', targetX: 7, targetY: 13 },
            'D': { targetMap: 'southernDesert', targetX: 7, targetY: 1 },
            'C': { targetMap: 'goblinCave', targetX: 1, targetY: 13 },
            'T': { isTown: true, name: "聖都シュトラール", npcs: ["fern", "stark"] }
        },
        chests: {
            '1-4':  { opened: false, content: { type: 'item', name: '薬草', quantity: 2 } },
            '3-10': { opened: false, content: { type: 'spell', name: '火の魔法' } },
            '6-2':  { opened: false, content: { type: 'mimic' } },
            '10-11':{ opened: false, content: { type: 'item', name: '金貨', quantity: 150 } },
        }
    },
     "snowyPlains": {
        name: "雪深き辺境",
        terrainType: "snow",
        layout: [
            ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 'T', 's', 'f', 'f', 's', 'f', 'f', 's', 'B', 'C', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 'f', 's', 'f', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'f', 'f', 'f', 's', 's', 's', 's', 's', 'f', 'f', 'f', 's', 'f'],
            ['f', 's', 's', 's', 'B', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 'f', 'f', 'f', 'f', 's', 's', 's', 's', 's', 'f', 'f', 'f', 'f', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'B', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'f', 'f', 'f', 'f', 's', 's', 's', 'f', 'f', 'f', 'f', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 'B', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
        ],
        portals: {
            'M': { targetMap: 'northernForest', targetX: 7, targetY: 1 },
            'C': { targetMap: 'iceCave', targetX: 7, targetY: 13 },
            'T': { isTown: true, name: "辺境の村", npcs: [] } // この村には特定のNPCはいない設定
        },
        chests: {
            '2-11': { opened: false, content: { type: 'item', name: '暖かい外套', quantity: 1 } },
            '5-4':  { opened: false, content: { type: 'spell', name: '氷の矢' } },
            '8-2':  { opened: false, content: { type: 'item', name: '金貨', quantity: 200 } },
            '11-9': { opened: false, content: { type: 'mimic' } },
        }
    },
    // ... (rest of the map data)
};

const npcDatabase = {
    "fern": {
        name: "フェルン",
        sprite: "👩‍🦳",
        position: { top: '40%', left: '30%' },
        dialogue: "あら、こんにちは。少し、薬草が足りなくて困っているんです。もしよかったら、集めるのを手伝ってもらえませんか？",
        questId: "collectHerbs"
    },
    "stark": {
        name: "シュタルク",
        sprite: "🧑‍🦰",
        position: { top: '60%', left: '70%' },
        dialogue: "よう。俺はシュタルク。最近、森のゴブリンが活発で困ってるんだ。あんた、腕に覚えがあるなら、少し懲らしめてきてくれないか？",
        questId: "subdueGoblins"
    }
};

const questDatabase = {
    "collectHerbs": {
        title: "フェルンの薬草集め",
        description: "聖都シュトラールにいるフェルンのために、薬草を5つ集める。",
        objective: { type: "collect", target: "薬草", required: 5 },
        reward: { type: "gold", amount: 100 }
    },
    "subdueGoblins": {
        title: "ゴブリン討伐",
        description: "聖都シュトラールにいるシュタルクのために、北の森のゴブリンを3体討伐する。",
        objective: { type: "kill", target: "ゴブリン", required: 3 },
        reward: { type: "item", name: "魔石", quantity: 5 }
    }
};

