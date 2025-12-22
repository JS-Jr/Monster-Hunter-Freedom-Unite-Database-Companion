import { useSearchParams } from "react-router-dom";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

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
export function useUrlFilters(): UseUrlFiltersResult & {
  sorting: SortingState;
  handleSortingChange: (sorting: SortingState) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  // Existing column filters
  const columnFilters: ColumnFiltersState = Array.from(searchParams.entries())
    .filter(([key]) => key !== "q" && key !== "sort")
    .map(([id, value]) => ({
      id,
      value,
    }));

  // Global filter
  const globalFilter = searchParams.get("q") ?? "";

  // New: parse sorting from URL
  const sortParam = searchParams.get("sort") ?? "";
  const sorting: SortingState = sortParam
    ? sortParam.split(",").map((s) => {
        const [id, desc] = s.split(":");
        return { id, desc: desc === "desc" };
      })
    : [];

  // Existing handlers
  const handleFiltersChange = (filters: ColumnFiltersState) => {
    const params = new URLSearchParams(searchParams);
    Array.from(params.keys()).forEach((key) => {
      if (key !== "q" && key !== "sort") params.delete(key);
    });
    filters.forEach(({ id, value }) => {
      if (value != null && value !== "") params.set(id, String(value));
    });
    setSearchParams(params, { replace: true });
  };

  const handleGlobalFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("q", value);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  };

  // New: handle sorting change
  const handleSortingChange = (sorting: SortingState) => {
    const params = new URLSearchParams(searchParams);
    if (sorting.length) {
      const value = sorting
        .map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
        .join(",");
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    setSearchParams(params, { replace: true });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    setSearchParams(params, { replace: true });
  };

  return {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
    clearAllFilters,
  };
}
