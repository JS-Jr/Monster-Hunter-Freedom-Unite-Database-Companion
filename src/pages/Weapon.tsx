import { useEffect, useState } from "react";
import type { Weapon } from "../types/Weapon";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";

export default function Weapons() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/data/weapons.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weapons.json");
        return res.json();
      })
      .then((data: any[]) => {
        console.log("Loaded weapons entries count:", data.length);

        // ✅ Clean & validate the weapon data
        const cleaned = data
          .filter((w) => w && typeof w.name === "string")
          .map((w) => ({
            ...w,
            elements: Array.isArray(w.elements) ? w.elements : [],
            create_mats: Array.isArray(w.create_mats) ? w.create_mats : [],
            improve_mats: Array.isArray(w.improve_mats) ? w.improve_mats : [],
          }));

        const invalid = data.filter(
          (w: any) => !w || typeof w.name !== "string"
        );
        if (invalid.length) {
          console.warn("⚠️ Some invalid weapon entries:", invalid);
        }

        setWeapons(cleaned);
      })
      .catch((err) => console.error("Error loading weapons:", err));
  }, []);

  // ✅ Compute unique weapon types safely
  const types = Array.from(new Set(weapons.map((w) => w.type))).filter(
    Boolean
  ) as string[];

  // ✅ Search & filter logic
  const filtered = weapons.filter((w) => {
    const matchName = w.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = filter ? w.type === filter : true;
    return matchName && matchType;
  });

  // ✅ Define columns for DataTable
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Attack", accessor: "attack" },
    { header: "Affinity", accessor: "affinity" },
    { header: "Rarity", accessor: "rarity" },
    {
      header: "Elements",
      accessor: "elements",
      render: (value: Weapon["elements"]) =>
        value?.map((e) => `${e.name} ${e.attack}`).join(", ") || "—",
    },
  ];

  return (
    <div>
      <h1>Weapons</h1>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={types}
      />

      <DataTable data={filtered} />
    </div>
  );
}
