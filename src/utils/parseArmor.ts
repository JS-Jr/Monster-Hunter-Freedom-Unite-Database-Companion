// utils/parseArmor.ts

import type {
  Armor,
  ArmorResistances,
  Skills,
  ArmorMaterial,
} from "../types/Armor";

export function parseArmor(raw: any): Armor {
  const resistances: ArmorResistances = {
    fire: Number(raw.fire_res) || 0,
    water: Number(raw.water_res) || 0,
    thunder: Number(raw.thunder_res) || 0,
    ice: Number(raw.ice_res) || 0,
    dragon: Number(raw.dragon_res) || 0,
  };

  const create_mats: ArmorMaterial[] = Array.isArray(raw.create_mats)
    ? raw.create_mats.map((m: any) => ({
        name: m.name || "",
        amount: String(m.amount || "0"),
        type: m.type || "",
        color: m.color || "",
      }))
    : [];

  const skills: Skills[] = Array.isArray(raw.skills)
    ? raw.skills.map((s: any) => ({
        name: s.name || "",
        amount: Number(s.amount) || 0,
      }))
    : [];

  // Normalize gender
  const gender =
    raw.sex?.toLowerCase().includes("male") &&
    raw.sex?.toLowerCase().includes("female")
      ? "both"
      : raw.sex?.toLowerCase().includes("male")
      ? "male"
      : "female";

  const slots =
    typeof raw.slots === "string"
      ? [...raw.slots].filter((c) => c === "O").length
      : 0;

  return {
    name: raw.name || "Unknown Armor",
    type: raw.type || "Unkwon Type",
    gender,
    rarity: Number(raw.rarity) || 0,
    defense: raw.defence,
    resistances,
    slots,
    skills,
    create_cost: Number(raw.create_cost) || 0,
    create_mats,
  };
}
