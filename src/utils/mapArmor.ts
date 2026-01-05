import type { Armor, ArmorType, Gender } from "../types/Armor";

const armorTypeMap: Record<string, ArmorType> = {
  helmet: "Helmet",
  plate: "Plate",
  gauntlets: "Gauntlets",
  waist: "Waist",
  leggings: "Leggings",
};

const genderMap: Record<string, Gender> = {
  male: "Male",
  female: "Female",
  "male/female": "Both",
  both: "Both",
};

export function mapRawArmorToArmor(raw: any): Armor {
  // normalize type
  const rawType = raw.type?.toLowerCase() || "";
  const type: ArmorType = armorTypeMap[rawType] ?? "Body"; // fallback

  // normalize gender
  const rawSex = raw.sex?.toLowerCase() || "male";
  const gender: Gender = genderMap[rawSex] ?? "Male";

  // convert slots from string like "OO-" to number
  const slotsString: string = raw.slots || "";
  const slots = (slotsString.match(/O/g) || []).length;

  const identifier = raw.name + " " + gender;

  return {
    identifier: identifier,
    name: raw.name,
    type: type,
    hunter_type: raw.hunter_type,
    gender: gender,
    rarity: Number(raw.rarity),
    defense: Number(raw.defence),
    resistances: {
      fire: Number(raw.fire_res),
      water: Number(raw.water_res),
      thunder: Number(raw.thunder_res),
      ice: Number(raw.ice_res),
      dragon: Number(raw.dragon_res),
    },
    slots: slots,
    skills: (raw.skills || []).map((s: any) => ({
      name: s.name,
      amount: Math.abs(Number(s.amount)), // always positive
      positive: Number(s.amount) >= 0, // store original sign
    })),
    create_cost: Number(raw.create_cost),
    create_mats: (raw.create_mats || []).map((m: any) => ({
      name: m.name,
      amount: m.amount,
      type: m.type,
      color: m.color,
    })),
  };
}
