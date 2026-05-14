import type { CastingMachineItem } from "../types/Farm";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "./Table";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { Link } from "react-router-dom";
import { encodeName } from "../utils/urlSafe";

export default function CastingMachine() {
  const { data: castingMachineData, loading } =
    useDataFetchArray<CastingMachineItem>("/data/farm/casting-machine.json");

  if (loading) {
    return (
      <div className="text-center py-8">Loading casting machine data...</div>
    );
  }

  if (!castingMachineData || castingMachineData.length === 0) {
    return <div className="text-center py-8">No casting machine data...</div>;
  }

  const castingMachineColumns =
    generateCastingMachineColumn(castingMachineData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#5A3F28] mb-6 text-center">
        Casting Machine Drops
      </h1>
      <Table
        data={castingMachineData}
        columns={castingMachineColumns}
        initialPageSize={5}
        globalFilterable={false}
        showPagination={false}
      />
    </div>
  );
}

function generateCastingMachineColumn(
  castingMachineData: CastingMachineItem[],
) {
  const columnHelper = createColumnHelper<CastingMachineItem>();

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
    columnHelper.display({
      id: "chances",
      header: "Chances",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-sm text-center">
            {item.chances.map((chance, index) => (
              <div key={index}>
                Yield: {chance.amount} ({chance.chance}%)
              </div>
            ))}
          </div>
        );
      },
    }),
  ];

  return castingMachineColumns;
}
