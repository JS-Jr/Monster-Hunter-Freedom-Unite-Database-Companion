import { useSearchParams } from "react-router-dom";
import type { ColumnFiltersState } from "@tanstack/react-table";

interface UseUrlFiltersResult {
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  handleFiltersChange: (filters: ColumnFiltersState) => void;
  handleGlobalFilterChange: (value: string) => void;
  clearAllFilters: () => void;
}

/**
 * Hook for managing table filters and global search via URL parameters
 * Keeps URL in sync with table state, allowing bookmarkable/shareable filter states
 * 
 * @returns Object with filter state and handlers
 * 
 * @example
 * const {
 *   columnFilters,
 *   globalFilter,
 *   handleFiltersChange,
 *   handleGlobalFilterChange
 * } = useUrlFilters();
 * 
 * return (
 *   <Table
 *     data={data}
 *     columns={columns}
 *     initialColumnFilters={columnFilters}
 *     onFiltersChange={handleFiltersChange}
 *     initialGlobalFilter={globalFilter}
 *     onGlobalFilterChange={handleGlobalFilterChange}
 *   />
 * );
 */
export function useUrlFilters(): UseUrlFiltersResult {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse column filters from URL (exclude 'q' which is for global search)
  const columnFilters: ColumnFiltersState = Array.from(searchParams.entries())
    .filter(([key]) => key !== "q")
    .map(([id, value]) => ({
      id,
      value,
    }));

  // Parse global filter from URL
  const globalFilter = searchParams.get("q") ?? "";

  const handleFiltersChange = (filters: ColumnFiltersState) => {
    const params = new URLSearchParams(searchParams);

    // Remove all column filter params first (except 'q')
    Array.from(params.keys()).forEach((key) => {
      if (key !== "q") {
        params.delete(key);
      }
    });

    // Add active filters
    filters.forEach(({ id, value }) => {
      if (value != null && value !== "") {
        params.set(id, String(value));
      }
    });

    setSearchParams(params, { replace: true });
  };

  const handleGlobalFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    setSearchParams(params, { replace: true });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    Array.from(params.keys()).forEach((key) => {
      params.delete(key);
    });
    setSearchParams(params, { replace: true });
  };

  return {
    columnFilters,
    globalFilter,
    handleFiltersChange,
    handleGlobalFilterChange,
    clearAllFilters,
  };
}
