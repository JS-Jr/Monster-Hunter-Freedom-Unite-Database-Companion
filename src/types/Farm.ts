// src/types/Farm.ts

export type BeehiveItem = {
  name: string;
  chances: BeehiveChance[];
};

export type BeehiveChance = {
  level: number;
  levelName: string;
  chance: number;
  amount: string;
};


export type InsectThicketItem = {
  name: string;
  chances: InsectThicketChance[];
}

export type InsectThicketChance = {
  level: number;
  levelName: string;
  chance: number;
};