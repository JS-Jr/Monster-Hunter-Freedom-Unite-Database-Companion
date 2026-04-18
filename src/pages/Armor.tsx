import { type Armor } from "../types/Armor";
import { createColumnHelper, type ColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link } from "react-router-dom";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { encodeName } from "../utils/urlSafe";
import { GetArmorData } from "../hooks/importJsonFile";

export default function ArmorPage() {
  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const armorData: Armor[] = GetArmorData();
  const armorColumns = generateArmorColumns(armorData);

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Armor</h1>
      <Table
        data={armorData}
        columns={armorColumns}
        initialPageSize={10}
        globalFilterable
        initialColumnFilters={columnFilters}
        onFiltersChange={handleFiltersChange}
        initialGlobalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        initialSorting={sorting} // new
        onSortingChange={handleSortingChange} // new
      />
    </div>
  );
}

function generateArmorColumns(armorData: Armor[]) {
  const columnHelper: ColumnHelper<Armor> = createColumnHelper<Armor>();

  const armorColumns = [
    columnHelper.accessor("name", {
      header: "Armor Name",
      cell: ({ row }) => (
        <Link
          to={`/armor/${encodeName(row.original.identifier)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    }),
    columnHelper.accessor("part", {
      header: "Part",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(armorData?.map((armorItem) => armorItem.part)),
        ),
      },
    }),
    columnHelper.accessor("rarity", {
      header: "Rarity",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(armorData?.map((armorItem) => armorItem.rarity)),
        ).sort((a, b) => a - b),
      },
    }),
    columnHelper.accessor("defense", { header: "Defense" }),
    columnHelper.accessor("fireRes", { header: "Fire" }),
    columnHelper.accessor("waterRes", { header: "Water" }),
    columnHelper.accessor("thundrRes", { header: "Thunder" }),
    columnHelper.accessor("iceRes", { header: "Ice" }),
    columnHelper.accessor("dragonRes", { header: "Dragon" }),

    columnHelper.accessor(
      (row: Armor) =>
        row.skillPoints
          .map(
            (skillItem) =>
              `${skillItem.name} ${skillItem.isPositive ? "+" : "-"}${skillItem.points}`,
          )
          .join(", "),
      { id: "skills", header: "Skills" },
    ),
    // ---------------- Add to Skill Builder button ----------------
    // columnHelper.display({
    //   id: "addToBuilder",
    //   header: "Builder",
    //   cell: ({ row }) => (
    //     <button
    //       onClick={() => handleAddToBuilder(row.original)}
    //       className="px-3 py-1 rounded-md text-sm font-semibold
    //                  bg-[#6B3E1B] text-[#F7E7D0]
    //                  hover:bg-[#5A3215] transition-all"
    //     >
    //       Add to Builder
    //     </button>
    //   ),
    // }),
  ];

  return armorColumns;
}
