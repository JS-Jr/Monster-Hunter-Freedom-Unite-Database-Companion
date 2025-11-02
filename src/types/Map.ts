// src/types/Map.ts

export type MapNode = {
  nodeNumber: string;
  nodeType: string; // e.g. "Gather", "Mine", "Fish"
};

export type MapArea = {
  areaName: string;
  areaNumber: number | null;
  nodes: MapNode[];
};

export type GameMap = {
  mapName: string;
  areas: MapArea[];
};
