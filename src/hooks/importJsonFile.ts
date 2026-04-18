import { type Armor } from "../types/Armor";
import mapArmor from "../utils/mapArmor";
import armorData from "../../public/data/armors.json";

export function ArmorLoader(): Armor[] {
  const raw = armorData as any[];

  // function sleep(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
  // console.log("Loading for 3 seconds to show skeleton");
  // await sleep(3000);

  return raw.map(mapArmor) as Armor[];
}
