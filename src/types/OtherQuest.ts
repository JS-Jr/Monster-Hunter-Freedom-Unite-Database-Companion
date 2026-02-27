interface Weapon {
  name: string;
  decorations: string[];
}

interface Armor {
  name: string;
  decorations: string[];
}

interface ConsumableItem {
  name: string;
  count: number;
}

export interface OtherQuest {
  quest_type: string;

  //   Training Group
  name: string;
  max_party: number | null;
  time_limit: number;
  location: string;
  main_monsters: string[];
  goal_condition: string;
  quest_details: string;
  difficulty: number;
  point_multiplier: number | null;
  weapon: Weapon | null;
  armors: Armor[] | null;
  items: ConsumableItem[] | null;

  //   ====== Treasure Hunt ======
  //   name: string;
  reward: number | null;
  contract_fee: number | null;
  //   "time_limit": number;
  //   location: string;
  //   "main_monsters": string[];
  //   "goal_condition": string;
  fail_condition: string | null;
  special_conditions: string | null;
  client: string | null;
  //   "quest_details": string;
  //   difficulty: number;

  //Training_### - Same as Training Group
  //   interface RootWeapon {
  //   name: string;
  //   decorations: any[];
  // }

  // interface RootArmorsItem {
  //   name: string;
  //   decorations: string[];
  // }

  // interface RootItemsItem {
  //   name: string;
  //   count: number;
  // }

  // interface Root {
  //   name: string;
  //   time_limit: number;
  //   location: string;
  //   main_monsters: string[];
  //   goal_condition: string;
  //   quest_details: string;
  //   difficulty: number;
  //   point_multiplier: number;
  //   weapon: Weapon;
  //   armors: Armor[];
  //   items: ConsumableItem[];
  // }
}
