import type { BeehiveItem } from "../types/Farm";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "./Table";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { Link } from "react-router-dom";
import { encodeName } from "../utils/urlSafe";

export default function Beehive() {
  const { data: beehiveData, loading } = useDataFetchArray<BeehiveItem>(
    "/data/farm/beehive.json",
  );

  if (loading) {
    return <div className="text-center py-8">Loading beehive data...</div>;
  }

  if (!beehiveData || beehiveData.length === 0) {
    return <div className="text-center py-8">No beehive data...</div>;
  }

  const beeHiveColumn = generateBeehiveColumn(beehiveData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#5A3F28] mb-6 text-center">
        Beehive Drops
      </h1>
      <Table
        data={beehiveData}
        columns={beeHiveColumn}
        initialPageSize={5}
        globalFilterable={false}
        showPagination={false}
      />
    </div>
  );
}

function generateBeehiveColumn(beehiveData: BeehiveItem[]) {
  const columnHelper = createColumnHelper<BeehiveItem>();
  const allLevels = Array.from(
    new Set(beehiveData.flatMap((item) => item.chances.map((c) => c.level))),
  ).sort();

  const beehiveColumns = [
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
        beehiveData
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

  return beehiveColumns;
}
