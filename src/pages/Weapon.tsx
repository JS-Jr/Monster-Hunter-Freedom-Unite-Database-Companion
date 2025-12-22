import { Link } from "react-router-dom";
import type { Weapon, WeaponElement } from "../types/Weapon";
import { Table } from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { TableEmptyState } from "../components/TableEmptyState";

export default function Weapons() {
  const columnHelper = createColumnHelper<Weapon>();

  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const { data: weapons, loading } =
    useDataFetchArray<Weapon>("/data/weapons.json");

  const weaponColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row, getValue }) => (
        <Link
          to={`/weapons/${encodeURIComponent(row.original.name)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {getValue()}
        </Link>
      ),
    }),

    columnHelper.accessor("type", {
      header: "Type",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(new Set(weapons?.map((m) => m.type))),
      },
    }),

    columnHelper.accessor("attack", {
      header: "Attack",
    }),

    columnHelper.accessor("affinity", {
      header: "Affinity",
    }),

    columnHelper.accessor("rarity", {
      header: "Rarity",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(weapons?.map((weaponItem) => weaponItem.rarity))
        ).sort((a, b) => a - b),
      },
    }),

    columnHelper.accessor("elements", {
      header: "Elements",

      cell: ({ getValue, column }) => {
        const elements = getValue() as { name: string; attack: number }[];
        const activeFilter = column.getFilterValue() as string | undefined;

        if (!elements?.length) return "—";

        const visibleElements = activeFilter
          ? elements.filter((e) => e.name === activeFilter)
          : elements;

        return visibleElements.map((e) => `${e.name} ${e.attack}`).join(", ");
      },

      filterFn: (row, columnId, filterValue) => {
        const elements = row.getValue(columnId) as
          | WeaponElement[]
          | null
          | undefined;

        if (!elements || elements.length === 0) {
          return false; // ⬅️ IMPORTANT
        }

        return elements.some((e) => e.name === filterValue);
      },

      meta: {
        type: "select",
        options: Array.from(
          new Set(weapons?.flatMap((w) => w.elements?.map((e) => e.name) ?? []))
        ),
      },
    }),
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Weapon</h1>
        <TableSkeleton rows={10} columns={weaponColumns.length} />
      </div>
    );
  }

  if (!weapons || weapons.length === 0) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Weapon</h1>
        <TableEmptyState message="No weapons found." />
      </div>
    );
  }

  // console.log(Array.from(new Set(weapons.map((m) => m.type))));

  // console.log(
  //   weapons
  //     .map((weapon, index) => ({ index, weapon }))
  //     .filter(({ weapon }) => weapon.type === undefined)
  // );

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Weapon</h1>

      <Table
        data={weapons}
        columns={weaponColumns}
        globalFilterable={true}
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
