import { getArmorSkillBuilderData } from "../utils/armorSkillBuilderParser";
import ContentWrapperProps from "../components/ContentWrapper";
import { Link } from "react-router-dom";


function Title() {
  return <h1 className="text-3xl font-extrabold text-center text-[#6B3E1B] mb-6">
    Skill Builder
  </h1>
};

function Table() {

  const SLOTS =
    [
      { type: "Helmet", label: "Helmet", selectPath: "/select/helmet" },
      { type: "Helmet Decoration", label: "Deocration", selectPath: "/select/helmet/decoration" },
      { type: "Plate", label: "Plate", selectPath: "/select/plate" },
      { type: "Plate Decoration", label: "Deocration", selectPath: "/select/plate/decoration" },
      { type: "Gauntlets", label: "Gauntlets", selectPath: "/select/gauntlets" },
      { type: "Gauntlets Decoration", label: "Deocration", selectPath: "/select/gauntlets/decoration" },
      { type: "Waist", label: "Waist", selectPath: "/select/waist" },
      { type: "Waist Decoration", label: "Deocration", selectPath: "/select/waist/decoration" },
      { type: "Leggings", label: "Leggings", selectPath: "/select/leggings" },
      { type: "Leggings Decoration", label: "Deocration", selectPath: "/select/leggings/decoration" },
    ];


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
          {
            SLOTS.map((slotElement) => {
              console.log(slotElement.type.toLocaleLowerCase());

              if (slotElement.type.toLocaleLowerCase().includes("decoration")) {
                return (
                  <tr key={slotElement.type} className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
                    <td className="px-4 py-4 font-semibold">
                      <section>
                        <p>{slotElement.label}</p>
                      </section>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Link to="">
                        <button
                          className="
                        px-4 py-2 rounded-md text-sm font-semibold
                        bg-[#6B3E1B] text-[#F7E7D0]
                        hover:bg-[#5A3215]
                        active:scale-95 transition-all"
                        >
                          + Choose {slotElement.label}
                        </button>
                      </Link>
                    </td>
                    <td className="px-4 py-4">—</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="italic text-[#8A6A4A]">—</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="italic text-[#8A6A4A]">—</span>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={slotElement.type} className="border-t border-[#CBA986] hover:bg-[#F3DFC4]">
                  <td className="px-4 py-4 font-semibold">
                    <section>
                      <p>{slotElement.label}</p>
                    </section>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <Link to="">
                      <button
                        className="
                        px-4 py-2 rounded-md text-sm font-semibold
                        bg-[#6B3E1B] text-[#F7E7D0]
                        hover:bg-[#5A3215]
                        active:scale-95 transition-all"
                      >
                        + Choose {slotElement.label}
                      </button>
                    </Link>
                  </td>
                  <td className="px-4 py-4">—</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="italic text-[#8A6A4A]">—</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="italic text-[#8A6A4A]">—</span>
                  </td>
                </tr>
              );









            }
            )

          }




        </tbody>
      </table>
    </div>
  );
}

function SummaryTable() {
  return <section className="mt-8 bg-[#F7E7D0] rounded-lg shadow p-6">
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

      <li
        className={`rounded px-3 py-2 bg-red-200 text-red-800"`}
      >
        skill.name skill.positive ? "+" : "-"
        skill.amount
      </li>
    </ul>
  </section>;
}

export default function ArmorSkillBuilderV1() {
  const data = getArmorSkillBuilderData();
  console.log("data", data)
  return <ContentWrapperProps>
    <div className="max-w-5xl mx-auto px-4 py-8 text-[#5A3F28]">
      <Title />
      <Table />
      <SummaryTable />
    </div>
  </ContentWrapperProps>;
}