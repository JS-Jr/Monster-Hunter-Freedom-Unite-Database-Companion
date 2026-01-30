import { useCallback } from "react";
import { useDataFetchArray } from "../hooks/useDataFetch";
import type { Decoration } from "../types/Decoration";
import { mapRawDecorationtoDecoration } from "./mapDecoration";


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