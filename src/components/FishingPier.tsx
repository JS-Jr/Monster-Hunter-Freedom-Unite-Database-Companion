import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useDataFetchArray } from "../hooks/useDataFetch";
import type { FishingSpotItem } from "../types/Farm";
import { encodeName } from "../utils/urlSafe";
import { Table } from "./Table";

export default function FishingPier() {
  const { data: fishingSpotItemData, loading } = useDataFetchArray<FishingSpotItem>(
    "/data/farm/fishing-spot.json",
  );

  if (loading) {
    return <div className="text-center py-8">Loading fishing data...</div>;
  }

  if (!fishingSpotItemData || fishingSpotItemData.length === 0) {
    return <div className="text-center py-8">No fishing data...</div>;
  }

  const fishingSpotColumn = generateFishingSpotColumn(fishingSpotItemData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#5A3F28] mb-6 text-center">
        Fishing Pier
      </h1>
      <Table
        data={fishingSpotItemData}
        columns={fishingSpotColumn}
        initialPageSize={10}
        globalFilterable={false}
        // showPagination={false}
      />
    </div>
  );
}

function generateFishingSpotColumn(fishingSpotItemData: FishingSpotItem[]) {
  const columnHelper = createColumnHelper<FishingSpotItem>();
  const allLevels = Array.from(
    new Set(fishingSpotItemData.flatMap((item) => item.chances.map((c) => c.level))),
  ).sort();

  const fishingSpotColumn = [
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
        fishingSpotItemData
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
              <div>{chanceData.chance}%</div>
            </div>
          );
        },
      });
    }),
  ];

  return fishingSpotColumn;
}