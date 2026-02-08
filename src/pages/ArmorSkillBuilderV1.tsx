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

type TableProps = {
  armorSkillBuilderDataProps: ArmorSkillBuilder[];
};

function Table({ armorSkillBuilderDataProps }: TableProps) {
  const SLOTS = [
    // { type: "Helmet", label: "Helmet", selectPath: "/select/helmet" },
    { type: "Helmet", label: "Helmet", selectPath: "/armor?type=helmet" },
    {
      type: "Helmet Decoration",
      label: "Deocration",
      selectPath: "/select/helmet/decoration",
    },

    { type: "Plate", label: "Plate", selectPath: "/armor?type=plate" },
    {
      type: "Plate Decoration",
      label: "Deocration",
      selectPath: "/select/plate/decoration",
    },

    {
      type: "Gauntlets",
      label: "Gauntlets",
      selectPath: "/armor?type=gauntlets",
    },
    {
      type: "Gauntlets Decoration",
      label: "Deocration",
      selectPath: "/select/gauntlets/decoration",
    },

    { type: "Waist", label: "Waist", selectPath: "/armor?type=waist" },
    {
      type: "Waist Decoration",
      label: "Deocration",
      selectPath: "/select/waist/decoration",
    },

    { type: "Leggings", label: "Leggings", selectPath: "/armor?type=leggings" },
    {
      type: "Leggings Decoration",
      label: "Deocration",
      selectPath: "/select/leggings/decoration",
    },
  ];

  console.log("armorSkillBuilderData", armorSkillBuilderDataProps);

  function getArmorSkillBuilderSingleItem(
    armorType: string,
    armorSkillBuilderData: ArmorSkillBuilder[],
  ): ArmorSkillBuilder | undefined {
    for (const amorSkillBuilderItem of armorSkillBuilderData) {
      console.log(
        "amorSkillBuilderItem.armor.type",
        amorSkillBuilderItem.armor.type,
      );
      console.log("armorType", armorType);

      if (amorSkillBuilderItem.armor.type.toLocaleLowerCase() == armorType) {
        return amorSkillBuilderItem;
      }

      if (
        amorSkillBuilderItem.armor.type.toLocaleLowerCase().includes(armorType)
      ) {
        return amorSkillBuilderItem;
      }

      return;
    }
  }

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
          {SLOTS.map((slotElement, index) => {
            let slotType = slotElement.type.toLocaleLowerCase();
            console.log(slotType);
            let armor = getArmorSkillBuilderSingleItem(
              slotType,
              armorSkillBuilderDataProps,
            );

            let selectionActionRow: JSX.Element = (
              <Link to={slotElement.selectPath}>
                <button
                  className="px-4 py-2 rounded-md text-sm font-semibold
                   bg-[#6B3E1B] text-[#F7E7D0]
                   hover:bg-[#5A3215]
                   active:scale-95 transition-all"
                >
                  + Choose {slotElement.label}
                </button>
              </Link>
            );

            let skillRow: JSX.Element = (
              <span className="italic text-[#8A6A4A]">—</span>
            );

            if (armor) {
              selectionActionRow = (
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{armor.armor.name}</span>
                  <div className="flex gap-2">
                    <Link
                      to={slotElement.selectPath}
                      className="text-sm text-[#6B3E1B] hover:underline"
                    >
                      Change
                    </Link>
                    <button
                      // onClick={() => removeSlot(slot.type)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );

              skillRow = (
                <ul className="list-disc list-inside">
                  {armor.armor.skills.map((skillItem, index) => (
                    <li
                      key={index}
                      className={
                        skillItem.positive ? "text-green-700" : "text-red-600"
                      }
                    >
                      {skillItem.name} {skillItem.positive ? "+" : "-"}
                      {skillItem.amount}
                    </li>
                  ))}
                </ul>
              );
            }

            if (!slotType.includes("decoration")) {
              return (
                <tr
                  key={slotElement.type}
                  className="border-t border-[#CBA986] hover:bg-[#F3DFC4]"
                >
                  <td className="px-4 py-4 font-semibold">
                    <section>
                      <p>{slotElement.label}</p>
                    </section>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    {selectionActionRow}
                  </td>
                  <td className="px-4 py-4">
                    {armor ? armor.armor.defense : "-"}
                  </td>
                  <td className="px-4 py-4 text-sm">{skillRow}</td>
                  <td className="px-4 py-4">
                    {armor ? (
                      armor.armor.slots
                    ) : (
                      <span className="italic text-[#8A6A4A]">—</span>
                    )}
                  </td>
                </tr>
              );
            }

            slotType = SLOTS[index - 1].type.toLocaleLowerCase();
            console.log(slotType);
            armor = getArmorSkillBuilderSingleItem(
              slotType,
              armorSkillBuilderDataProps,
            );

            console.log("armor", armor);
            if (armor?.attachedDecoration === undefined) {
              console.log("attachedDecoration is undefined");
              return <>{slotElement.type}</>;
            }

            const attachedDecoration: Decoration[] = armor.attachedDecoration;

            console.log("attachedDecoration", attachedDecoration);

            function getAttachedDecorationNames(
              decorationData: Decoration[],
            ): JSX.Element {
              const content: JSX.Element[] = decorationData.map(
                (decorationDataItem, index) => (
                  <span key={index}>
                    <p>{decorationDataItem.name}</p>
                  </span>
                ),
              );

              return <>{content}</>;
            }

            function getAttachedDecorationSkills(
              decorationData: Decoration[],
            ): JSX.Element {
              const content: JSX.Element[] = decorationData.map(
                (decorationDataItem, index) => (
                  <ul className="list-disc list-inside" key={index}>
                    {decorationDataItem.skills.map((skillItem, skillIndex) => (
                      <li
                        key={skillIndex} // Use skillIndex for unique keys within the list
                        className={
                          skillItem.positive ? "text-green-700" : "text-red-600"
                        }
                      >
                        {skillItem.name} {skillItem.positive ? "+" : "-"}
                        {skillItem.amount}
                      </li>
                    ))}
                  </ul>
                ),
              );

              return <>{content}</>;
            }

            {
              armor.armor.skills.map((skillItem, index) => (
                <li
                  key={index}
                  className={
                    skillItem.positive ? "text-green-700" : "text-red-600"
                  }
                >
                  {skillItem.name} {skillItem.positive ? "+" : "-"}
                  {skillItem.amount}
                </li>
              ));
            }
            function getAttachedDecorationSlotConsumption(
              decorationData: Decoration[],
            ): JSX.Element {
              const content: JSX.Element[] = decorationData.map(
                (decorationDataItem, index) => (
                  <span key={index}>
                    <p>{decorationDataItem.slots}</p>
                  </span>
                ),
              );

              return <>{content}</>;
            }

            let slotRow = (
              <>
                {armor?.attachedDecoration ? (
                  armor.armor.slots
                ) : (
                  <span className="italic text-[#8A6A4A]">—</span>
                )}
              </>
            );

            selectionActionRow = getAttachedDecorationNames(attachedDecoration);
            skillRow = getAttachedDecorationSkills(attachedDecoration);
            slotRow = getAttachedDecorationSlotConsumption(attachedDecoration);

            return (
              <tr
                key={slotElement.type}
                className="border-t border-[#CBA986] hover:bg-[#F3DFC4]"
              >
                <td className="px-4 py-4 font-semibold">
                  <section>
                    <p>{slotElement.label}</p>
                  </section>
                </td>
                <td className="px-4 py-4 align-middle">{selectionActionRow}</td>
                <td></td>
                <td className="px-4 py-4 text-sm">{skillRow}</td>
                <td className="px-4 py-4">
                  {/* {armor?.attachedDecoration ? (
                    armor.armor.slots
                  ) : (
                    <span className="italic text-[#8A6A4A]">—</span>
                  )} */}
                  {slotRow}
                </td>
              </tr>
            );
          })}
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
  // const data = getArmorSkillBuilderData();
  // console.log("data", data);

  // const [armorSkillBuilder, setArmorSkillBuilder] = useState();

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

  console.log("armorSkillBuilderData", armorSkillBuilderData);

  // useEffect(() => {
  //   const data = getArmorSkillBuilderData();
  //   setArmorData(data);
  //   const computedData = computeSummary(data);
  //   setSummaryData(computedData);
  // }, []);

  // function

  // const computeSummary = (data) => {
  //   return data.length; // Example summary computation
  // };

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
