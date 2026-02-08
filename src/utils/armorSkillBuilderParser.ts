import type { Armor } from "../types/Armor";
import type { ArmorSkillBuilder } from "../types/ArmorSkillBuilder";
import type { Decoration } from "../types/Decoration";

const ARMOR_TYPES = ["Helmet", "Plate", "Gauntlets", "Waist", "Leggings"];

export const LOCAL_STORAGE_ARMOR_KEY = (armorTypeName: string) => {
  return `selected${armorTypeName}`;
};
export const LOCAL_STORAGE_DECORATION_KEY = (armorTypeName: string) => {
  return `selected${armorTypeName}Decoration`;
};

export function getArmorSkillBuilderData(
  armorData: Armor[],
  decorationData: Decoration[],
): ArmorSkillBuilder[] {
  console.log("<getArmorSkillBuilderData>");

  const armorSkillBuilderArray: ArmorSkillBuilder[] = [];
  for (const armorTypeItem of ARMOR_TYPES) {
    // const currentArmorId: string = localStorage.getItem(`selected${armorTypeItem}`) ?? "";
    const currentArmorId: string =
      localStorage.getItem(LOCAL_STORAGE_ARMOR_KEY(armorTypeItem)) ?? "";

    const armor = armorData?.find(
      (armorDataItem) => armorDataItem?.identifier === currentArmorId,
    );

    console.log("armor", armor);

    // Temp Fix: for null return
    if (!armor) {
      continue;
      // return armorSkillBuilderArray;
    }

    const decorationArray: Decoration[] = [];

    // const decoration: string = localStorage.getItem(`selected${armorTypeItem}Decoration`) ?? "{}";
    // const decorationJson = JSON.parse(decoration);

    const decorationJson = getLocalStorageDecoration(armorTypeItem);
    console.log("decorationJson", decorationJson);

    if (
      !(Array.isArray(decorationJson) || typeof decorationJson === "string")
    ) {
      continue;
    }

    for (const decoationJsonItem of decorationJson) {
      const decorationId = decoationJsonItem.name;
      // const { data: decoration } = useSingleDataFetch<Decoration>(
      //     "/data/decoration-modified.json",
      //     decorationId
      // );

      const decoration = decorationData?.find(
        (decorationItem) => decorationItem?.name === decorationId,
      );

      // Temp Fix: for null return
      if (!decoration) {
        continue;
        // return armorSkillBuilderArray;
      }

      decorationArray.push(decoration);
    }

    const armorSkillBuilder: ArmorSkillBuilder = {
      armor: armor,
      attachedDecoration: decorationArray,
    };

    armorSkillBuilderArray.push(armorSkillBuilder);
  }

  console.log("armorSkillBuilderArray", armorSkillBuilderArray);
  return armorSkillBuilderArray;
}

export function addDecorationToArmorSkillBuilderData(
  armorType: string,
  decorationName: string,
) {
  const decorationJson = getLocalStorageDecoration(armorType);

  const exists = decorationJson.some(
    (decorationItem: { name: string }) =>
      decorationItem.name === decorationName,
  );
  if (!exists) {
    decorationJson.push({ name: decorationName });
  }
  // [{ "name": "Attack Jewel" }, { "name": "Map Jewel" }]

  // [
  //     { "name": "Decoration 1" },
  //     { "name": "Decoration 2" }
  // ]

  const decorationContent = JSON.stringify(decorationJson);

  localStorage.setItem(
    LOCAL_STORAGE_DECORATION_KEY(armorType),
    decorationContent,
  );
}

function getLocalStorageDecoration(armorType: string) {
  const decoration: string =
    localStorage.getItem(LOCAL_STORAGE_DECORATION_KEY(armorType)) ?? "{}";
  let decorationJson;
  try {
    decorationJson = JSON.parse(decoration);
  } catch {
    decorationJson = {};
  }

  return decorationJson;
}

/* Plan 
return ArmorSkillBuilderTableRowData (for easier display of data)
Loop ARMOR_TYPES
set the typeColumn same as ARMOR_TYPE_ITEM
find the ARMOR_TYPE_ITEM in the ArmorSkillBuilder in ARMOR
 - (old IGNORE THIS) just a match with the armortype is fine since we store decoration with the same armor type

!!! not found
    set other as undefined or null or something similar save it
    also create another for the decoration and just make it null

found
set the selectionActionColumn to armor name
set the defenseColumn to armor defense
set the skills 
set the slot column
save it

set another for the decoration


*/

function getArmorSkillBuilderTableRowData(
  armorSkillBuilderArray: ArmorSkillBuilder[],
) {
  for (const armorTypeItem of ARMOR_TYPES) {
  }
}

function findArmor(
  armorType: string,
  armorSkillBuilderArray: ArmorSkillBuilder[],
): Armor | undefined {
  const targetArmorType = armorType.toLocaleLowerCase();

  armorSkillBuilderArray.map((armorSkillBuilderItem) => {
    const itemArmorType = armorSkillBuilderItem.armor.type.toLocaleLowerCase();

    if (itemArmorType === targetArmorType) return armorSkillBuilderItem.armor;
  });

  return undefined;
}
