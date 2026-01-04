// src/types/Armor.ts
export type ArmorType = "Helmet" | "Plate" | "Gauntlets" | "Waist" | "Leggings";
export type Gender = "Male" | "Female" | "Both";
export type HunterType = "Blademaster" | "Gunner";

export type Skills = {
  name: string;
  amount: number;
};

export type ArmorResistances = {
  fire: number;
  water: number;
  thunder: number;
  ice: number;
  dragon: number;
};

export type ArmorMaterial = {
  name: string;
  amount: string;
  type: string;  // e.g. "ore", "pelt"
  color: string; // display color hint
};

export type Armor = {
  identifier: string;
  name: string;
  type: ArmorType;
  hunter_type: HunterType;
  gender: Gender;
  rarity: number;
  defense: number;
  resistances: ArmorResistances;
  slots: number;
  skills: Skills[];
  create_cost: number;
  create_mats: ArmorMaterial[];
};
