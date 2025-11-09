import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import type { Weapon } from "../types/Weapon";
import { buildWeaponTree } from "../function/buildWeaponTree";

export default function WeaponTree() {
  const [treeData, setTreeData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/weapons.json")
      .then((res) => res.json())
      .then((data: Weapon[]) => {
        const tree = buildWeaponTree(data);
        setTreeData(tree);
      });
  }, []);

  if (!treeData) return <p>Loading tree...</p>;

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <Tree
        data={treeData}
        zoomable
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        translate={{ x: 300, y: 100 }}
        collapsible={true}
        orientation="vertical"
        pathFunc="elbow"
      />
    </div>
  );
}
