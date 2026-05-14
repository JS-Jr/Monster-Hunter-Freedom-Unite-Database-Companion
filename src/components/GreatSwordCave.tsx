import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useDataFetchArray } from "../hooks/useDataFetch";
import type { CaveItem } from "../types/Farm";
import { encodeName } from "../utils/urlSafe";
import { Table } from "./Table";

export default function GreatSwordCave() {
  const { data: caveData, loading } = useDataFetchArray<CaveItem>(
    "/data/farm/cave.json",
  );

  if (loading) {
    return <div className="text-center py-8">Loading cave data...</div>;
  }

  if (!caveData || caveData.length === 0) {
    return <div className="text-center py-8">No cave data...</div>;
  }

  const caveColumns = generateCaveColumns();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#5A3F28] mb-6 text-center">
        Great Sword Cave
      </h1>
      <Table
        data={caveData}
        columns={caveColumns}
        initialPageSize={10}
        globalFilterable={false}
        showPagination={false}
      />
    </div>
  );
}

function generateCaveColumns() {
  const columnHelper = createColumnHelper<CaveItem>();

  return [
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
    columnHelper.accessor("chance", {
      header: "Chance",
      cell: ({ getValue }) => <span className="text-sm text-center">{getValue()}%</span>,
    }),
  ];
}