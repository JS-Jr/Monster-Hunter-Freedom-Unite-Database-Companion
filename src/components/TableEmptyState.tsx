import React from "react";

interface TableEmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  message = "No data found.",
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Optional icon */}
      {icon ? (
        <div className="mb-4 text-6xl text-[#8B6B52]">{icon}</div>
      ) : (
        <div className="mb-4 text-6xl text-[#8B6B52]">🛡️</div>
      )}

      <h2 className="text-2xl font-bold text-[#5A3F28] mb-2">{message}</h2>
      <p className="text-[#5A3F28] opacity-70 max-w-md">
        Try adjusting your filters or check back later. Monsters might appear
        soon!
      </p>
    </div>
  );
};
