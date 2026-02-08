import ContentWrapperProps from "../components/ContentWrapper";
import { Link } from "react-router-dom";
import { useCallback, type JSX } from "react";
import { useDataFetchArray } from "../hooks/useDataFetch";
import type { Armor, ArmorJson } from "../types/Armor";
import { mapRawArmorToArmor } from "../utils/mapArmor";
import { mapRawDecorationtoDecoration } from "../utils/mapDecoration";
import type { DecorationJson, Decoration } from "../types/Decoration";
import type { ArmorSkillBuilder } from "../types/ArmorSkillBuilder";
import { getArmorSkillBuilderData } from "../utils/armorSkillBuilderParser";

function Title() {
  return (
    <h1 className="text-3xl font-extrabold text-center text-[#6B3E1B] mb-6">
      Skill Builder
    </h1>
  );
}

function Table({
  armorSkillBuilderDataProps,
}: {
  armorSkillBuilderDataProps: ArmorSkillBuilder[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-[#F7E7D0] rounded-lg shadow border-collapse">
        <thead>
          <tr className="bg-[#E9D3B4] text-left">
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Selection / Actions</th>
            <th className="px-4 py-3">Defense</th>
            <th className="px-4 py-3">Skills</th>
            <th className="px-4 py-3">Slots</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
            <td className="px-4 py-4 font-semibold">
              <section>
                <p>Helmet</p>
              </section>
            </td>
            <td className="px-4 py-4 align-middle">
              <a href="/armor?type=helmet" data-discover="true">
                <button
                  className="px-4 py-2 rounded-md text-sm font-semibold
                   bg-[#6B3E1B] text-[#F7E7D0]
                   hover:bg-[#5A3215]
                   active:scale-95 transition-all"
                >
                  + Choose Helmet
                </button>
              </a>
            </td>
            <td className="px-4 py-4">-</td>
            <td className="px-4 py-4 text-sm">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
            <td className="px-4 py-4">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
          </tr>
          Helmet Decoration
          <tr className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
            <td className="px-4 py-4 font-semibold">
              <section>
                <p>Plate</p>
              </section>
            </td>
            <td className="px-4 py-4 align-middle">
              <a href="/armor?type=plate" data-discover="true">
                <button
                  className="px-4 py-2 rounded-md text-sm font-semibold
                   bg-[#6B3E1B] text-[#F7E7D0]
                   hover:bg-[#5A3215]
                   active:scale-95 transition-all"
                >
                  + Choose Plate
                </button>
              </a>
            </td>
            <td className="px-4 py-4">-</td>
            <td className="px-4 py-4 text-sm">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
            <td className="px-4 py-4">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
          </tr>
          Plate Decoration
          <tr className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
            <td className="px-4 py-4 font-semibold">
              <section>
                <p>Gauntlets</p>
              </section>
            </td>
            <td className="px-4 py-4 align-middle">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Kut-Ku Vambraces X</span>
                <div className="flex gap-2">
                  <a
                    className="text-sm text-[#6B3E1B] hover:underline"
                    href="/armor?type=gauntlets"
                    data-discover="true"
                  >
                    Change
                  </a>
                  <button className="text-sm text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </td>
            <td className="px-4 py-4">78</td>
            <td className="px-4 py-4 text-sm">
              <ul className="list-disc list-inside">
                <li className="text-green-700">Rec Speed +1</li>
                <li className="text-green-700">Attack +2</li>
                <li className="text-red-600">Defence -2</li>
                <li className="text-green-700">PsychicVis +4</li>
              </ul>
            </td>
            <td className="px-4 py-4">2</td>
          </tr>
          <tr className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
            <td className="px-4 py-4 font-semibold">
              <section>
                <p>Deocration</p>
              </section>
            </td>{" "}
            <td className="px-4 py-4 align-middle">
              <div>
                <p className="font-medium">Attack Jewel</p>
                <button className="text-sm text-[#6B3E1B] hover:underline">
                  Change
                </button>
                <button className="text-red-600 text-sm hover:underline">
                  Remove
                </button>
              </div>
              <div>
                <p className="font-medium">Map Jewel</p>
                <button className="text-sm text-[#6B3E1B] hover:underline">
                  Change
                </button>
                <button className="text-red-600 text-sm hover:underline">
                  Remove
                </button>
              </div>
            </td>
            <td></td>
            <td className="px-4 py-4 text-sm">
              <ul className="list-disc list-inside">
                <li className="text-green-700">Attack +1</li>
              </ul>
              <ul className="list-disc list-inside">
                <li className="text-green-700">Map +2</li>
              </ul>
            </td>
            <td className="px-4 py-4">
              <span>
                <p>1</p>
              </span>
              <span>
                <p>1</p>
              </span>
            </td>
          </tr>
          <tr className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
            <td className="px-4 py-4 font-semibold">
              <section>
                <p>Waist</p>
              </section>
            </td>
            <td className="px-4 py-4 align-middle">
              <a href="/armor?type=waist" data-discover="true">
                <button
                  className="px-4 py-2 rounded-md text-sm font-semibold
                   bg-[#6B3E1B] text-[#F7E7D0]
                   hover:bg-[#5A3215]
                   active:scale-95 transition-all"
                >
                  + Choose Waist
                </button>
              </a>
            </td>
            <td className="px-4 py-4">-</td>
            <td className="px-4 py-4 text-sm">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
            <td className="px-4 py-4">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
          </tr>
          Waist Decoration
          <tr className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
            <td className="px-4 py-4 font-semibold">
              <section>
                <p>Leggings</p>
              </section>
            </td>
            <td className="px-4 py-4 align-middle">
              <a href="/armor?type=leggings" data-discover="true">
                <button
                  className="px-4 py-2 rounded-md text-sm font-semibold
                   bg-[#6B3E1B] text-[#F7E7D0]
                   hover:bg-[#5A3215]
                   active:scale-95 transition-all"
                >
                  + Choose Leggings
                </button>
              </a>
            </td>
            <td className="px-4 py-4">-</td>
            <td className="px-4 py-4 text-sm">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
            <td className="px-4 py-4">
              <span className="italic text-[#8A6A4A]">—</span>
            </td>
          </tr>
          Leggings Decoration
        </tbody>
      </table>
    </div>
  );
}

function SummaryTable() {
  return (
    <section className="mt-8 bg-[#F7E7D0] rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#6B3E1B]">Total Stats</h2>
        <button
          className="px-3 py-1 rounded-md text-sm font-semibold
                         bg-red-600 text-[#F7E7D0]
                         hover:bg-red-700 transition-all"
        >
          Clear All
        </button>
      </div>

      <p className="mb-4 font-semibold">
        Total Defense: <span className="text-lg">totalDefense</span>
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <li className={`rounded px-3 py-2 bg-red-200 text-red-800"`}>
          skill.name skill.positive ? "+" : "-" skill.amount
        </li>
      </ul>
    </section>
  );
}

export default function ArmorSkillBuilderV1() {
  const armorMapper = useCallback(
    (rawData: ArmorJson[]) => rawData.map(mapRawArmorToArmor),
    [],
  );

  const { data: armorData, loading: loadingArmor } = useDataFetchArray<Armor>(
    "/data/armor.json",
    {
      mapper: armorMapper,
    },
  );

  const decorationMapper = useCallback(
    (rawData: DecorationJson[]) => rawData.map(mapRawDecorationtoDecoration),
    [],
  );

  const { data: decorationData, loading: loadingDecoration } =
    useDataFetchArray<Decoration>("/data/decoration-modified.json", {
      mapper: decorationMapper,
    });

  console.log("armorData", armorData);
  console.log("decorationData", decorationData);

  if (armorData == null || decorationData == null) {
    return <></>;
  }

  const armorSkillBuilderData: ArmorSkillBuilder[] = getArmorSkillBuilderData(
    armorData,
    decorationData,
  );

  return (
    <ContentWrapperProps>
      <div className="max-w-5xl mx-auto px-4 py-8 text-[#5A3F28]">
        <Title />
        <Table armorSkillBuilderDataProps={armorSkillBuilderData} />
        <SummaryTable />
      </div>
    </ContentWrapperProps>
  );
}
