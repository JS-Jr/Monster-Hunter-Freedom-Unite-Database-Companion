// src/types/Armor.ts
interface ArmorInterface {
  part: string;
  name: string;
  rarity: number;
  price: number;
  hunterType: string;
  defense: number;
  skillPoints: SkillPoint[];
  description: string;
  slots: number;
  fireRes: number;
  thundrRes: number;
  dragonRes: number;
  waterRes: number;
  iceRes: number;
  materials: Material[];
  sex: string;
  imageMale: string;
  imageFemale: string;
}

export interface Material {
  name: string;
  amount: number;
}

export interface SkillPoint {
  name: string;
  points: number;
  isPositive?: boolean;
}

export interface Armor extends ArmorInterface {
  identifier: string; // unique identifier
}
