// src/components/ArmorFilter.tsx
import type { ArmorFilters } from "../types/ArmorFilters";

type Props = {
  filters: ArmorFilters;
  setFilters: (filters: ArmorFilters) => void;
  filterOptions: {
    types: string[];
  };
};

export default function ArmorFilter({ filters, setFilters, filterOptions }: Props) {
  // Helper to update only a single field while keeping the others
  const updateFilter = <K extends keyof ArmorFilters>(key: K, value: ArmorFilters[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 border rounded-md bg-gray-50">
      {/* Name Search */}
      <div>
        <label className="block text-sm text-gray-700">Name</label>
        <input
          type="text"
          value={filters.name || ""}
          onChange={(e) => updateFilter("name", e.target.value)}
          placeholder="Search name..."
          className="p-2 border rounded-md"
        />
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm text-gray-700">Type</label>
        <select
          value={filters.type || ""}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Types</option>
          {filterOptions.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-sm text-gray-700">Gender</label>
        <select
          value={filters.gender || ""}
          onChange={(e) => updateFilter("gender", e.target.value as any)}
          className="p-2 border rounded-md"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="both">Both</option>
        </select>
      </div>

      {/* Rarity */}
      <div>
        <label className="block text-sm text-gray-700">Rarity</label>
        <select
          value={filters.rarity || ""}
          onChange={(e) => updateFilter("rarity", Number(e.target.value))}
          className="p-2 border rounded-md"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Slots Filter */}
      <div>
        <label className="block text-sm text-gray-700">Min Slots</label>
        <input
          type="number"
          min={0}
          value={filters.minSlots || ""}
          onChange={(e) => updateFilter("minSlots", Number(e.target.value))}
          className="p-2 border rounded-md w-20"
        />
      </div>

      {/* Dragon Resistance */}
      <div>
        <label className="block text-sm text-gray-700">Dragon Res ≥</label>
        <input
          type="number"
          min={0}
          value={filters.resistances?.dragon || ""}
          onChange={(e) =>
            updateFilter("resistances", { ...filters.resistances, dragon: Number(e.target.value) })
          }
          className="p-2 border rounded-md w-20"
        />
      </div>
    </div>
  );
}
