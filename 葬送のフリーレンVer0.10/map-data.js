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
            'T': { isTown: true, name: "聖都シュトラール", facilities: ["inn", "shop", "blacksmith"] }
        },
        chests: {
            '1-4':  { opened: false, content: { type: 'item', name: '薬草', quantity: 2 } },
            '3-10': { opened: false, content: { type: 'spell', name: '火の魔法' } },
            '6-2':  { opened: false, content: { type: 'mimic' } },
            '10-11':{ opened: false, content: { type: 'item', name: '金貨', quantity: 150 } },
        }
    },
    "southernDesert": {
        name: "南部砂漠",
        terrainType: "desert",
        layout: [
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'B', 'd'],
            ['d', 'o', 'o', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'o', 'o', 'd', 'd', 'B', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'A', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'B', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'B', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
        ],
        portals: {
            'M': { targetMap: 'northernForest', targetX: 7, targetY: 13 },
            'U': { targetMap: 'ruinedCapital', targetX: 7, targetY: 1 },
            'A': { isTown: true, name: "魔法都市オイサースト", facilities: ["inn", "association"] }
        },
        chests: {
            '1-13': { opened: false, content: { type: 'item', name: '解毒薬', quantity: 3 } },
            '3-5':  { opened: false, content: { type: 'mimic' } },
            '8-1':  { opened: false, content: { type: 'item', name: '金貨', quantity: 300 } },
            '11-7': { opened: false, content: { type: 'spell', name: '砂嵐' } },
        }
    },
    "ruinedCapital": {
        name: "忘れ去られた王都",
        terrainType: "ruins",
        layout: [
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'B', 'R', 'R', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', ' ', 'w', 'w', 'w', ' ', 'w', 'w', ' ', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', ' ', 'w', ' ', ' ', 'B', ' ', 'w', ' ', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', ' ', 'w', ' ', 'T', ' ', ' ', 'w', ' ', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', ' ', 'w', 'w', ' ', 'w', 'w', 'w', ' ', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', ' ', ' ', ' ', 'B', ' ', ' ', ' ', ' ', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', 'B', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'd'],
            ['d', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
        ],
        portals: {
            'T': { targetMap: 'southernDesert', targetX: 7, targetY: 13 }
        },
        chests: {
            '2-8': { opened: false, content: { type: 'item', name: 'エーテル', quantity: 1 } },
            '5-7': { opened: false, content: { type: 'spell', name: 'ゴーレムを破壊する魔法' } },
            '8-6': { opened: false, content: { type: 'mimic' } },
            '11-3':{ opened: false, content: { type: 'item', name: '古代のコイン', quantity: 5 } },
        }
    },
    "goblinCave": {
        name: "ゴブリンの洞窟",
        terrainType: "cave",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', 'B', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', 'B', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'B', 'w', ' ', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'B', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'E', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: { 'E': { targetMap: 'northernForest', targetX: 12, targetY: 8 } },
        chests: {
            '1-6':  { opened: false, content: { type: 'item', name: '金貨', quantity: 50 } },
            '5-3':  { opened: false, content: { type: 'item', name: '薬草', quantity: 3 } },
            '8-7':  { opened: false, content: { type: 'mimic' } },
            '11-10':{ opened: false, content: { type: 'spell', name: '明かりの魔法' } },
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
            'T': { isTown: true, name: "辺境の村", facilities: ["inn", "shop"] }
        },
        chests: {
            '2-11': { opened: false, content: { type: 'item', name: '暖かい外套', quantity: 1 } },
            '5-4':  { opened: false, content: { type: 'spell', name: '氷の矢' } },
            '8-2':  { opened: false, content: { type: 'item', name: '金貨', quantity: 200 } },
            '11-9': { opened: false, content: { type: 'mimic' } },
        }
    },
    "iceCave": {
        name: "氷結洞窟",
        terrainType: "snow",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'B', 'w'],
            ['w', ' ', 'w', 'w', ' ', 'w', 'w', ' ', 'w', 'w', ' ', 'w', ' ', 'w', 'w'],
            ['w', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', 'w', ' ', 'w', 'B', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', 'B', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'B', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'E', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: { 'E': { targetMap: 'snowyPlains', targetX: 12, targetY: 2 } },
        chests: {
            '1-13': { opened: false, content: { type: 'item', name: 'エーテル', quantity: 2 } },
            '5-8':  { opened: false, content: { type: 'mimic' } },
            '9-6':  { opened: false, content: { type: 'item', name: '金貨', quantity: 500 } },
            '12-11':{ opened: false, content: { type: 'spell', name: '聖なる光' } },
        }
    }
};

