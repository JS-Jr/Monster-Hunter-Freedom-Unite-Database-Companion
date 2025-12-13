import { useState, useEffect } from "react";
import type { Armor } from "../types/Armor";
import { mapRawArmorToArmor } from "../utils/mapArmor";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link } from "react-router-dom";

export default function Armor() {
  const [armorData, setArmorData] = useState<Armor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/armor.json")
      .then((response) => response.json())
      .then((rawData) => {
        const mappedData = rawData.map((item: any) => mapRawArmorToArmor(item));
        setArmorData(mappedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load armor data:", err);
        setLoading(false);
      });
  }, []);

  const columnHelper = createColumnHelper<Armor>();

  const armorColumns = [
    columnHelper.accessor("name", {
      header: "Armor Name",
      cell: ({ row }) => (
        <Link
          to={`/armor/${encodeURIComponent(row.original.name)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    }),
    columnHelper.accessor("type", { header: "Type" }),
    columnHelper.accessor("rarity", { header: "Rarity", filterFn: "equals" }),
    columnHelper.accessor("defense", { header: "Defense" }),
    columnHelper.accessor(
      (row: { resistances: { fire: any } }) => row.resistances.fire,
      {
        id: "fireRes",
        header: "Fire",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { water: any } }) => row.resistances.water,
      {
        id: "waterRes",
        header: "Water",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { thunder: any } }) => row.resistances.thunder,
      {
        id: "thunderRes",
        header: "Thunder",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { ice: any } }) => row.resistances.ice,
      {
        id: "iceRes",
        header: "Ice",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { dragon: any } }) => row.resistances.dragon,
      {
        id: "dragonRes",
        header: "Dragon",
      }
    ),
    columnHelper.accessor(
      (row: { skills: { name: any; amount: any }[] }) =>
        row.skills
          .map((s: { name: any; amount: any }) => `${s.name} +${s.amount}`)
          .join(", "),
      { id: "skills", header: "Skills" }
    ),
  ];

  if (loading) return <div>Loading armor data...</div>;

  return (
    // <div className="p-4 min-h-screen bg-[#E9D3B4] text-[#5A3F28]">
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Armor</h1>
      <Table
        data={armorData}
        columns={armorColumns}
        initialPageSize={10}
        globalFilterable={true} // enables the search input
      />
    </div>
  );
}
