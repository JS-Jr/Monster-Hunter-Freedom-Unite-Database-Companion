// src/types/Armor.ts

export type ArmorDefense = {
  base: number;
  max: number;
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
  name: string;
  type: string;            // "head", "body", "arms", "waist", "legs"
  gender: string | null;   // "male", "female", "both"
  rarity: number;
  defense: ArmorDefense;
  resistances: ArmorResistances;
  slots: string;           // e.g. "OO-", "---"
  skills?: Record<string, number>;
  create_cost: number | null;
  create_mats: ArmorMaterial[];
};
