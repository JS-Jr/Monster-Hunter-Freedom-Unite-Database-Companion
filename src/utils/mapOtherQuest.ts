import type { OtherQuest } from "../types/OtherQuest";

export function mapRawOtherQuestToOtherQuest(
  rawOtherQuest: any,
  quest_type: string,
): OtherQuest {
  const main_monsters = ["string"];

  const decorationArray = ["string"];
  const weapon = {
    name: "string",
    decorations: decorationArray,
  };

  const armor = [
    {
      name: "string",
      decorations: decorationArray,
    },
  ];

  const consumable_item = [{ name: "string", count: 0 }];

  return {
    quest_type: quest_type,

    //   Training Group
    name: "string",
    max_party: 0,
    time_limit: 0,
    location: "string",
    main_monsters: main_monsters,
    goal_condition: "string",
    quest_details: "string",
    difficulty: 0,
    point_multiplier: 0,
    weapon: weapon,
    armors: armor,
    items: consumable_item,

    //   ====== Treasure Hunt ======
    reward: 0,
    contract_fee: 0,
    fail_condition: "string",
    special_conditions: "string",
    client: "string",
  };
}