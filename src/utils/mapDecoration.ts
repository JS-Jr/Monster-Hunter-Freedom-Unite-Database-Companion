import type { Decoration } from "../types/Decoration";

export function mapRawDecorationtoDecoration(raw: any): Decoration {
    // convert slots from string like "OO-" to number
    const slotsString: string = raw.slots || "";
    const slots = (slotsString.match(/O/g) || []).length;

    const identifier = raw.name;

    console.log("skills", raw.skills[0].name);

    return {
        identifier: identifier,
        name: raw.name,
        skill_group: raw.skill_group,
        skills: (raw.skills || []).map((skillItem: any) => {
            const match = skillItem.match(/([\w\s]+)\s([-+]?\d+)/); // Match skill name and value
            if (match) {
                return {
                    name: match[1].trim(), // Skill name
                    amount: Math.abs(Number(match[2])), // Always positive
                    positive: Number(match[2]) >= 0, // Store original sign
                };
            } else {
                // Handle case when match fails
                return {
                    name: skillItem, // Or handle error as needed
                    amount: 0,
                    positive: true, // Default or error value
                };
            }
        }),
        slots: slots,
        rarity: Number(raw.rarity),
        cost: raw.cost,
        materials: (raw.materials || []).map((materialItem: any) => ({
            item: materialItem.name,
            qty: materialItem.amount,
        })),
        alt_materials: (raw.alt_materials || []).map((materialItem: any) => ({
            item: materialItem.name,
            qty: materialItem.amount,
        })),
    };
}
