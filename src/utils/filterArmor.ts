// // utils/filterArmor.ts

// import type { Armor } from "../types/Armor";
// // import type { ArmorFilters } from "../types/ArmorFilters";
// import type { ArmorFilters } from "../types/ArmorFilters"

// export function filterArmors(armors: Armor[], filters: ArmorFilters): Armor[] {
//   return armors.filter((armor) => {
//     // 1. Name contains (case-insensitive)
//     if (
//       filters.name &&
//       !armor.name.toLowerCase().includes(filters.name.toLowerCase())
//     ) {
//       return false;
//     }

//     // 2. Type match
//     if (filters.type && armor.type !== filters.type) {
//       return false;
//     }

//     // 3. Gender
//     if (filters.gender && armor.gender !== filters.gender) {
//       return false;
//     }

//     // 4. Rarity
//     if (filters.rarity && armor.rarity !== filters.rarity) {
//       return false;
//     }

//     // 5. Defense range
//     const baseDefense = armor.defense?.base || 0;
//     if (filters.minDefense && baseDefense < filters.minDefense) {
//       return false;
//     }
//     if (filters.maxDefense && baseDefense > filters.maxDefense) {
//       return false;
//     }

//     // 6. Resistances
//     if (filters.resistances) {
//       for (const key in filters.resistances) {
//         const minRequired =
//           filters.resistances[key as keyof typeof filters.resistances]!;
//         const armorValue =
//           armor.resistances[key as keyof typeof armor.resistances];
//         if (armorValue < minRequired) return false;
//       }
//     }

//     // 7. Slots
//     if (filters.minSlots !== undefined && armor.slots < filters.minSlots) {
//       return false;
//     }

//     // 8. Skill filters
//     if (filters.skillName) {
//       const hasSkill = armor.skills.some(
//         (s) =>
//           s.name.toLowerCase().includes(filters.skillName!.toLowerCase()) &&
//           (filters.skillMinAmount ? s.amount >= filters.skillMinAmount : true)
//       );
//       if (!hasSkill) return false;
//     }

//     // 9. Create cost
//     if (
//       filters.maxCreateCost !== undefined &&
//       armor.create_cost > filters.maxCreateCost
//     ) {
//       return false;
//     }

//     // 10. Material filter
//     if (filters.hasMaterial) {
//       const hasMat = armor.create_mats.some((m) =>
//         m.name.toLowerCase().includes(filters.hasMaterial!.toLowerCase())
//       );
//       if (!hasMat) return false;
//     }

//     return true;
//   });
// }
