import type { Quest } from "../types/Quest";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { TableEmptyState } from "../components/TableEmptyState";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { useUrlFilters } from "../hooks/useUrlFilters";

export default function Quest() {
  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const { data: quests, loading } = useDataFetchArray<Quest>("/data/quest.json");

  const columnHelper = createColumnHelper<Quest>();

  const questColumns = [
    columnHelper.accessor("name", {
      header: "Quest Name",
      cell: ({ getValue }) => (
        <span className="font-semibold text-[#5A3F28]">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(new Set(quests?.map((quest) => quest.category))),
      },
    }),
    columnHelper.accessor("quest-type", {
      header: "Type",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(new Set(quests?.map((quest) => quest["quest-type"]))),
      },
    }),
    columnHelper.accessor("reward", {
      header: "Reward",
    }),
    columnHelper.accessor("contract-fee", {
      header: "Contract Fee",
    }),
    columnHelper.accessor("time-limit", {
      header: "Time Limit",
    }),
    columnHelper.accessor("location", {
      header: "Location",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(new Set(quests?.map((quest) => quest.location))),
      },
    }),
    columnHelper.accessor("main-monsters", {
      header: "Main Monsters",
      cell: ({ getValue }) => getValue().join(", "),
    }),
    columnHelper.accessor("goal-condition", {
      header: "Goal",
    }),
    columnHelper.accessor("client", {
      header: "Client",
    }),
    columnHelper.accessor("difficulty", {
      header: "Difficulty",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(new Set(quests?.map((quest) => quest.difficulty))).sort((a, b) => a - b),
      },
    }),
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Quests</h1>
        <TableSkeleton rows={10} columns={questColumns.length} />
      </div>
    );
  }

  if (!quests || quests.length === 0) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Quests</h1>
        <TableEmptyState message="No quests found." />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Quests</h1>
      <Table
        data={quests}
        columns={questColumns}
        initialPageSize={10}
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