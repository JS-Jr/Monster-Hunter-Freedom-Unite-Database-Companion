# 📘 Data Format Reference (`DATA_FORMATS.md`)

This document defines the structure for all static data files used by the app.
All files live under:

```
/src/data/
├── weapons.json
├── armor.json
├── monsters.json
├── materials.json
├── maps.json
```

Each file should be valid **JSON** (preferred) or **CSV** if easier to generate.
All IDs should be **lowercase** and **dash-separated** (`rathalos-scale`, not `Rathalos Scale`).

---

## ⚔️ Weapons — `weapons.json`

### Schema

```json
{
  "id": "divine-slasher",
  "name": "Divine Slasher",
  "type": "Long Sword",
  "rarity": 8,
  "attack": 960,
  "element": {
    "type": "Dragon",
    "value": 280
  },
  "affinity": 0,
  "sharpness": ["red", "orange", "yellow", "green", "blue", "white"],
  "upgrade_from": "supremacy-blade",
  "upgrade_to": ["hellish-slasher"],
  "cost": 60000,
  "materials": [
    { "id": "wyvern-skull-shard", "qty": 3 },
    { "id": "elder-dragon-blood", "qty": 2 }
  ]
}
```

### Notes

* `upgrade_from` / `upgrade_to` build the weapon tree.
* `materials` link to `materials.json` by `id`.
* Sharpness can also be stored as `{ "red": 20, "green": 35, ... }` if lengths matter.

---

## 🛡️ Armor — `armor.json`

### Schema

```json
{
  "id": "rathalos-helm-s",
  "name": "Rathalos Helm S",
  "type": "Head",
  "set": "Rathalos S",
  "rarity": 7,
  "defense": {
    "base": 72,
    "max": 100
  },
  "resistances": {
    "fire": 4,
    "water": -1,
    "thunder": 0,
    "ice": 0,
    "dragon": -3
  },
  "skills": [
    { "name": "Attack Up (M)", "points": 10 },
    { "name": "Fire Resistance", "points": 5 }
  ],
  "gender": "Both",
  "materials": [
    { "id": "rathalos-scale+", "qty": 3 },
    { "id": "rathalos-plate", "qty": 1 }
  ]
}
```

### Notes

* Use `"set"` to group pieces into armor sets.
* Skills can later be aggregated to calculate total effects.
* `gender` can be `"Male"`, `"Female"`, or `"Both"`.

---

## 🐉 Monsters — `monsters.json`

### Schema

```json
{
  "id": "rathalos",
  "name": "Rathalos",
  "species": "Flying Wyvern",
  "elements": ["Fire"],
  "ailments": ["Poison"],
  "weaknesses": [
    { "element": "Dragon", "stars": 3 },
    { "element": "Thunder", "stars": 2 }
  ],
  "hitzones": {
    "cut": { "head": 65, "wings": 45, "tail": 30 },
    "blunt": { "head": 70, "wings": 40, "tail": 25 },
    "shot": { "head": 60, "wings": 50, "tail": 35 }
  },
  "drops": {
    "low_rank": [
      { "material_id": "rathalos-scale", "method": "Carve", "chance": 35 },
      { "material_id": "rathalos-shell", "method": "Reward", "chance": 25 }
    ],
    "high_rank": [
      { "material_id": "rathalos-scale+", "method": "Carve", "chance": 40 }
    ]
  },
  "locations": [
    { "map_id": "volcano", "zones": [5, 6, 8] }
  ],
  "hp_range": { "low": 2000, "high": 5000 }
}
```

### Notes

* `drops` reference `materials.json`.
* `locations` link to maps using `map_id`.
* Weaknesses use `stars` (1–3) to rank effectiveness.

---

## 💎 Materials — `materials.json`

### Schema

```json
{
  "id": "rathalos-scale",
  "name": "Rathalos Scale",
  "rarity": 4,
  "type": "Monster Part",
  "description": "A scale from a Rathalos. Durable and beautiful.",
  "sources": [
    { "type": "Monster", "monster_id": "rathalos", "rank": "Low", "method": "Carve", "chance": 35 },
    { "type": "Quest Reward", "quest": "King of the Skies", "chance": 20 }
  ],
  "used_in": [
    { "category": "Weapon", "id": "fire-dragonsword" },
    { "category": "Armor", "id": "rathalos-mail" }
  ]
}
```

### Notes

* Materials are the **core linking point** between weapons, armor, and monsters.
* `sources[].type` can be `"Monster"`, `"Map"`, or `"Quest Reward"`.
* `used_in` connects back to crafting recipes.

---

## 🗺️ Maps — `maps.json`

### Schema

```json
{
  "id": "volcano",
  "name": "Volcano",
  "ranks": ["Low", "High", "G"],
  "zones": [
    {
      "id": 3,
      "type": "Mining",
      "items": [
        { "material_id": "iron-ore", "chance": 30 },
        { "material_id": "dragonite-ore", "chance": 10 }
      ]
    },
    {
      "id": 6,
      "type": "Bug Gathering",
      "items": [
        { "material_id": "insect-husk", "chance": 40 },
        { "material_id": "carpenterbug", "chance": 15 }
      ]
    }
  ]
}
```

### Notes

* Each `zone` has a type (Mining, Bug Gathering, Fishing, etc.).
* Materials link via `material_id` → `materials.json`.
* Zones correspond to in-game area numbers.

---

## 🔄 Cross-Link Reference Table

| From (File)      | To (File)                    | Field                         |
| ---------------- | ---------------------------- | ----------------------------- |
| `weapons.json`   | `materials.json`             | `materials[].id`              |
| `armor.json`     | `materials.json`             | `materials[].id`              |
| `monsters.json`  | `materials.json`             | `drops[].material_id`         |
| `materials.json` | `weapons.json`, `armor.json` | `used_in[].id`                |
| `maps.json`      | `materials.json`             | `zones[].items[].material_id` |

---

## ✅ Data Guidelines

* Use **lowercase dashed IDs** for consistency.
* Keep all lists alphabetized for readability.
* Include all numeric stats in base units (no scaling multipliers).
* Validate JSON syntax before commit.
* When unsure, prefer clarity over complexity — this data will be read directly by your frontend.
