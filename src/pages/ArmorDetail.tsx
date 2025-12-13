import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Armor } from "../types/Armor";
import { mapRawArmorToArmor } from "../utils/mapArmor";

export default function ArmorDetail() {
  const { armorName } = useParams<{ armorName: string }>();
  const [armor, setArmor] = useState<Armor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch("/data/armor.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch armor.json");
        return res.json();
      })
      .then((rawData) => {
        // 🔑 map FIRST
        const mappedArmor = rawData.map((item: any) =>
          mapRawArmorToArmor(item)
        );

        // 🔑 then find by name
        const found = mappedArmor.find(
          (a: { name: string }) =>
            a.name.toLowerCase() ===
            decodeURIComponent(armorName ?? "").toLowerCase()
        );

        setArmor(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load armor:", err);
        setLoading(false);
      });
  }, [armorName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E9D3B4]">
        Loading armor…
      </div>
    );
  }

  if (!armor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E9D3B4]">
        Armor not found.
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 bg-[#E9D3B4] text-[#5A3F28]">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-[#6B3E1B]">
          {armor.name}
        </h1>
        <p className="text-center mt-1">
          {armor.type} • {armor.hunter_type}
        </p>

        <div className="my-6 h-px bg-[#CBA986]" />

        {/* Main Card */}
        <section className="bg-[#F7E7D0] rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <p>
              <strong>Rarity:</strong> {armor.rarity}
            </p>
            <p>
              <strong>Defense:</strong> {armor.defense}
            </p>
            <p>
              <strong>Slots:</strong> {armor.slots}
            </p>
            <p>
              <strong>Gender:</strong> {armor.gender}
            </p>
          </div>

          {/* Resistances */}
          {armor.resistances && (
            <div>
              <h2 className="font-semibold text-[#6B3E1B] mb-2">
                Elemental Resistances
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(armor.resistances).map(([el, val]) => (
                  <div
                    key={el}
                    className="bg-[#E9D3B4] rounded p-2 text-center"
                  >
                    <p className="capitalize font-semibold">{el}</p>
                    <p>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {armor.skills?.length > 0 && (
            <div>
              <h2 className="font-semibold text-[#6B3E1B] mb-2">Skills</h2>
              <ul className="list-disc list-inside">
                {armor.skills.map((skill, i) => (
                  <li key={i}>
                    {skill.name} +{skill.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Materials */}
          {armor.create_mats?.length > 0 && (
            <div>
              <h2 className="font-semibold text-[#6B3E1B] mb-2">
                Crafting Materials
              </h2>
              <ul className="list-disc list-inside">
                {armor.create_mats.map((mat, i) => (
                  <li key={i}>
                    <Link
                      to={`/item/${encodeURIComponent(mat.name)}`}
                      className="text-[#5A3F28] hover:underline"
                    >
                      {mat.name} x{mat.amount}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cost */}
          {typeof armor.create_cost === "number" && (
            <p className="italic text-sm">
              Creation cost: {armor.create_cost} z
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
