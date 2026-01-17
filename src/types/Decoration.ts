type Skills = {
  name: string;
  amount: number;
  positive: boolean;
};

type Material = {
  item: string;
  qty: number;
};

export type Decoration = {
  identifier: string;
  name: string;
  skill_group: string;
  skills: Skills[];
  slots: number;
  rarity: number;
  cost: number;
  materials: Material[];
  alt_materials: Material[];
};
