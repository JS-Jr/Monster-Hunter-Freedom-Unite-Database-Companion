import type { Weapon } from "../types/Weapon";

export function buildWeaponTree(weapons: Weapon[]) {
  const map = new Map<string, any>();

  // Create blank nodes
  weapons.forEach((w) => {
    map.set(w.name, { name: w.name, children: [] });
  });

  // Link parents to children
  weapons.forEach((w) => {
    const node = map.get(w.name);

    if (w.improve_to) {
      w.improve_to.forEach((childName) => {
        const child = map.get(childName);
        if (child) node.children.push(child);
      });
    }
  });

  // Find roots (those with no improve_from)
  const roots = weapons.filter((w) => !w.improve_from).map((w) => map.get(w.name));

  // If multiple roots (common in MH), return a virtual root
  if (roots.length > 1) {
    return {
      name: "Weapon Tree",
      children: roots,
    };
  } else {
    return roots[0];
  }
}
