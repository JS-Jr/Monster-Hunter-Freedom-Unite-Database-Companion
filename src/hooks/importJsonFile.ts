import { type Armor } from "../types/Armor";
import mapArmor from "../utils/mapArmor";
import armorData from "../data/armors.json";

export function ArmorLoader(): Armor[] {
  const raw = armorData as any[];
  return raw.map(mapArmor) as Armor[];
}
