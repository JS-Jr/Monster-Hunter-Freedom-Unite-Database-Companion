import { type Armor, type Material, type SkillPoint } from "../types/Armor";

export default function mapArmor(raw: any): Armor {
  const identifier: string =
    String(raw.name ?? "") + " " + String(raw.sex ?? "");
  const part: string = String(raw.part ?? "");
  const name: string = String(raw.name ?? "");
  const rarity: number = Number(raw.rarity ?? 0);
  const price: number = Number(raw.price ?? raw.create_cost ?? 0);
  const hunterType: string = String(
    raw.hunter_type ?? raw["hunter-type"] ?? "",
  );
  const defense: number = Number(raw.defence ?? raw.defense ?? 0);
  const slots: number = Number(raw.slots ?? 0);
  const description: string = String(raw.description ?? "");
  const fireRes: number = Number(raw.fire_res ?? raw["fire-res"] ?? 0);
  const thundrRes: number = Number(raw.thundr_res ?? raw["thundr-res"] ?? 0);
  const dragonRes: number = Number(raw.dragon_res ?? raw["dragon-res"] ?? 0);
  const waterRes: number = Number(raw.water_res ?? raw["water-res"] ?? 0);
  const iceRes: number = Number(raw.ice_res ?? raw["ice-res"] ?? 0);
  const sex: string = String(raw.sex ?? "");
  const imageMale: string = String(raw.image_male ?? raw["image-male"] ?? "");
  const imageFemale: string = String(
    raw.image_female ?? raw["image-female"] ?? "",
  );

  const skillPoints: SkillPoint[] = (raw["skill-points"] || []).map(
    (skillItem: any) => {
      const sName: string = String(skillItem.name);
      const sPoints: number = Math.abs(Number(skillItem.points ?? 0));
      const sIsPositive: boolean = Number(skillItem.points ?? 0) >= 0;
      return { name: sName, points: sPoints, isPositive: sIsPositive };
    },
  );

  const materials: Material[] = (raw.create_mats || raw.materials || []).map(
    (materialItem: any) => {
      const materialName: string = String(materialItem.name);
      const materialAmount: number = Number(materialItem.amount ?? 0);
      return { name: materialName, amount: materialAmount };
    },
  );

  return {
    identifier,
    part,
    name,
    rarity,
    price,
    hunterType,
    defense,
    skillPoints,
    description,
    slots,
    fireRes,
    thundrRes,
    dragonRes,
    waterRes,
    iceRes,
    materials,
    sex,
    imageMale,
    imageFemale,
  };
}
