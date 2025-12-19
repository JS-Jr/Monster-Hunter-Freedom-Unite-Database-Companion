import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Weapon, WeaponElement } from "../types/Weapon";
import { Table } from "../components/Table";
import {
  createColumnHelper,
  type ColumnFiltersState,
} from "@tanstack/react-table";

export default function Weapons() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const columnHelper = createColumnHelper<Weapon>();
  const [searchParams, setSearchParams] = useSearchParams();

  const columnFiltersFromUrl: ColumnFiltersState = Array.from(
    searchParams.entries()
  )
    .filter(([key]) => key !== "q")
    .map(([id, value]) => ({
      id,
      value,
    }));
  const globalFilterFromUrl = searchParams.get("q") ?? "";

  const handleFiltersChange = (filters: ColumnFiltersState) => {
    const params = new URLSearchParams(searchParams);

    Array.from(params.keys()).forEach((key) => {
      if (key !== "q") {
        params.delete(key);
      }
    });
    filters.forEach(({ id, value }) => {
      if (value != null && value !== "") {
        params.set(id, String(value));
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleGlobalSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    fetch("/data/weapons.json")
      .then((res) => res.json())
      .then((data: Weapon[]) => {
        setWeapons(data);
      })
      .catch((err) => console.error("Error loading weapons:", err));
  }, []);

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
        options: Array.from(new Set(weapons.map((m) => m.type))),
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
          new Set(weapons.flatMap((w) => w.elements?.map((e) => e.name) ?? []))
        ),
      },
    }),
  ];

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Weapon</h1>

      <Table
        data={weapons}
        columns={weaponColumns}
        initialPageSize={10}
        globalFilterable={true}
        initialColumnFilters={columnFiltersFromUrl}
        onFiltersChange={handleFiltersChange}
        initialGlobalFilter={globalFilterFromUrl}
        onGlobalFilterChange={handleGlobalSearchChange}
      />
    </div>
  );
}
