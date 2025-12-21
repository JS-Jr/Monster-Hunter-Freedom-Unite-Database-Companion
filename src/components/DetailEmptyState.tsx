import React from "react";

interface DetailEmptyStateProps {
  /** Main message title */
  message?: string;
  /** Name of the entity, e.g., "monster", "item", "user" */
  entityName?: string;
  /** Optional icon */
  icon?: React.ReactNode;
}

export const DetailEmptyState: React.FC<DetailEmptyStateProps> = ({
  message,
  entityName,
  icon,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Icon */}
      <div className="text-6xl mb-4 text-[#8B6B52]">{icon ?? "🛡️"}</div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-[#5A3F28] mb-2">{message}</h2>

      {/* Subtext */}
      <p className="text-[#5A3F28] opacity-70 max-w-md">
        Check your URL or try selecting another {entityName} from the list.
      </p>
    </div>
  );
};
