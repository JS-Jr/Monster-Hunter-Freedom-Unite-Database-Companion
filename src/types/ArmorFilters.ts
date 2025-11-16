// src/types/ArmorFilters.ts

export type ArmorFilters = {
  name?: string; // substring match
  type?: string; // exact match (enum)
  gender?: "male" | "female" | "both";
  rarity?: number; // exact or range
  minDefense?: number;
  maxDefense?: number;
  resistances?: Partial<{
    fire: number;
    water: number;
    thunder: number;
    ice: number;
    dragon: number;
  }>;
  minSlots?: number;
  skillName?: string;
  skillMinAmount?: number;
  maxCreateCost?: number;
  hasMaterial?: string; // filter by material name
};
