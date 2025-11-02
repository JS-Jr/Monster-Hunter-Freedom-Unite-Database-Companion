export type WeaponMaterial = {
  name: string;
  amount: string;
  type: string;
  color: string;
};

export type WeaponElement = {
  name: string;
  attack: number;
};

export type Weapon = {
  name: string;
  attack?: number;
  sharpness?: string[];
  affinity?: string;
  slots?: string;
  bonus?: string | null;
  rarity?: number;
  type?: string;
  create_cost?: number | null;
  improve_cost?: number;
  improve_from?: string;
  improve_to?: string[];
  create_mats?: WeaponMaterial[] | null;
  improve_mats?: WeaponMaterial[] | null;
  sharpness_plus?: string[];
  elements?: WeaponElement[] | null;
};
