type Material = {
  item: string;
  qty: number;
};

export type Decoration = {
  name: string;
  skill_group: string;
  skills: string[];
  slots: string;
  rarity: number;
  cost: number;
  materials: Material[];
  alt_materials: Material[];
};
