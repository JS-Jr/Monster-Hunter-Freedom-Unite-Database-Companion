import { useEffect, useState } from "react";
import type { Item } from "../types/Item";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Table } from "../components/Table";

export default function Item() {
  const [itemData, setItemData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/item.json");
        const rawData: any[] = await response.json();

        const mappedData: Item[] = rawData.map((item) => ({
          type: item.itemType ?? "", // ensure string
          name: item.itemName ?? "",
          rarity: Number(item.rarity ?? 0), // ensure number
          bagCapacity: Number(item.bagCapacity ?? 0),
          sellValue: item.sellValue ?? "",
          howToGet: item.howToGet ?? "",
        }));

        console.log(mappedData);
        setItemData(mappedData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columnHelper = createColumnHelper<Item>();
  const itemColumns = [
    columnHelper.accessor("type", { header: "Type" }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link
            to={`/item/${item.name}`}
            className="text-blue-600 hover:underline"
          >
            {item.name}
          </Link>
        );
      },
    }),
    columnHelper.accessor("rarity", { header: "Rarity", filterFn: "equals" }),
    columnHelper.accessor("bagCapacity", {
      header: "Bag Capacity",
      filterFn: "equals",
    }),
    columnHelper.accessor("sellValue", {
      header: "Sell Value",
      filterFn: "equals",
    }),
    columnHelper.accessor("howToGet", {
      header: "How to Get",
      filterFn: "equals",
    }),
  ];

  if (loading) return <div>Loading Item data...</div>;

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Item</h1>

      <Table
        data={itemData}
        columns={itemColumns}
        initialPageSize={10}
        globalFilterable={true} // enables the search input
      />
    </div>
  );
}
