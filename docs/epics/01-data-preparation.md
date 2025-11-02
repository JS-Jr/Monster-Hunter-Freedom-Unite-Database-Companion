# 🧩 Epic 1: Data Preparation

### 🎯 Goal
Collect and normalize all raw MHFU data into clean, structured **JSON** or **CSV** files ready for the frontend.

### 🧱 Deliverables
- `/src/data/weapons.json`      [Check]
- `/src/data/armor.json`        [Check]
- `/src/data/monsters.json`     [Check]
<!-- https://monsterhunter.fandom.com/wiki/MHFU:_Monster_Material_List#READ_FIRST -->
- `/src/data/materials.json`    [Check]
- `/src/data/maps.json`         [Check]
- `/docs/DATA_FORMATS.md` (schema reference)

### 📋 Tasks
- [ ] Parse weapon tree HTML into JSON or CSV.
- [ ] Extract armor data (defense, rarity, skills, materials).
- [ ] Gather monster data (HP, weaknesses, hitzones, drops).
- [ ] Extract material data (source, rarity, uses).
- [ ] Map location data (gather/mining spots, item pools).
- [ ] Define consistent schema across all data files.
- [ ] Validate references (materials link to monsters/weapons properly).
- [ ] Write data verification script (optional).

### 🔗 Dependencies
None (first phase).

### 📎 Notes
Keep this phase simple and readable — your goal is *usable data*, not perfect parsing scripts.  
Raw source sites: `mhfu.vallode.com`, `monsterhunter.fandom.com`, community spreadsheets.
