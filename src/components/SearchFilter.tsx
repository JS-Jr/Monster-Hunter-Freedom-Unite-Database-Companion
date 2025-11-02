import type { ChangeEvent } from "react";

type SearchFilterProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  filterOptions: string[];
};

export default function SearchFilter({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions,
}: SearchFilterProps) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
        style={{
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
          flex: 1,
        }}
      />
      <select
        value={filter}
        onChange={handleFilter}
        style={{
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
        }}
      >
        <option value="">All Types</option>
        {filterOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
