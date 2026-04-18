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