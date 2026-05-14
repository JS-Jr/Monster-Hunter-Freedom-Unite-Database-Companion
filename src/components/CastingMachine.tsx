import type { CastingMachineItem } from "../types/Farm";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "./Table";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { Link } from "react-router-dom";
import { encodeName } from "../utils/urlSafe";

export default function CastingMachine() {
  const { data: castingMachineData, loading } = useDataFetchArray<CastingMachineItem>(
    "/data/farm/casting-machine.json",
  );

  if (loading) {
    return <div className="text-center py-8">Loading beehive data...</div>;
  }

  if (!castingMachineData || castingMachineData.length === 0) {
    return <div className="text-center py-8">No beehive data...</div>;
  }

  const beeHiveColumn = generateCastingMachineColumn(castingMachineData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#5A3F28] mb-6 text-center">
        Beehive Drops
      </h1>
      <Table
        data={castingMachineData}
        columns={beeHiveColumn}
        initialPageSize={5}
        globalFilterable={false}
        showPagination={false}
      />
    </div>
  );
}

function generateCastingMachineColumn(castingMachineData: CastingMachineItem[]) {
  const columnHelper = createColumnHelper<CastingMachineItem>();
  const allLevels = Array.from(
    new Set(castingMachineData.flatMap((item) => item.chances.map((c) => c.level))),
  ).sort();

  const castingMachineColumns = [
    columnHelper.accessor("name", {
      header: "Item",
      cell: ({ getValue }) => (
        <Link
          to={`/item/${encodeName(getValue())}`}
          className="font-semibold text-[#5A3F28]"
        >
          {getValue()}
        </Link>
      ),
    }),
    ...allLevels.map((level) => {
      // Get the levelName for this level (use the first occurrence)
      const levelName =
        castingMachineData
          .flatMap((item) => item.chances)
          .find((c) => c.level === level)?.levelName ?? `Level ${level}`;

      return columnHelper.display({
        id: `level-${level}`, // Fixed: use unique ID with prefix
        header: levelName, // Fixed: use levelName instead of number
        cell: ({ row }) => {
          const item = row.original;
          const chanceData = item.chances.find((c) => c.level === level);
          if (!chanceData) {
            return <span>-</span>;
          }
          return (
            <div className="text-sm text-center">
              <div>Yield: {chanceData.amount}</div>
              <div>{chanceData.chance}%</div>
            </div>
          );
        },
      });
    }),
  ];

  return castingMachineColumns;
}
