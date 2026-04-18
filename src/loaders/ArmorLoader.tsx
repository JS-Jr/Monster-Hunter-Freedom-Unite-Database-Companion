import { type LoaderFunction } from "react-router-dom";
import { type Armor } from "../types/Armor";
import mapArmor from "../utils/mapArmor";
import armorData from "../../public/data/armors.json";

export const ArmorLoader: LoaderFunction = async () => {
  const raw = armorData as any[];

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  console.log("Loading for 3 seconds to show skeleton");
  await sleep(3000);
  //   console.log("Loading for 3 seconds to show skeleton");

  return raw.map(mapArmor) as Armor[];
};

// import { defer } from "react-router-dom";
// export const ArmorLoader: LoaderFunction = async () => {
//   const raw = armorData as any[];
//   return defer({
//     armor: Promise.resolve(raw.map(mapArmor)),
//   });
// };
