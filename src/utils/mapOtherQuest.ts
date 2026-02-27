import type { OtherQuest } from "../types/OtherQuest";

export function mapRawOtherQuestToOtherQuest(
  rawOtherQuest: any,
  quest_type: string,
): OtherQuest {
  const main_monsters = rawOtherQuest.main_monsters || [];

  const decorationArray = rawOtherQuest.weapon?.decorations || [];
  const weapon = {
    name: rawOtherQuest.weapon?.name || "Default Weapon Name",
    decorations: decorationArray,
  };

  const armor = (rawOtherQuest.armors || []).map((armorItem: any) => ({
    name: armorItem.name || "Default Armor Name",
    decorations: armorItem.decorations || [],
  }));

  const consumable_item = (rawOtherQuest.items || []).map((item: any) => ({
    name: item.name || "Default Item Name",
    count: item.count || 0,
  }));

  return {
    quest_type: quest_type,
    name: rawOtherQuest.name || "Default Quest Name",
    max_party: rawOtherQuest.max_party || null,
    time_limit: rawOtherQuest.time_limit || 0,
    location: rawOtherQuest.location || "Default Location",
    main_monsters: main_monsters,
    goal_condition: rawOtherQuest.goal_condition || "Default Goal Condition",
    quest_details: rawOtherQuest.quest_details || "Default Quest Details",
    difficulty: rawOtherQuest.difficulty || 0,
    point_multiplier: rawOtherQuest.point_multiplier || null,
    weapon: weapon,
    armors: armor.length > 0 ? armor : null,
    items: consumable_item.length > 0 ? consumable_item : null,
    reward: rawOtherQuest.reward || null,
    contract_fee: rawOtherQuest.contract_fee || null,
    fail_condition: rawOtherQuest.fail_condition || null,
    special_conditions: rawOtherQuest.special_conditions || null,
    client: rawOtherQuest.client || null,
  };
}
