import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  hidden?: boolean; // optional flag to hide columns
};

type DataTableProps<T> = {
  data: T[];
  columns?: Column<T>[]; // optional — auto-generate if not provided
};

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
}: DataTableProps<T>) {
  if (!data || data.length === 0) return <p>No data found.</p>;

  // 🔧 Auto-generate columns if none are provided
  const autoColumns: Column<T>[] =
    columns && columns.length
      ? columns
      : (Object.keys(data[0]) as (keyof T)[]).map((key) => ({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          accessor: key,
        }));

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr>
            {autoColumns
              .filter((col) => !col.hidden)
              .map((col) => (
                <th
                  key={String(col.accessor)}
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #ccc",
                    padding: "0.5rem",
                    background: "#f7f7f7",
                  }}
                >
                  {col.header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                borderBottom: "1px solid #eee",
                background: rowIndex % 2 === 0 ? "#fafafa" : "#fff",
              }}
            >
              {autoColumns
                .filter((col) => !col.hidden)
                .map((col) => (
                  <td key={String(col.accessor)} style={{ padding: "0.5rem" }}>
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : formatValue(row[col.accessor])}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// helper: format arrays/objects neatly
function formatValue(value: any): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null)
    return JSON.stringify(value, null, 2);
  return String(value);
}
