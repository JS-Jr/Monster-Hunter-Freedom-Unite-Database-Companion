import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useDataFetchArray } from "../hooks/useDataFetch";
import type { BugTreeItem } from "../types/Farm";
import { encodeName } from "../utils/urlSafe";
import { Table } from "./Table";

export default function BugTree() {
  const { data: bugItemData, loading } = useDataFetchArray<BugTreeItem>(
    "/data/farm/bug-tree.json",
  );

  if (loading) {
    return <div className="text-center py-8">Loading bug tree data...</div>;
  }

  if (!bugItemData || bugItemData.length === 0) {
    return <div className="text-center py-8">No bug tree data...</div>;
  }

  const bugTreeColumn = generateBugTreeColumn(bugItemData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#5A3F28] mb-6 text-center">
        Bug Tree
      </h1>
      <Table
        data={bugItemData}
        columns={bugTreeColumn}
        initialPageSize={10}
        globalFilterable={false}
        // showPagination={false}
      />
    </div>
  );
}

function generateBugTreeColumn(bugTreeItemData: BugTreeItem[]) {
  const columnHelper = createColumnHelper<BugTreeItem>();
  const allItems = Array.from(new Set(bugTreeItemData.flatMap((b) => b.items)));

  const bugTreeColumn = [
    columnHelper.accessor("hammer", {
      header: "Hammer",
      cell: ({ getValue }) => (
        <span className="font-semibold text-[#5A3F28]">{getValue()}</span>
      ),
    }),
    ...allItems.map((itemName) =>
      columnHelper.display({
        id: `item-${itemName}`,
        header: itemName,
        cell: ({ row }) => {
          const r = row.original;
          const has = r.items.includes(itemName);
          return <div className="text-sm text-center">{has ? "✓" : "-"}</div>;
        },
      }),
    ),
  ];

  return bugTreeColumn;
}
