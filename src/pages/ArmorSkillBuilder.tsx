import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContentWrapperProps from "../components/ContentWrapper";
import type { Armor, ArmorType, Skills } from "../types/Armor";
import { decodeName } from "../utils/urlSafe";
import { mapRawArmorToArmor } from "../utils/mapArmor";

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
  const [armors, setArmors] = useState<Armor[]>([]);

  /* ---------------- Load armor data once ---------------- */
  useEffect(() => {
    fetch("/data/armor.json")
      .then((res) => res.json())
      .then((data: any[]) => {
        const mapped = data.map(mapRawArmorToArmor); // 🔹 map the raw data
        setArmors(mapped); // 🔹 set mapped data
      })
      .catch((err) => console.error("Failed to load armor data:", err));
  }, []);

  /* ---------------- Selected armor per slot ---------------- */
  const selectedArmorBySlot = useMemo(() => {
    return SLOTS.reduce<Record<ArmorType, Armor | null>>((acc, slot) => {
      const stored = localStorage.getItem(`selected${slot.type}`);

      // console.log("stored", stored);

      // selectedHelmet
      if (!stored) {
        acc[slot.type] = null;
        return acc;
      }

      const identifier = decodeName(stored);

      // console.log("identifier", identifier);
      // console.log("armors", armors);
      acc[slot.type] =
        armors.find(
          (a) =>
            a.identifier?.toLowerCase() === identifier.toLowerCase() ||
            a.name?.toLowerCase() === identifier.toLowerCase()
        ) ?? null;

      // console.log("acc[slot.type]", acc[slot.type]);

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
        skillMap[skill.name] = (skillMap[skill.name] ?? 0) + skill.amount;
      });
    });

    return Object.entries(skillMap).map(([name, amount]) => ({
      name,
      amount,
    })) as Skills[];
  }, [selectedArmorBySlot]);

  return (
    <ContentWrapperProps>
      <div className="max-w-5xl mx-auto px-4 py-8 text-[#5A3F28]">
        <h1 className="text-3xl font-extrabold text-center text-[#6B3E1B] mb-6">
          Skill Builder
        </h1>

        {/* ---------------- Builder Table ---------------- */}
        <div className="overflow-x-auto">
          <table className="w-full bg-[#F7E7D0] rounded-lg shadow border-collapse">
            <thead>
              <tr className="bg-[#E9D3B4] text-left">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Selection</th>
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

                    <td className="px-4 py-4">
                      {armor ? (
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-medium">{armor.name}</span>
                          <Link
                            to={slot.selectPath}
                            className="text-sm text-[#6B3E1B] hover:underline"
                          >
                            Change
                          </Link>
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
                            <li key={i}>
                              {s.name} +{s.amount}
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
          <h2 className="text-2xl font-bold text-[#6B3E1B] mb-4">
            Total Stats
          </h2>

          <p className="mb-4 font-semibold">
            Total Defense: <span className="text-lg">{totalDefense}</span>
          </p>

          {totalSkills.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {totalSkills.map((skill) => (
                <li key={skill.name} className="bg-[#E9D3B4] rounded px-3 py-2">
                  {skill.name} +{skill.amount}
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
