import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Weapon } from "../types/Weapon";

export default function WeaponDetail() {
  const { weaponName } = useParams<{ weaponName: string }>();
  const [weapon, setWeapon] = useState<Weapon | null>(null);

  useEffect(() => {
    fetch("/data/weapons.json")
      .then((res) => res.json())
      .then((data: Weapon[]) => {
        const found = data.find(
          (w) => w.name.toLowerCase() === weaponName?.toLowerCase()
        );
        setWeapon(found || null);
      })
      .catch((err) => console.error("Failed to load weapons:", err));
  }, [name]);

  if (!weapon) return <p>Loading or weapon not found...</p>;

  return (
    <div>
      <h1>{weapon.name}</h1>
      <p>
        <strong>Type:</strong> {weapon.type}
      </p>
      <p>
        <strong>Attack:</strong> {weapon.attack}
      </p>
      <p>
        <strong>Affinity:</strong> {weapon.affinity}
      </p>
      <p>
        <strong>Rarity:</strong> {weapon.rarity}
      </p>

      <h3>Elements</h3>
      {weapon.elements?.length ? (
        <ul>
          {weapon.elements.map((el, i) => (
            <li key={i}>
              {el.name} {el.attack}
            </li>
          ))}
        </ul>
      ) : (
        <p>No elements</p>
      )}

      <h3>Create Materials</h3>
      {weapon.create_mats?.length ? (
        <ul>
          {weapon.create_mats.map((mat, i) => (
            <li key={i}>
              {mat.name} ×{mat.amount} ({mat.type})
            </li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
    </div>
  );
}
