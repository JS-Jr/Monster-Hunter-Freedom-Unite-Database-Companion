import { useMemo, useState } from "react";
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

  const treeData = useMemo(() => {
    if (!weapons || weapons.length === 0) return null;
    return buildWeaponTree(weapons as Weapon[]);
  }, [weapons]);

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

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-4">Weapon Tree</h1>

      <div className="mb-4 flex items-center gap-4">
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
      </div>

      <div className="w-full h-[72vh] bg-white rounded p-2">
        <div style={{ width: "100%", height: "100%" }}>
          <Tree
            data={treeData}
            zoomable
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            translate={{ x: 300, y: 60 }}
            collapsible={true}
            orientation="vertical"
            pathFunc="elbow"
            initialDepth={effectiveDepth}
            // styles={{ links: { stroke: "#5A3F28" }, nodes: { node: { stroke: "#5A3F28" } } }}
          />
        </div>
      </div>
    </div>
  );
}
