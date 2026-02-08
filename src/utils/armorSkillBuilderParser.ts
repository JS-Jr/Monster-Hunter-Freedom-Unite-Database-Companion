import type { Armor } from "../types/Armor";
import type {
  ArmorSkillBuilder,
  ArmorSkillBuilderTableRowData,
} from "../types/ArmorSkillBuilder";
import type { Decoration } from "../types/Decoration";

export const ARMOR_TYPES = ["Helmet", "Plate", "Gauntlets", "Waist", "Leggings"];

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

export function getArmorSkillBuilderTableRowData(
  armorSkillBuilderArray: ArmorSkillBuilder[],
) {
  const armorSkillBuilderTableRowDataArray: ArmorSkillBuilderTableRowData[] =
    [];

  for (const armorTypeItem of ARMOR_TYPES) {
    const foundarmorSkillBuilder = findArmor(
      armorTypeItem,
      armorSkillBuilderArray,
    );

    if (!foundarmorSkillBuilder) {
      const armorSkillBuilderTableRowDataArmor: ArmorSkillBuilderTableRowData =
        {
          typeColumn: armorTypeItem,
          selectionActionColumn: "",
          defenseColumn: 0,
          skillsColumn: [],
          slotsColumn: 0,
        };
      armorSkillBuilderTableRowDataArray.push(
        armorSkillBuilderTableRowDataArmor,
      );

      const armorSkillBuilderTableRowDataDecoration: ArmorSkillBuilderTableRowData =
        {
          typeColumn: `${armorTypeItem} Decoration`,
          selectionActionColumn: "",
          defenseColumn: 0,
          skillsColumn: [],
          slotsColumn: 0,
        };
      armorSkillBuilderTableRowDataArray.push(
        armorSkillBuilderTableRowDataDecoration,
      );

      continue;
    }

    // For Armor
    const armorSkillBuilderTableRowDataArmor: ArmorSkillBuilderTableRowData = {
      typeColumn: foundarmorSkillBuilder.armor.type,
      selectionActionColumn: foundarmorSkillBuilder.armor.name,
      defenseColumn: foundarmorSkillBuilder.armor.defense,
      skillsColumn: foundarmorSkillBuilder.armor.skills,
      slotsColumn: foundarmorSkillBuilder.armor.slots,
    };
    armorSkillBuilderTableRowDataArray.push(armorSkillBuilderTableRowDataArmor);

    // For Decoration
    const attachedDecoration: Decoration[] =
      foundarmorSkillBuilder.attachedDecoration;

    for (const decorationItem of attachedDecoration) {
      const armorSkillBuilderTableRowDataDecoration: ArmorSkillBuilderTableRowData =
        {
          typeColumn: `${foundarmorSkillBuilder.armor.type} Decoration`,
          selectionActionColumn: decorationItem.name,
          defenseColumn: 0,
          skillsColumn: decorationItem.skills,
          slotsColumn: decorationItem.slots,
        };
      armorSkillBuilderTableRowDataArray.push(
        armorSkillBuilderTableRowDataDecoration,
      );
    }
  }

  return armorSkillBuilderTableRowDataArray;
}

function findArmor(
  armorType: string,
  armorSkillBuilderArray: ArmorSkillBuilder[],
): ArmorSkillBuilder | undefined {
  const targetArmorType = armorType.toLocaleLowerCase();

  const foundarmorSkillBuilder = armorSkillBuilderArray.find(
    (armorSkillBuilderItem) => {
      const itemArmorType =
        armorSkillBuilderItem.armor.type.toLocaleLowerCase();

      console.log(targetArmorType, " = comparing to = ", itemArmorType);

      if (itemArmorType == targetArmorType) {
        return armorSkillBuilderItem;
      }
    },
  );

  return foundarmorSkillBuilder;
}
