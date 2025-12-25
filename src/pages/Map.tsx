import { Table } from "../components/Table";
import { createColumnHelper, type FilterFn } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useUrlFilters } from "../hooks/useUrlFilters";
import type { MapData } from "../types/MapV2";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { TableEmptyState } from "../components/TableEmptyState";
import deepSearch from "../function/deepSearch";

export default function Map() {
  const deepMapGlobalFilter: FilterFn<MapData> = (row, _, filterValue) => {
    const search = String(filterValue).toLowerCase().trim();
    if (!search) return true;

    return deepSearch(row.original, search);
  };

  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const { data: maps, loading } = useDataFetchArray<MapData>(
    "/data/map-pins.json"
  );

  const columnHelper = createColumnHelper<MapData>();
  const mapColumns = [
    columnHelper.accessor("mapName", {
      header: "Map Name",
      cell: ({ row }) => (
        <Link
          to={`/maps/${encodeURIComponent(row.original.mapName)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {row.original.mapName}
        </Link>
      ),
    }),
    columnHelper.accessor("areas", {
      header: "Areas",
      cell: (info) => info.getValue().length,
    }),
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Map</h1>
        <TableSkeleton rows={10} columns={mapColumns.length} />
      </div>
    );
  }

  if (!maps || maps.length === 0) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Maps</h1>
        <TableEmptyState message="No Maps found." />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Maps</h1>
      <Table
        data={maps}
        columns={mapColumns}
        initialPageSize={10}
        globalFilterFn={deepMapGlobalFilter}
        globalFilterable
        initialColumnFilters={columnFilters}
        onFiltersChange={handleFiltersChange}
        initialGlobalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        initialSorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
