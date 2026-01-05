import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContentWrapperProps from "../components/ContentWrapper";
import type { Armor, ArmorType } from "../types/Armor";
import { decodeName } from "../utils/urlSafe";
import { mapRawArmorToArmor } from "../utils/mapArmor";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { ArmorSkillBuilderSkeleton } from "../components/skeletal/ArmorSkillBuilderSkeleton";

type SlotConfig = {
  type: ArmorType;
  label: string;
  selectPath: string;
};

const SLOTS: SlotConfig[] = [
  { type: "Helmet", label: "Helmet", selectPath: "/select/helmet" },
  { type: "Plate", label: "Plate", selectPath: "/select/plate" },
  { type: "Gauntlets", label: "Gauntlets", selectPath: "/select/gauntlets" },
  { type: "Waist", label: "Waist", selectPath: "/select/waist" },
  { type: "Leggings", label: "Leggings", selectPath: "/select/leggings" },
];

export default function ArmorSkillBuilder() {
  // const [armors, setArmors] = useState<Armor[]>([]);
  const [_refresh, setRefresh] = useState(0);

  const armorMapper = useCallback(
    (rawData: any[]) => rawData.map(mapRawArmorToArmor),
    []
  );

  const { data: armors, loading } = useDataFetchArray<Armor>(
    "/data/armor.json",
    {
      mapper: armorMapper,
    }
  );

  /* ---------------- Load armor data ---------------- */
  // useEffect(() => {
  //   fetch("/data/armor.json")
  //     .then((res) => res.json())
  //     .then((data: any[]) => {
  //       setArmors(data.map(mapRawArmorToArmor));
  //     })
  //     .catch((err) => console.error("Failed to load armor data:", err));
  // }, []);

  /* ---------------- Selected armor per slot ---------------- */
  const selectedArmorBySlot = useMemo(() => {
    return SLOTS.reduce<Record<ArmorType, Armor | null>>((acc, slot) => {
      const stored = localStorage.getItem(`selected${slot.type}`);
      if (!stored) {
        acc[slot.type] = null;
        return acc;
      }

      const identifier = decodeName(stored);
      acc[slot.type] =
        armors?.find(
          (a) =>
            a.identifier?.toLowerCase() === identifier.toLowerCase() ||
            a.name?.toLowerCase() === identifier.toLowerCase()
        ) ?? null;

      return acc;
    }, {} as any);
  }, [armors]);

  /* ---------------- Totals ---------------- */
  const totalDefense = useMemo(() => {
    return Object.values(selectedArmorBySlot).reduce(
      (sum, armor) => sum + (armor?.defense ?? 0),
      0
    );
  }, [selectedArmorBySlot]);

  const totalSkills = useMemo(() => {
    const skillMap: Record<string, number> = {};
    Object.values(selectedArmorBySlot).forEach((armor) => {
      armor?.skills?.forEach((skill) => {
        const signedAmount = skill.positive ? skill.amount : -skill.amount;
        skillMap[skill.name] = (skillMap[skill.name] ?? 0) + signedAmount;
      });
    });
    return Object.entries(skillMap).map(([name, amount]) => ({
      name,
      amount: Math.abs(amount),
      positive: amount >= 0,
    }));
  }, [selectedArmorBySlot]);

  /* ---------------- Handlers ---------------- */
  const removeSlot = (slotType: ArmorType) => {
    localStorage.removeItem(`selected${slotType}`);
    // force update by setting state
    // setArmors((prev) => [...prev]);
    setRefresh((r) => r + 1);
  };

  const clearAll = () => {
    SLOTS.forEach((slot) => localStorage.removeItem(`selected${slot.type}`));
    // setArmors((prev) => [...prev]);
    setRefresh((r) => r + 1);
  };

  if (loading) {
    return <ArmorSkillBuilderSkeleton />;
  }

  if (!armors || armors.length === 0) {
    return (
      <ContentWrapperProps>
        <div className="max-w-5xl mx-auto px-4 py-8 text-[#5A3F28]">
          <h1 className="text-3xl font-extrabold text-center text-[#6B3E1B] mb-6">
            Skill Builder
          </h1>

          <div className="bg-[#F7E7D0] rounded-lg shadow p-6 text-center">
            <p className="text-[#8A6A4A] italic">
              No armor data found. Please try again later.
            </p>
          </div>
        </div>
      </ContentWrapperProps>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <ContentWrapperProps>
      <div className="max-w-5xl mx-auto px-4 py-8 text-[#5A3F28]">
        <h1 className="text-3xl font-extrabold text-center text-[#6B3E1B] mb-6">
          Skill Builder
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-[#F7E7D0] rounded-lg shadow border-collapse">
            <thead>
              <tr className="bg-[#E9D3B4] text-left">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Selection / Actions</th>
                <th className="px-4 py-3">Defense</th>
                <th className="px-4 py-3">Skills</th>
              </tr>
            </thead>

            <tbody>
              {SLOTS.map((slot) => {
                const armor = selectedArmorBySlot[slot.type];

                return (
                  <tr
                    key={slot.type}
                    className="border-t border-[#CBA986] hover:bg-[#F3DFC4]"
                  >
                    <td className="px-4 py-4 font-semibold">{slot.label}</td>

                    <td className="px-4 py-4 align-middle">
                      {armor ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{armor.name}</span>
                          <div className="flex gap-2">
                            <Link
                              to={slot.selectPath}
                              className="text-sm text-[#6B3E1B] hover:underline"
                            >
                              Change
                            </Link>
                            <button
                              onClick={() => removeSlot(slot.type)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Link to={slot.selectPath}>
                          <button
                            className="px-4 py-2 rounded-md text-sm font-semibold
                   bg-[#6B3E1B] text-[#F7E7D0]
                   hover:bg-[#5A3215]
                   active:scale-95 transition-all"
                          >
                            + Choose {slot.label}
                          </button>
                        </Link>
                      )}
                    </td>

                    <td className="px-4 py-4">{armor ? armor.defense : "—"}</td>

                    <td className="px-4 py-4 text-sm">
                      {armor?.skills?.length ? (
                        <ul className="list-disc list-inside">
                          {armor.skills.map((s, i) => (
                            <li
                              key={i}
                              className={
                                s.positive ? "text-green-700" : "text-red-600"
                              }
                            >
                              {s.name} {s.positive ? "+" : "-"}
                              {s.amount}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="italic text-[#8A6A4A]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ---------------- Totals ---------------- */}
        <section className="mt-8 bg-[#F7E7D0] rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#6B3E1B]">Total Stats</h2>
            <button
              onClick={clearAll}
              className="px-3 py-1 rounded-md text-sm font-semibold
                         bg-red-600 text-[#F7E7D0]
                         hover:bg-red-700 transition-all"
            >
              Clear All
            </button>
          </div>

          <p className="mb-4 font-semibold">
            Total Defense: <span className="text-lg">{totalDefense}</span>
          </p>

          {totalSkills.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {totalSkills.map((skill) => (
                <li
                  key={skill.name}
                  className={`rounded px-3 py-2 ${
                    skill.positive
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {skill.name} {skill.positive ? "+" : "-"}
                  {skill.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-[#8A6A4A]">No skills yet</p>
          )}
        </section>
      </div>
    </ContentWrapperProps>
  );
}
