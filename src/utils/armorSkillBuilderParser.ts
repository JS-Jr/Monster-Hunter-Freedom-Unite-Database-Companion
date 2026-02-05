import { useCallback } from "react";
import { useSingleDataFetch } from "../hooks/useDataFetch";
import type { Armor } from "../types/Armor";
import type { ArmorSkillBuilder } from "../types/ArmorSkillBuilder";
import { mapRawArmorToArmor } from "./mapArmor";
import type { Decoration } from "../types/Decoration";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { mapRawDecorationtoDecoration } from "./mapDecoration";

const ARMOR_TYPES = ["Helmet", "Plate", "Gauntlets", "Waist", "Leggings"];

export const LOCAL_STORAGE_ARMOR_KEY = (armorTypeName: string) => {
    return `selected${armorTypeName}`
}
export const LOCAL_STORAGE_DECORATION_KEY = (armorTypeName: string) => {
    return `selected${armorTypeName}Decoration`
}


export function getArmorSkillBuilderData(): ArmorSkillBuilder[] {

    console.log("<getArmorSkillBuilderData>");

    const decorationMapper = useCallback(
        (rawData: any[]) => rawData.map(mapRawDecorationtoDecoration),
        []
    );

    const { data: decorationData } = useDataFetchArray<Decoration>(
        "/data/decoration-modified.json",
        {
            mapper: decorationMapper
        }
    );

    const armorMapper = useCallback(
        (rawData: any) => rawData.map(mapRawArmorToArmor),
        []
    );

    const { data: armorData } = useDataFetchArray<Armor>(
        "/data/armor.json",
        {
            mapper: armorMapper,
        }
    );

    let armorSkillBuilderArray: ArmorSkillBuilder[] = [];
    for (const armorTypeItem of ARMOR_TYPES) {
        // const currentArmorId: string = localStorage.getItem(`selected${armorTypeItem}`) ?? "";
        const currentArmorId: string = localStorage.getItem(LOCAL_STORAGE_ARMOR_KEY(armorTypeItem)) ?? "";

        const armor = armorData?.find(armorDataItem => armorDataItem?.identifier === currentArmorId)

        console.log("armor", armor);


        // Temp Fix: for null return
        if (!armor) {
            continue;
            // return armorSkillBuilderArray;
        }

        const decorationArray: Decoration[] = [];

        // const decoration: string = localStorage.getItem(`selected${armorTypeItem}Decoration`) ?? "{}";
        // const decorationJson = JSON.parse(decoration);

        const decorationJson = getLocalStorageDecoration(armorTypeItem)
        console.log('decorationJson', decorationJson);

        if (!(Array.isArray(decorationJson) || typeof decorationJson === 'string')) { continue; }


        for (const decoationJsonItem of decorationJson) {
            const decorationId = decoationJsonItem.name
            // const { data: decoration } = useSingleDataFetch<Decoration>(
            //     "/data/decoration-modified.json",
            //     decorationId
            // );

            const decoration = decorationData?.find(decorationItem => decorationItem?.name === decorationId)

            // Temp Fix: for null return
            if (!decoration) {
                continue;
                // return armorSkillBuilderArray;
            }

            decorationArray.push(decoration)
        }

        const armorSkillBuilder: ArmorSkillBuilder = {
            armor: armor,
            attachedDecoration: decorationArray
        };


        armorSkillBuilderArray.push(armorSkillBuilder);

    }

    console.log('armorSkillBuilderArray', armorSkillBuilderArray);
    return armorSkillBuilderArray;
}

export function addDecorationToArmorSkillBuilderData(armorType: string, decorationName: string) {
    const decorationJson = getLocalStorageDecoration(armorType);


    const exists = decorationJson.some((decorationItem: { name: string; }) => decorationItem.name === decorationName);
    if (!exists) {
        decorationJson.push({ name: decorationName });
    }
    // [{ "name": "Attack Jewel" }, { "name": "Map Jewel" }]

    // [
    //     { "name": "Decoration 1" },
    //     { "name": "Decoration 2" }
    // ]

    const decorationContent = JSON.stringify(decorationJson);

    localStorage.setItem(LOCAL_STORAGE_DECORATION_KEY(armorType), decorationContent);
}


function getLocalStorageDecoration(armorType: string) {
    const decoration: string = localStorage.getItem(LOCAL_STORAGE_DECORATION_KEY(armorType)) ?? "{}";
    let decorationJson;
    try {
        decorationJson = JSON.parse(decoration);
    }
    catch {
        decorationJson = {};
    }

    return decorationJson;
}

// export function canAddToArmor(armorType: string, decorationName: string): boolean {

//     const decorationMapper = useCallback(
//         (rawData: any[]) => rawData.map(mapRawDecorationtoDecoration),
//         []
//     );

//     const { data: decorationCollection } = useDataFetchArray<Decoration>(
//         "/data/decoration-modified.json",
//         {
//             mapper: decorationMapper
//         }
//     );

//     // const selectedDecorationIdentificationArray = localStorage.getItem(`selectedDecoration${armorType}`);
//     const selectedDecorationIdentificationArray = localStorage.getItem(LOCAL_STORAGE_DECORATION_KEY(armorType));
//     const selectedDecorations = selectedDecorationIdentificationArray ? JSON.parse(selectedDecorationIdentificationArray) : [];

//     // Filter current decorations based on selected identifiers
//     const currentDecoration: Decoration[] = decorationCollection?.filter(decorationItem =>
//         selectedDecorations.includes(decorationItem.identifier)
//     ) || []; // Fallback to an empty array if decoration is null or undefined

//     let usedDecorationSlot = (currentDecoration.map((decorationItem) => decorationItem.slots)).reduce((total, slotNumber) => total + slotNumber, 0);

//     const decoration = decorationCollection?.find(decorationItem => decorationItem.name === decorationName);
//     const currentDecorationSlot: number = decoration ? decoration.slots : 0;
//     usedDecorationSlot += currentDecorationSlot;

//     if (0 > usedDecorationSlot) {
//         return true;
//     }

//     return false;
// }