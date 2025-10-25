# 🧩 Epic 1: Data Preparation

### 🎯 Goal
Collect and normalize all raw MHFU data into clean, structured **JSON** or **CSV** files ready for the frontend.

### 🧱 Deliverables
- `/src/data/weapons.json`
- `/src/data/armor.json`
- `/src/data/monsters.json`
- `/src/data/materials.json`
- `/src/data/maps.json`
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
