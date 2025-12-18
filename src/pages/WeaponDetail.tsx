import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Weapon } from "../types/Weapon";

export default function WeaponDetail() {
  const { weaponName } = useParams<{ weaponName: string }>();
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("WeaponName:" + weaponName);

  useEffect(() => {
    if (!weaponName) {
      console.warn("No weaponName provided in URL.");
      setWeapon(null);
      setLoading(false);
      return;
    }

    const fetchWeapons = async () => {
      try {
        const res = await fetch("/data/weapons.json");
        const data: Weapon[] = await res.json();

        if (!Array.isArray(data)) {
          console.error("Weapons data is not an array!", data);
          setWeapon(null);
          setLoading(false);
          return;
        }

        // Normalize weaponName from URL
        const decodedName = decodeURIComponent(weaponName)
          .replace(/\+/g, " ")
          .trim()
          .toLowerCase();

        console.log("Decoded weaponName:", decodedName);
        console.log(
          "Character codes:",
          [...decodedName].map((c) => c.charCodeAt(0))
        );

        // Find the matching weapon
        const found = data.find((w) => {
          if (!w.name) return false;
          const weaponNameNormalized = w.name.trim().toLowerCase();
          const isMatch = weaponNameNormalized === decodedName;
          console.log(
            `Comparing "${decodedName}" with "${weaponNameNormalized}" => ${isMatch}`
          );
          return isMatch;
        });

        if (found) {
          console.log("Weapon found:", found);
        } else {
          console.warn("Weapon not found for:", decodedName);
        }

        setWeapon(found || null);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch weapons.json", err);
        setWeapon(null);
        setLoading(false);
      }
    };

    fetchWeapons();
  }, [weaponName]);

  if (loading)
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] flex items-center justify-center">
        Loading weapon...
      </div>
    );

  if (!weapon)
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] flex flex-col items-center justify-center">
        <p className="mb-4">Weapon not found.</p>
        <Link to="/weapons" className="underline">
          Back to Weapons
        </Link>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-2">{weapon.name}</h1>
        <p className="text-lg text-[#6B3E1B] capitalize">
          {weapon.type} • Rarity {weapon.rarity ?? "—"}
        </p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Attack" value={weapon.attack} />
          <Stat label="Affinity" value={weapon.affinity} />
          <Stat label="Slots" value={weapon.slots} />
          <Stat label="Bonus" value={weapon.bonus} />
        </div>

        {/* Elements */}
        {weapon.elements && weapon.elements.length > 0 && (
          <Section title="Elements">
            <ul className="list-disc list-inside">
              {weapon.elements.map((el, idx) => (
                <li key={idx}>
                  {el.name} +{el.attack}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Sharpness */}
        {weapon.sharpness && (
          <Section title="Sharpness">
            <p className="font-mono">{weapon.sharpness.join(" | ")}</p>
          </Section>
        )}

        {weapon.sharpness_plus && (
          <Section title="Sharpness +1">
            <p className="font-mono">{weapon.sharpness_plus.join(" | ")}</p>
          </Section>
        )}

        {/* Crafting */}
        {weapon.create_mats && (
          <Section title="Crafting Materials">
            <MaterialList mats={weapon.create_mats} />
          </Section>
        )}

        {/* Upgrading */}
        {(weapon.improve_mats || weapon.improve_from || weapon.improve_to) && (
          <Section title="Upgrades">
            {/* Upgrade FROM */}
            {weapon.improve_from && (
              <p className="mb-2">
                <strong>Upgrades from:</strong>{" "}
                <Link
                  to={`/weapons/${encodeURIComponent(weapon.improve_from)}`}
                  className="text-[#6B3E1B] font-semibold hover:underline"
                >
                  {weapon.improve_from}
                </Link>
              </p>
            )}

            {/* Upgrade TO */}
            {weapon.improve_to && weapon.improve_to.length > 0 && (
              <div className="mb-2">
                <strong>Upgrades to:</strong>
                <ul className="list-disc list-inside mt-1">
                  {weapon.improve_to.map((name) => (
                    <li key={name}>
                      <Link
                        to={`/weapons/${encodeURIComponent(name)}`}
                        className="text-[#6B3E1B] font-semibold hover:underline"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upgrade Materials */}
            {weapon.improve_mats && (
              <div className="mt-4">
                <strong>Upgrade Materials:</strong>
                <ul className="list-disc list-inside mt-1">
                  {weapon.improve_mats.map((mat, idx) => (
                    <li key={idx}>
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
          </Section>
        )}
      </div>
    </div>
  );
}

/* ---------------- Small Components ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <div className="bg-[#F7E7D0] p-4 rounded-lg shadow">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: any }) {
  return (
    <div className="bg-[#F7E7D0] rounded-lg p-4 shadow text-center">
      <p className="text-sm uppercase tracking-wide text-gray-600">{label}</p>
      <p className="text-xl font-bold">{value ?? "—"}</p>
    </div>
  );
}

function MaterialList({ mats }: { mats: any[] }) {
  return (
    <ul className="list-disc list-inside">
      {mats.map((mat, idx) => (
        <li key={idx}>
          <Link
            to={`/item/${encodeURIComponent(mat.name)}`}
            className="text-[#5A3F28] hover:underline"
          >
            {mat.name} x{mat.amount}
          </Link>
        </li>
      ))}
    </ul>
  );
}
