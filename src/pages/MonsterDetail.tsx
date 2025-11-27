import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Monster } from "../types/Monster";

export default function MonsterDetail() {
  const { monsterName } = useParams<{ monsterName: string }>();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/data/monster.json")
      .then((res) => res.json())
      .then((data: Monster[]) => {
        const found = data.find(
          (w) => w.name.toLowerCase() === monsterName?.toLowerCase()
        );
        setMonster(found || null);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to load monster:", err));
  }, [monsterName]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!monster) return <p className="text-center mt-10">Monster not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center">{monster.name}</h1>
      <p className="text-center text-lg text-gray-500">{monster.type}</p>

      {/* Image + Description */}
      <div className="mt-10 flex flex-col md:flex-row gap-8 items-start">
        {/* Monster Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={monster.image}
            alt={monster.name}
            className="w-full max-w-md rounded-xl shadow-lg border"
          />
        </div>

        {/* Description + Habitats */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{monster.description}</p>

          {monster.habitats && monster.habitats.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Habitats</h3>
              <ul className="list-disc list-inside text-gray-700">
                {monster.habitats.map((habitat, idx) => (
                  <li key={idx}>{habitat}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sizes */}
      {monster.sizes && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Sizes (cm)</h2>
          <p>
            Min: {monster.sizes.min.toFixed(2)}, Max: {monster.sizes.max.toFixed(2)}
          </p>
        </div>
      )}

      {/* Hitzones */}
      {monster.hitzones && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Hitzones</h2>
          {Object.entries(monster.hitzones).map(([zone, stats]) => (
            <div key={zone} className="mb-4">
              <h3 className="text-xl font-semibold capitalize">{zone}</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {Object.entries(stats).map(([attack, value]) => (
                  <div
                    key={attack}
                    className="p-2 bg-gray-50 rounded shadow border text-center"
                  >
                    <p className="font-semibold capitalize">{attack}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drops */}
      {monster.drops && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Drops</h2>
          {Object.entries(monster.drops).map(([rank, dropData]) => (
            <div key={rank} className="mb-6">
              <h3 className="text-xl font-semibold capitalize">{rank}</h3>
              {Object.entries(dropData).map(([category, items]: [string, any]) => (
                <div key={category} className="mt-2">
                  <h4 className="font-semibold capitalize">{category}</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {items.map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.name} ({item.chance})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
