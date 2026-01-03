import { useCallback, useMemo, useState } from "react";
import type { Armor } from "../types/Armor";
import { mapRawArmorToArmor } from "../utils/mapArmor";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { Link } from "react-router-dom";
import ContentWrapper from "../components/ContentWrapper";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { encodeName } from "../utils/urlSafe";

type ArmorSlot = "head" | "body" | "arms" | "waist" | "legs";

export default function ArmorSkillBuilder() {
  const [selectedArmor, setSelectedArmor] = useState<Record<ArmorSlot, Armor | null>>(
    {
      head: null,
      body: null,
      arms: null,
      waist: null,
      legs: null,
    }
  );

  const armorMapper = useCallback(
    (rawData: any[]) => rawData.map(mapRawArmorToArmor),
    []
  );

  const { data: allArmor, loading } = useDataFetchArray<Armor>(
    "/data/armor.json",
    {
      mapper: armorMapper,
    }
  );

  const armorByType = useMemo(() => {
    if (!allArmor) return {} as Record<ArmorSlot, Armor[]>;

    return {
      head: allArmor.filter((a) => a.type === "head"),
      body: allArmor.filter((a) => a.type === "body"),
      arms: allArmor.filter((a) => a.type === "arms"),
      waist: allArmor.filter((a) => a.type === "waist"),
      legs: allArmor.filter((a) => a.type === "legs"),
    };
  }, [allArmor]);

  const totalStats = useMemo(() => {
    let totalDefense = 0;
    const skillMap = new Map<string, number>();

    Object.values(selectedArmor).forEach((armor) => {
      if (armor) {
        totalDefense += armor.defense;
        armor.skills.forEach((skill) => {
          skillMap.set(skill.name, (skillMap.get(skill.name) || 0) + skill.amount);
        });
      }
    });

    return {
      defense: totalDefense,
      skills: Array.from(skillMap.entries()).map(([name, amount]) => ({
        name,
        amount,
      })),
    };
  }, [selectedArmor]);

  if (loading) {
    return (
      <ContentWrapper>
        <h1 className="text-3xl font-bold mb-6">Armor Skill Builder</h1>
        <TableSkeleton rows={5} columns={3} />
      </ContentWrapper>
    );
  }

  const armorSlots: Array<{ key: ArmorSlot; label: string }> = [
    { key: "head", label: "Helmet" },
    { key: "body", label: "Plate" },
    { key: "arms", label: "Gauntlets" },
    { key: "waist", label: "Waist" },
    { key: "legs", label: "Leggings" },
  ];

  return (
    <ContentWrapper>
      <h1 className="text-3xl font-bold mb-6">Armor Skill Builder</h1>

      {/* Armor Selection Grid */}
      <div className="space-y-4 mb-8">
        {armorSlots.map(({ key, label }) => (
          <div
            key={key}
            className="bg-[#F7E7D0] rounded-lg shadow p-6 border border-[#D4AF86]"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <div>
                <h3 className="font-semibold text-[#6B3E1B] text-lg mb-2">
                  {label}
                </h3>
              </div>

              <div className="md:col-span-3">
                {selectedArmor[key] ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#5A3F28]">
                        {selectedArmor[key]!.name}
                      </p>
                      <button
                        onClick={() =>
                          setSelectedArmor((prev) => ({
                            ...prev,
                            [key]: null,
                          }))
                        }
                        className="px-3 py-1 bg-[#D9534F] text-white rounded text-sm hover:bg-[#C9302C] transition"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-[#5A3F28]">
                      <p>
                        <strong>Defense:</strong> {selectedArmor[key]!.defense}
                      </p>
                      <p>
                        <strong>Rarity:</strong> {selectedArmor[key]!.rarity}
                      </p>
                      <p>
                        <strong>Slots:</strong> {selectedArmor[key]!.slots}
                      </p>
                    </div>
                    {selectedArmor[key]!.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-[#6B3E1B] mb-1">
                          Skills:
                        </p>
                        <ul className="text-sm space-y-1">
                          {selectedArmor[key]!.skills.map((skill, i) => (
                            <li key={i} className="text-[#5A3F28]">
                              {skill.name} +{skill.amount}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const selected = armorByType[key].find(
                            (a) => a.name === e.target.value
                          );
                          if (selected) {
                            setSelectedArmor((prev) => ({
                              ...prev,
                              [key]: selected,
                            }));
                          }
                        }
                      }}
                      className="w-full p-2 border border-[#CBA986] rounded bg-white text-[#5A3F28]"
                    >
                      <option value="">+ Select {label.toLowerCase()}...</option>
                      {armorByType[key]?.map((armor) => (
                        <option key={armor.name} value={armor.name}>
                          {armor.name} (Def: {armor.defense}, Rarity: {armor.rarity})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="max-w-4xl mx-auto">
        <section className="bg-[#F7E7D0] rounded-lg shadow p-6 border border-[#D4AF86]">
          <h2 className="text-2xl font-bold text-[#6B3E1B] mb-4">Build Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Defense */}
            <div className="bg-[#E9D3B4] rounded p-4 text-center">
              <p className="text-sm font-semibold text-[#6B3E1B] mb-1">
                Total Defense
              </p>
              <p className="text-4xl font-bold text-[#5A3F28]">
                {totalStats.defense}
              </p>
            </div>

            {/* Selected Items Count */}
            <div className="bg-[#E9D3B4] rounded p-4 text-center">
              <p className="text-sm font-semibold text-[#6B3E1B] mb-1">
                Selected Pieces
              </p>
              <p className="text-4xl font-bold text-[#5A3F28]">
                {Object.values(selectedArmor).filter((a) => a !== null).length}/5
              </p>
            </div>

            {/* Total Skills Count */}
            <div className="bg-[#E9D3B4] rounded p-4 text-center">
              <p className="text-sm font-semibold text-[#6B3E1B] mb-1">
                Active Skills
              </p>
              <p className="text-4xl font-bold text-[#5A3F28]">
                {totalStats.skills.length}
              </p>
            </div>
          </div>

          {/* Skills List */}
          {totalStats.skills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#D4AF86]">
              <h3 className="font-semibold text-[#6B3E1B] mb-3">
                Combined Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {totalStats.skills
                  .sort((a, b) => b.amount - a.amount)
                  .map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between bg-[#E9D3B4] rounded p-3"
                    >
                      <span className="text-[#5A3F28]">{skill.name}</span>
                      <span className="font-semibold text-[#6B3E1B]">
                        +{skill.amount}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalStats.skills.length === 0 &&
            Object.values(selectedArmor).some((a) => a !== null) && (
              <div className="mt-6 pt-6 border-t border-[#D4AF86] text-center text-[#5A3F28] italic">
                <p>No skills from selected armor pieces.</p>
              </div>
            )}
        </section>
      </div>
    </ContentWrapper>
  );
}
