import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link } from "react-router-dom";
import { TableEmptyState } from "../components/TableEmptyState";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { encodeName } from "../utils/urlSafe";
import type { Skill } from "../types/Skills";

export default function Skill() {
  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const { data: skill, loading } =
    useDataFetchArray<Skill>("/data/skills.json");

  const columnHelper = createColumnHelper<Skill>();

  const skillColumns = [
    columnHelper.accessor("skill_name", {
      header: "Skill Name",
      cell: ({ row }) => (
        <Link
          to={`/skill/${encodeName(row.original.skill_name)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {row.original.skill_name}
        </Link>
      ),
    }),

    columnHelper.accessor("skill_type", {
      header: "Skill Type",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(skill?.map((skillItem) => skillItem.skill_type))
        ),
      },
    }),

    columnHelper.accessor("skill_point", {
      header: "Skill Point",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(skill?.map((skillItem) => skillItem.skill_point))
        ),
      },
    }),

    columnHelper.accessor("points", {
      header: "Points",
      //   filterFn: "equalsString",
      //   meta: {
      //     type: "select",
      //     options: Array.from(
      //       new Set(skill?.map((skillItem) => skillItem.points))
      //     ),
      //   },
    }),

    columnHelper.accessor("description", {
      header: "Description",
    }),
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Skill</h1>
        <TableSkeleton rows={10} columns={skillColumns.length} />
      </div>
    );
  }

  if (!skill || skill.length === 0) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Skill</h1>
        <TableEmptyState message="No skill found." />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Skill</h1>
      <Table
        data={skill}
        columns={skillColumns}
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
