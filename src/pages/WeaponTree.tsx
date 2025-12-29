import { useMemo, useState, useRef, useEffect } from "react";
import Tree from "react-d3-tree";
import type { Weapon } from "../types/Weapon";
import { buildWeaponTree } from "../function/buildWeaponTree";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { TableSkeleton } from "../components/TableSkeletonProps";

export default function WeaponTree() {
  const { data: weapons, loading } = useDataFetchArray<Weapon>(
    "/data/weapons.json"
  );

  const [initialDepth, setInitialDepth] = useState<number>(1);
  const [expandAll, setExpandAll] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [onlyUpgradeable, setOnlyUpgradeable] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 300, y: 60 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const weaponTypes = useMemo(() => {
    if (!weapons) return [] as string[];
    return Array.from(new Set(weapons.map((w) => w.type).filter(Boolean))) as string[];
  }, [weapons]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth || 800;
    setTranslate({ x: Math.round(w / 2), y: 60 });
  }, [weapons]);

  const filteredWeapons = useMemo(() => {
    if (!weapons) return [] as Weapon[];

    return weapons.filter((w) => {
      if (typeFilter !== "All" && w.type !== typeFilter) return false;

      if (onlyUpgradeable) {
        const hasFrom = !!w.improve_from;
        const hasTo = !!(w.improve_to && w.improve_to.length > 0);
        return hasFrom || hasTo;
      }

      return true;
    });
  }, [weapons, typeFilter, onlyUpgradeable]);

  const treeData = useMemo(() => {
    if (!filteredWeapons || filteredWeapons.length === 0) return null;
    return buildWeaponTree(filteredWeapons as Weapon[]);
  }, [filteredWeapons]);

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Weapon Tree</h1>
        <TableSkeleton rows={6} columns={3} />
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Weapon Tree</h1>
        <p>No weapon data available.</p>
      </div>
    );
  }

  const effectiveDepth = expandAll ? 10 : initialDepth;
  const treeKey = `${effectiveDepth}-${expandAll}-${typeFilter}-${onlyUpgradeable}-${filteredWeapons.length}-${zoom}-${translate.x}`;

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]" ref={containerRef}>
      <h1 className="text-3xl font-bold mb-4">Weapon Tree</h1>

      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <label className="text-sm">Initial depth</label>
        <select
          value={initialDepth}
          onChange={(e) => setInitialDepth(Number(e.target.value))}
          className="p-1 rounded"
        >
          <option value={0}>0 (root)</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>

        <button
          className="ml-2 px-3 py-1 bg-[#5A3F28] text-white rounded"
          onClick={() => setExpandAll((v) => !v)}
        >
          {expandAll ? "Collapse" : "Expand All"}
        </button>

        <div className="ml-2 inline-flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setZoom((z) => Math.max(0.2, +(z - 0.2).toFixed(2)))}
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="px-2">{Math.round(zoom * 100)}%</span>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            className="ml-2 px-3 py-1 bg-[#5A3F28] text-white rounded"
            onClick={() => {
              setZoom(1);
              const el = containerRef.current;
              const w = el ? el.clientWidth || 800 : 600;
              setTranslate({ x: Math.round(w / 2), y: 60 });
            }}
          >
            Reset View
          </button>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <label className="text-sm">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1 rounded"
          >
            <option value="All">All</option>
            {weaponTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <label className="ml-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyUpgradeable}
            onChange={(e) => setOnlyUpgradeable(e.target.checked)}
          />
          Only show weapons in upgrade paths
        </label>
      </div>

      <div className="w-full h-[72vh] bg-white rounded p-2">
        <div style={{ width: "100%", height: "100%" }}>
            {treeData ? (
            <Tree
              key={treeKey}
              data={treeData}
              zoomable
              zoom={zoom}
              scaleExtent={[0.2, 3]}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              translate={translate}
              collapsible={true}
              orientation="vertical"
              pathFunc="elbow"
              initialDepth={effectiveDepth}
            />
          ) : (
            <div className="p-4 text-[#5A3F28]">No weapons match the selected filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
