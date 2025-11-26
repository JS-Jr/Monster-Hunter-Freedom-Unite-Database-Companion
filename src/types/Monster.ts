export type Monster = {
  name: string;
  type: string;
  description: string;
  habitats: string[];
  drops: Record<string, any>;
  hitzones: Record<string, any>;
};
