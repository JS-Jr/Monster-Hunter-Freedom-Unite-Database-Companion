import { useState, useEffect } from "react";
import ArmorTable from "../components/ArmorTable";
import type { Armor } from "../types/Armor";
import { mapRawArmorToArmor } from "../utils/mapArmor";

export default function Armor() {
  const [armorData, setArmorData] = useState<Armor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/armor.json")
      .then((response) => response.json())
      .then((rawData) => {
        const mappedData = rawData.map((item: any) => mapRawArmorToArmor(item));
        setArmorData(mappedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load armor data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading armor data...</div>;

  // return <div className="text-red-500 text-5xl font-bold">HELLO TAILWIND</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Armor List</h1>
      <ArmorTable data={armorData} />
    </div>
  );
}
