// src/types/Armor.ts
export type ArmorType = "Helmet" | "Plate" | "Gauntlets" | "Waist" | "Leggings";
export type Gender = "Male" | "Female" | "Both";
export type HunterType = "Blademaster" | "Gunner";
export type Skills = {
  name: string;
  amount: number;
  positive: boolean;
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
  type: string; // e.g. ore, pelt
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

// For json
export type SkillJson = {
  name: string;
  amount: string;
};

export type CreateMatsJson = {
  name: string;
  amount: string;
  type: string;
  color: string;
};

export type ArmorJson = {
  name: string;
  type: string;
  hr: string;
  elder: string;
  defence: string;
  fire_res: string;
  thunder_res: string;
  dragon_res: string;
  water_res: string;
  ice_res: string;
  sex: string;
  hunter_type: string;
  rarity: string;
  slots: string;
  create_cost: string;
  skills: SkillJson[];
  create_mats: CreateMatsJson[];
};
