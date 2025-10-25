# 🧭 Monster Hunter Freedom Unite Database Companion – Roadmap

A static, open-source web app that serves as a full data explorer for **Monster Hunter Freedom Unite (MHFU)**.  
The goal is to provide modern, organized access to game information — weapons, armor, monsters, materials, and maps — using clean JSON/CSV data and a simple React frontend.

---

## 🗺️ Project Overview

- **Tech Stack:** React (Vite), Static JSON/CSV, GitHub Pages or Netlify for hosting  
- **Database:** None — static data only  
- **Goal:** Build a single-page web app that lets users explore and cross-reference MHFU data interactively  
- **Type:** Learning + utility project (open for contribution)

---

## 🧩 Phases & Milestones

Each **Phase** corresponds to one or more **Epics** (see `/docs/epics/` for detailed breakdowns).

---

### 🏁 **Phase 1: Data Preparation**
> Convert existing community data (HTML, wikis, etc.) into consistent JSON or CSV files.

**Goals:**
- Parse weapon trees, armor lists, monster data, and materials.
- Normalize schemas across all datasets.
- Validate IDs and references between files.
- Store everything in `/src/data/`.

**Deliverable:**  
`/src/data/weapons.json`, `/src/data/armor.json`, `/src/data/monsters.json`, `/src/data/materials.json`, `/src/data/maps.json`

---

### ⚙️ **Phase 2: Core Application Setup**
> Build the basic app structure and render static data.

**Goals:**
- Initialize React + Vite project.  
- Set up routing (`/weapons`, `/armor`, `/monsters`, `/materials`, `/maps`).  
- Implement basic layout and navigation.  
- Create base reusable components (tables, filters, detail cards).  

**Deliverable:**  
Static app that loads and displays mock JSON data.

---

### ⚔️ **Phase 3: Weapon & Armor Systems**
> Build an interactive weapon/armor browser.

**Goals:**
- Create expandable **weapon trees** (e.g., Bone → Wolf → Shark → Dragon...).  
- Add filters (rarity, sharpness, element, abnormal status).  
- Show weapon/armor details (cost, materials, upgrade path).  
- Make materials clickable → navigate to detail pages.  

**Deliverable:**  
Fully functional weapon & armor explorer.

---

### 🧱 **Phase 4: Monster Encyclopedia**
> Create a comprehensive monster database with detailed stats.

**Goals:**
- Monster list view with filters and sorting.  
- Monster detail pages (HP, size, weakness, hitzones, drops).  
- Cross-link drops → materials.  
- Show habitats and map areas.  

**Deliverable:**  
Interactive monster encyclopedia with drop data and links.

---

### 💎 **Phase 5: Material Database**
> Implement material explorer with full linking.

**Goals:**
- Material list with filters (rarity, type, source).  
- Material details (where to get, drop rates, uses).  
- Clickable references between materials, weapons, and monsters.  

**Deliverable:**  
Material database with bidirectional linking.

---

### 🗺️ **Phase 6: Map Explorer**
> Interactive map showing resource locations and loot zones.

**Goals:**
- Map selector (Forest, Volcano, Jungle, etc.).  
- Clickable map zones → show possible gathers/mines.  
- Filter by item type (ore, herb, insect).  
- Sync data with `/src/data/maps.json`.  

**Deliverable:**  
Interactive map view with linked materials.

---

### 🧮 **Phase 7: Advanced Features (Optional)**
> Add extra tools and utilities once core systems are stable.

**Ideas:**
- Build planner (combine weapons + armor).  
- Search by skill or element.  
- Total craft cost calculator.  
- Player inventory tracker (localStorage).  
- PWA offline mode.

---

### 🎨 **Phase 8: UI / UX & Polish**
> Improve usability, design, and responsiveness.

**Goals:**
- Sketch UI mockups for all pages.  
- Add icons for weapon types, elements, rarity stars.  
- Improve typography, spacing, and colors.  
- Add tooltips and animations for transitions.  
- Ensure mobile responsiveness.

---

### 🚀 **Phase 9: Deployment & Documentation**
> Finalize and publish the project.

**Goals:**
- Deploy to GitHub Pages or Netlify.  
- Write clear README and contribution guide.  
- Add changelog and versioning notes.  
- (Optional) Purchase domain like `mhfu.tools`.

**Deliverable:**  
Public, static site with full documentation.

---

## 📘 Supporting Docs

| File | Purpose |
|------|----------|
| `/docs/ROADMAP.md` | This overview document |
| `/docs/epics/` | Detailed breakdown of each phase (tasks, dependencies) |
| `/docs/DATA_FORMATS.md` | Schema definitions for all JSON/CSV files |
| `/docs/IDEAS.md` | Experimental ideas, notes, or concepts |
| `/docs/MOCKUPS/` | UI sketches or screenshots |

---

## 🧱 Development Plan Summary

| Phase | Focus | Key Output |
|--------|--------|-------------|
| 1 | Data Preparation | JSON/CSV data files |
| 2 | Core Setup | React base app |
| 3 | Weapons & Armor | Tree + filters + details |
| 4 | Monsters | Encyclopedia + drops |
| 5 | Materials | Source & usage linking |
| 6 | Maps | Interactive zones |
| 7 | Extras | Planner + search + tools |
| 8 | UI Polish | Final design + responsiveness |
| 9 | Deploy | Public release |

---

## 🏷️ Notes

- Keep everything **static** — no external DB.  
- Use **JSON imports or fetch** to load data.  
- Document every schema change in `/docs/DATA_FORMATS.md`.  
- Each epic should have its own Markdown file in `/docs/epics/`.  

---

**Status:** 🟢 *Planning stage*  
**Maintainer:** *Your Name*  
**Repo:** [ ]( )

---
