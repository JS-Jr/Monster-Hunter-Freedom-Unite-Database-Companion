export type Pin = {
  x: number; // X-coordinate (image-space)
  y: number; // Y-coordinate (image-space)
  label: string; // Optional label
};

export type MapData = {
  mapName: string;
  areas: Area[];
};

export type Area = {
  areaName: string;
  areaNumber: number | null;
  nodes: Node[];
};

export type Node = {
  nodeNumber: string;
  nodeType: string;

  // Optional rank data
  "low-rank"?: RankData;
  "high-rank"?: RankData;
  "g-rank"?: RankData;
  "training-school"?: RankData;
  "treasure-hunting"?: TreasureHuntingData;

  pin?: Pin;
};

export type RankData = {
  items: RankItem[];
};

export type RankItem = {
  itemName: string;
};

export type TreasureHuntingData = {
  items: TreasureItem[];
};

export type TreasureItem = {
  itemName: string;
  points: number;
};

// The top-level JSON is an array:
export type MapsFile = MapData[];
