import { useCallback, useMemo, useState } from "react";
import type { Armor, ArmorType } from "../types/Armor";
import { mapRawArmorToArmor } from "../utils/mapArmor";
import { useDataFetchArray } from "../hooks/useDataFetch";
import ContentWrapper from "../components/ContentWrapper";
import { TableSkeleton } from "../components/TableSkeletonProps";

// 🔹 UI slots (NOT the same as ArmorType)
type ArmorSlot = "head" | "body" | "arms" | "waist" | "legs";

// 🔹 Slot → ArmorType mapping
const SLOT_TO_ARMOR_TYPE: Record<ArmorSlot, ArmorType> = {
  head: "Helmet",
  body: "Plate",
  arms: "Gauntlets",
  waist: "Waist",
  legs: "Leggings",
};

export default function ArmorSkillBuilder() {
  // -------------------------------
  // Selected armor per slot
  // -------------------------------
  const [selectedArmor, setSelectedArmor] = useState<
    Record<ArmorSlot, Armor | null>
  >({
    head: null,
    body: null,
    arms: null,
    waist: null,
    legs: null,
  });

  // -------------------------------
  // Fetch + map armor data
  // -------------------------------
  const armorMapper = useCallback(
    (rawData: any[]) => rawData.map(mapRawArmorToArmor),
    []
  );

  const { data: allArmor, loading } = useDataFetchArray<Armor>(
    "/data/armor.json",
    { mapper: armorMapper }
  );

  // -------------------------------
  // Group armor by slot
  // -------------------------------
  const armorBySlot = useMemo<Record<ArmorSlot, Armor[]>>(() => {
    if (!allArmor) {
      return {
        head: [],
        body: [],
        arms: [],
        waist: [],
        legs: [],
      };
    }

    return {
      head: allArmor.filter((a) => a.type === SLOT_TO_ARMOR_TYPE.head),
      body: allArmor.filter((a) => a.type === SLOT_TO_ARMOR_TYPE.body),
      arms: allArmor.filter((a) => a.type === SLOT_TO_ARMOR_TYPE.arms),
      waist: allArmor.filter((a) => a.type === SLOT_TO_ARMOR_TYPE.waist),
      legs: allArmor.filter((a) => a.type === SLOT_TO_ARMOR_TYPE.legs),
    };
  }, [allArmor]);

  // -------------------------------
  // Calculate total defense + skills
  // -------------------------------
  const totalStats = useMemo(() => {
    let totalDefense = 0;
    const skillMap = new Map<string, number>();

    Object.values(selectedArmor).forEach((armor) => {
      if (!armor) return;

      totalDefense += armor.defense;

      armor.skills.forEach((skill) => {
        skillMap.set(
          skill.name,
          (skillMap.get(skill.name) ?? 0) + skill.amount
        );
      });
    });

    return {
      defense: totalDefense,
      skills: Array.from(skillMap.entries()).map(([name, amount]) => ({
        name,
        amount,
      })),
    };
  }, [selectedArmor]);

  // -------------------------------
  // Loading state
  // -------------------------------
  if (loading) {
    return (
      <ContentWrapper>
        <h1 className="text-3xl font-bold mb-6">Armor Skill Builder</h1>
        <TableSkeleton rows={5} columns={3} />
      </ContentWrapper>
    );
  }

  // -------------------------------
  // Slot metadata for UI
  // -------------------------------
  const armorSlots: Array<{ key: ArmorSlot; label: string }> = [
    { key: "head", label: "Helmet" },
    { key: "body", label: "Plate" },
    { key: "arms", label: "Gauntlets" },
    { key: "waist", label: "Waist" },
    { key: "legs", label: "Leggings" },
  ];

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <ContentWrapper>
      <h1 className="text-3xl font-bold mb-6">Armor Skill Builder</h1>

      {/* Armor Selection */}
      <div className="space-y-4 mb-8">
        {armorSlots.map(({ key, label }) => (
          <div
            key={key}
            className="bg-[#F7E7D0] rounded-lg shadow p-6 border border-[#D4AF86]"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <h3 className="font-semibold text-lg text-[#6B3E1B]">{label}</h3>

              <div className="md:col-span-3">
                {selectedArmor[key] ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        {selectedArmor[key]!.name}
                      </p>
                      <button
                        onClick={() =>
                          setSelectedArmor((prev) => ({
                            ...prev,
                            [key]: null,
                          }))
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Clear
                      </button>
                    </div>

                    <p>Defense: {selectedArmor[key]!.defense}</p>
                    <p>Rarity: {selectedArmor[key]!.rarity}</p>
                    <p>Slots: {selectedArmor[key]!.slots}</p>

                    {selectedArmor[key]!.skills.length > 0 && (
                      <ul className="list-disc ml-4">
                        {selectedArmor[key]!.skills.map((s, i) => (
                          <li key={i}>
                            {s.name} +{s.amount}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      const selected = armorBySlot[key].find(
                        (a) => a.name === e.target.value
                      );
                      if (selected) {
                        setSelectedArmor((prev) => ({
                          ...prev,
                          [key]: selected,
                        }));
                      }
                    }}
                  >
                    <option value="">+ Select {label.toLowerCase()}...</option>
                    {armorBySlot[key].map((armor) => (
                      <option key={armor.name} value={armor.name}>
                        {armor.name} (Def: {armor.defense}, Rarity:{" "}
                        {armor.rarity})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="max-w-4xl mx-auto">
        <section className="bg-[#F7E7D0] rounded-lg shadow p-6 border border-[#D4AF86]">
          <h2 className="text-2xl font-bold mb-4">Build Summary</h2>

          <p>Total Defense: {totalStats.defense}</p>
          <p>
            Selected Pieces:{" "}
            {Object.values(selectedArmor).filter(Boolean).length}/5
          </p>
          <p>Active Skills: {totalStats.skills.length}</p>

          {totalStats.skills.map((s) => (
            <div key={s.name}>
              {s.name}: +{s.amount}
            </div>
          ))}
        </section>
      </div>
    </ContentWrapper>
  );
}
