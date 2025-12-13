import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Weapon } from "../types/Weapon";
import { Table } from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";

export default function Weapons() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);

  useEffect(() => {
    fetch("/data/weapons.json")
      .then((res) => res.json())
      .then((data: Weapon[]) => {
        setWeapons(data);
      })
      .catch((err) => console.error("Error loading weapons:", err));
  }, []);

  const columnHelper = createColumnHelper<Weapon>();

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
      cell: ({ getValue }) => {
        const elements = getValue();
        return elements?.length
          ? elements.map((e) => `${e.name} ${e.attack}`).join(", ")
          : "—";
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
        globalFilterable={true} // enables the search input
      />
    </div>
  );
}
