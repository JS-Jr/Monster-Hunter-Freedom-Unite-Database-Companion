// src/types/Armor.ts

export type Skills = {
  name: String;
  amount: number;
}

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
  name: string;
  type: string;            // "head", "body", "arms", "waist", "legs"
  hunter_type: String,
  gender: string;          // "male", "female", "both"
  rarity: number;
  defense: number;
  resistances: ArmorResistances;
  slots: number;          // 00- -> 2
  skills: Skills[];
  create_cost: number;
  create_mats: ArmorMaterial[];
};
