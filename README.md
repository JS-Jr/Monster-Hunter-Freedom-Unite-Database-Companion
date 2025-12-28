# Monster Hunter Freedom Unite — Database Companion

A fast, data-driven companion web app for Monster Hunter Freedom Unite. Built with React, TypeScript and Vite, it provides searchable and browsable JSON-powered data for weapons, armor, monsters, maps, decorations and skills.

Key points
- **UI:** React + Vite + TypeScript (see `src/`)
- **Data:** JSON files under `public/data/` (armor.json, weapons.json, monster.json, item.json, etc.)
- **Maps & markers:** Leaflet + `react-leaflet` (see `src/pages/MapDetail*.tsx`)
- **Extraction tools & scripts:** Python / PowerShell helpers under `html-ref/` for building the raw JSON data

Quick start
1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build locally:

```bash
npm run preview
```

Available scripts (from `package.json`)
- `dev`: runs Vite dev server
- `build`: runs TypeScript build and `vite build`
- `preview`: serves the production build
- `lint`: runs ESLint

Project structure (high-level)
- `public/data/` — compiled JSON data used by the app (armor.json, weapons.json, monster.json, maps, skills, decorations)
- `src/` — application source code
  - `src/pages/` — page components (Armor, Weapon, Monster, Map, Details...)
  - `src/components/` — reusable UI components (tables, filters, map markers)
  - `src/function/` — helpers like `buildWeaponTree.tsx` and `deepSearch.tsx`
  - `src/hooks/` — `useDataFetch.ts`, `useUrlFilters.ts`
- `html-ref/` — data extraction and conversion scripts (Python / PowerShell) used to create or update `public/data/`
- `docs/` — design notes, data formats and roadmap

Data sources & tooling
- If you want to update the data, source scripts live in `html-ref/` (for example `html-ref/item/mhfu_extract.py`, `html-ref/maps/mhfu_resource_maps_extract.py`, and `html-ref/decoration/decoration-modifier.py`). Run and adapt those scripts to re-generate the JSON files in `public/data/`.
- The app reads the JSON files directly from `public/data/` at runtime — no server required.

Development notes
- Uses Vite, React 19 and TypeScript. Tailwind is present in the dev dependencies.
- Map pages use `leaflet` + `react-leaflet`.
- Table and tree views use `@tanstack/react-table` and `react-d3-tree`.

Contributing
- To contribute data updates: run or adapt the scripts in `html-ref/` and commit updated files under `public/data/`.
- For UI changes: run `npm run dev`, make changes in `src/`, and open a PR.

Further reading
- Data format and internal notes: see `docs/DATA_FORMATS.md` and the files in `docs/epics/` for the roadmap and design decisions.

License
- Check `package.json` or ask the repository owner for the intended license before publishing.

<!-- Files you may want to open first
- `src/main.tsx` — app entry
- `public/data/` — data used by the site
- `html-ref/` — data extraction utilities -->

<!-- If you'd like, I can also:
- run a quick spellcheck/lint pass on the README
- commit these changes and prepare a PR draft -->
