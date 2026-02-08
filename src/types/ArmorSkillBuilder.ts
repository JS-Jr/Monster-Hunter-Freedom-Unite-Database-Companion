import type { Armor } from "./Armor";
import type { Decoration } from "./Decoration";

export type ArmorSkillBuilder = {
  armor: Armor;
  attachedDecoration: Decoration[];
};

type Skills = {
  name: string;
  amount: number;
  positive: boolean;
};

export type ArmorSkillBuilderTableRowData = {
  typeColumn: string;
  selectionActionColumn: string;
  defenseColumn: string;
  skillsColumn: Skills[];
  slotsColumn: number;
};
