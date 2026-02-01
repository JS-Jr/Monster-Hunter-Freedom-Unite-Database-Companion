import { getArmorSkillBuilderData } from "../utils/armorSkillBuilderParser";

export default function ArmorSkillBuilderV1() {
  const data = getArmorSkillBuilderData();
  console.log("data", data)
  return <>HelloWord</>;
}
