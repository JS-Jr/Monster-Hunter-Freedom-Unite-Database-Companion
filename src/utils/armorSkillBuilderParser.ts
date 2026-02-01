import { useCallback } from "react";
import { useSingleDataFetch } from "../hooks/useDataFetch";
import type { Armor } from "../types/Armor";
import type { ArmorSkillBuilder } from "../types/ArmorSkillBuilder";
import { mapRawArmorToArmor } from "./mapArmor";
import type { Decoration } from "../types/Decoration";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { mapRawDecorationtoDecoration } from "./mapDecoration";

const ARMOR_TYPES = ["Helmet", "Plate", "Gauntlets", "Waist", "Leggings"];

export function getArmorSkillBuilderData()
    : ArmorSkillBuilder[] {

    console.log("<getArmorSkillBuilderData>");

    let armorSkillBuilderArray: ArmorSkillBuilder[] = [];
    for (const armorTypeItem of ARMOR_TYPES) {
        const currentArmorId: string = localStorage.getItem(`selected${armorTypeItem}`) ?? "";

        const armorMapper = useCallback(
            (rawData: any) => rawData.map(mapRawArmorToArmor),
            []
        );

        const { data: armor } = useSingleDataFetch<Armor>(
            "/data/armor.json",
            currentArmorId,
            {
                mapper: armorMapper,
            }
        );

        console.log("armor", armor);


        // Temp Fix: for null return
        if (!armor) {
            continue;
            // return armorSkillBuilderArray;
        }

        const decorationArray: Decoration[] = [];

        const decoration: string = localStorage.getItem(`selected${armorTypeItem}Decoration`) ?? "{}";
        const decorationJson = JSON.parse(decoration);

        if (!(Array.isArray(decorationJson) || typeof decorationJson === 'string')) { continue; }


        for (const decoationJsonItem of decorationJson) {
            const decorationId = decoationJsonItem.name
            const { data: decoration } = useSingleDataFetch<Decoration>(
                "/data/decoration-modified.json",
                decorationId
            );

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

    return armorSkillBuilderArray;
}

export function addDecorationToArmorSkillBuilderData(armorType: string, decorationName: string) {

}

export function canAddToArmor(armorType: string, decorationName: string): boolean {

    const decorationMapper = useCallback(
        (rawData: any[]) => rawData.map(mapRawDecorationtoDecoration),
        []
    );

    const { data: decorationCollection } = useDataFetchArray<Decoration>(
        "/data/decoration-modified.json",
        {
            mapper: decorationMapper
        }
    );

    const selectedDecorationIdentificationArray = localStorage.getItem(`selectedDecoration${armorType}`);
    const selectedDecorations = selectedDecorationIdentificationArray ? JSON.parse(selectedDecorationIdentificationArray) : [];

    // Filter current decorations based on selected identifiers
    const currentDecoration: Decoration[] = decorationCollection?.filter(decorationItem =>
        selectedDecorations.includes(decorationItem.identifier)
    ) || []; // Fallback to an empty array if decoration is null or undefined

    let usedDecorationSlot = (currentDecoration.map((decorationItem) => decorationItem.slots)).reduce((total, slotNumber) => total + slotNumber, 0);

    const decoration = decorationCollection?.find(decorationItem => decorationItem.name === decorationName);
    const currentDecorationSlot: number = decoration ? decoration.slots : 0;
    usedDecorationSlot += currentDecorationSlot;

    if (0 > usedDecorationSlot) {
        return true;
    }

    return false;
}