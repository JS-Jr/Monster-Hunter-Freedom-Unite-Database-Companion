import type { Armor } from '../types/Armor';

export function mapRawArmorToArmor(raw: any): Armor {
  return {
    name: raw.name,
    type: raw.type, // ideally normalize "gauntlets" to "arms", etc.
    hunter_type: raw.hunter_type,
    gender: raw.sex.toLowerCase() === 'male/female' ? 'both' : raw.sex.toLowerCase(),
    rarity: Number(raw.rarity),
    defense: Number(raw.defence),
    resistances: {
      fire: Number(raw.fire_res),
      water: Number(raw.water_res),
      thunder: Number(raw.thunder_res),
      ice: Number(raw.ice_res),
      dragon: Number(raw.dragon_res),
    },
    slots: raw.slots.length, // "OO-" means 2 slots
    skills: (raw.skills || []).map((s: any) => ({
      name: s.name,
      amount: Number(s.amount),
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
