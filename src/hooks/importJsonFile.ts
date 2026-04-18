import { type Armor } from "../types/Armor";
import mapArmor from "../utils/mapArmor";
import armorData from "../data/armors.json";

export function GetArmorData(): Armor[] {
  const raw = armorData as any[];
  return raw.map(mapArmor) as Armor[];
}

export function GetSingleArmorData(armorId: string): Armor {
  const armorData: Armor[] = GetArmorData();

  const foundArmorData: Armor = armorData.find();

  return armorData;
}
