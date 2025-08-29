// ==================================================================
//  Map Database
// ==================================================================
// f: Forest, p: Plains, T: Town, C: Cave Entrance, w: Wall, ' ': Floor, E: Exit
// S: Path to Snow, M: Path to Forest, B: Treasure Box
// ==================================================================

const mapDatabase = {
    "northernForest": {
        name: "北の森",
        terrainType: "forest",
        layout: [
            ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['f', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'B', 'p', 'p', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'T', 'p', 'p', 'f', 'p', 'p', 'p', 'p', 'f', 'f', 'p', 'f'],
            ['f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f', 'B', 'f', 'p', 'f'],
            ['f', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'B', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f', 'f', 'p', 'f', 'f', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f', 'f', 'p', 'C', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'p', 'p', 'B', 'p', 'f'],
            ['f', 'p', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
        ],
        startPosition: { x: 7, y: 13 },
        portals: {
            'S': { targetMap: 'snowyPlains', targetX: 7, targetY: 13 },
            'C': { targetMap: 'goblinCave', targetX: 1, targetY: 13 },
            'T': { isTown: true, name: "聖都シュトラール" }
        },
        chests: {
            "2-3": { content: { type: "item", name: "薬草", quantity: 3 }, opened: false },
            "4-11": { content: { type: "item", name: "魔石", quantity: 5 }, opened: false },
            "6-1": { content: { type: "spell", name: "火の魔法" }, opened: false },
            "10-12": { content: { type: "mimic" }, opened: false }
        }
    },
    "goblinCave": {
        name: "ゴブリンの洞窟",
        terrainType: "cave",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'B', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', 'B', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', 'B', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'B', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'E', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: {
            'E': { targetMap: 'northernForest', targetX: 12, targetY: 9 }
        },
        chests: {
            "1-12": { content: { type: "item", name: "金貨", quantity: 200 }, opened: false },
            "3-13": { content: { type: "mimic" }, opened: false },
            "5-1": { content: { type: "item", name: "魔石", quantity: 10 }, opened: false },
            "12-9": { content: { type: "spell", name: "氷の矢" }, opened: false }
        }
    },
    "snowyPlains": {
        name: "雪深き辺境",
        terrainType: "snow",
        layout: [
            ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 'T', 's', 'f', 'f', 's', 'f', 'f', 's', 's', 'C', 's', 'f'],
            ['f', 's', 'B', 's', 's', 's', 'f', 's', 'f', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'f', 'f', 'f', 's', 's', 's', 's', 's', 'f', 'f', 'f', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 'f', 'f', 'f', 'f', 's', 'B', 's', 's', 's', 'f', 'f', 'f', 'f', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'B', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'f', 'f', 'f', 'f', 's', 's', 's', 'f', 'f', 'f', 'f', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'B', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
        ],
        portals: {
            'M': { targetMap: 'northernForest', targetX: 7, targetY: 1 },
            'C': { targetMap: 'iceCave', targetX: 7, targetY: 13 },
            'T': { isTown: true, name: "辺境の村" }
        },
        chests: {
            "3-2": { content: { type: "item", name: "金貨", quantity: 50 }, opened: false },
            "6-6": { content: { type: "mimic" }, opened: false },
            "7-13": { content: { type: "item", name: "薬草", quantity: 10 }, opened: false },
            "10-10": { content: { type: "mimic" }, opened: false },
        }
    },
    "iceCave": {
        name: "氷結洞窟",
        terrainType: "snow",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', 'w', ' ', ' ', ' ', ' ', 'B', ' ', ' ', 'w', ' ', ' ', 'w'],
            ['w', ' ', 'w', 'w', ' ', 'w', 'w', ' ', 'w', 'w', ' ', 'w', ' ', 'w', 'w'],
            ['w', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', ' ', 'w', 'B', 'w'],
            ['w', ' ', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', 'B', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'B', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'E', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: {
            'E': { targetMap: 'snowyPlains', targetX: 12, targetY: 3 }
        },
        chests: {
            "1-8": { content: { type: "spell", name: "聖なる光" }, opened: false }, // Placeholder for a new spell
            "5-13": { content: { type: "mimic" }, opened: false },
            "7-1": { content: { type: "item", name: "金貨", quantity: 500 }, opened: false },
            "11-11": { content: { type: "item", name: "魔石", quantity: 20 }, opened: false }
        }
    }
};
