import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  rowHeight?: string; // Tailwind height class, e.g. "h-4"
  headerHeight?: string; // Tailwind height class, e.g. "h-6"
  filterRowHeight?: string; // Tailwind height class, e.g. "h-8"
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 10,
  columns = 6,
  rowHeight = "h-4",
  headerHeight = "h-4",
  filterRowHeight = "h-8",
}) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-[#5A3F28] bg-[#F9EEDC] animate-pulse">
      <table className="min-w-full text-sm">
        <thead>
          {/* Header Row */}
          <tr className="bg-[#5A3F28]">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className={`bg-[#8B6B52] ${headerHeight} rounded w-24`} />
              </th>
            ))}
          </tr>

          {/* Filter Row */}
          <tr className="bg-[#E9D3B4]">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-2 py-2">
                <div className={`${filterRowHeight} bg-[#D6B999] rounded`} />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-2">
                  <div className={`${rowHeight} bg-[#D6B999] rounded w-full`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
