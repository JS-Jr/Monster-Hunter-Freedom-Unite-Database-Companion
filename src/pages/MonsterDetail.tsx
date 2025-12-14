import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
          (m) => m.name.toLowerCase() === monsterName?.toLowerCase()
        );
        setMonster(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [monsterName]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading…
      </div>
    );

  if (!monster)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Monster not found.
      </div>
    );

  return (
    <div
      className="min-h-screen w-full px-4 py-10"
      style={{ backgroundColor: "#E9D3B4" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1
          className="text-4xl font-extrabold text-center tracking-wide"
          style={{ color: "#6B3E1B" }}
        >
          {monster.name}
        </h1>
        <p className="text-center text-lg mt-1" style={{ color: "#5A3F28" }}>
          {monster.type}
        </p>

        <div
          className="mx-auto my-6 h-px w-2/3"
          style={{ backgroundColor: "#CBA986" }}
        />

        {/* Image + Description */}
        <div className="mt-8 flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="flex-1 flex justify-center">
            {/* <img
              src={monster.image}
              alt={monster.name}
              className="w-full max-w-md rounded-xl shadow-lg border"
              style={{ borderColor: "#CBA986" }}
            /> */}
          </div>

          {/* Description */}
          <div
            className="flex-1 rounded-lg p-6 shadow"
            style={{ backgroundColor: "#F7E7D0" }}
          >
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ color: "#6B3E1B" }}
            >
              Description
            </h2>
            <p className="leading-relaxed text-[#5A3F28]">
              {monster.description}
            </p>

            {monster.habitats?.length > 0 && (
              <div className="mt-6">
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#6B3E1B" }}
                >
                  Habitats
                </h3>
                <ul className="list-disc list-inside text-[#5A3F28]">
                  {monster.habitats.map((habitat, idx) => (
                    <li key={idx}>{habitat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sizes */}
        {/* {monster.sizes && (
          <section
            className="mt-12 rounded-lg p-6 shadow"
            style={{ backgroundColor: "#F7E7D0" }}
          >
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: "#6B3E1B" }}
            >
              Sizes (cm)
            </h2>
            <p className="text-[#5A3F28]">
              Min: {monster.sizes.min.toFixed(2)} — Max:{" "}
              {monster.sizes.max.toFixed(2)}
            </p>
          </section>
        )} */}

        {/* Hitzones */}
        {monster.hitzones && (
          <section
            className="mt-12 rounded-lg p-6 shadow"
            style={{ backgroundColor: "#F7E7D0" }}
          >
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ color: "#6B3E1B" }}
            >
              Hitzones
            </h2>

            {Object.entries(monster.hitzones).map(([zone, stats]) => (
              <div key={zone} className="mb-6">
                <h3
                  className="text-xl font-semibold capitalize mb-2"
                  style={{ color: "#5A3F28" }}
                >
                  {zone}
                </h3>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.entries(stats).map(([attack, value]) => (
                    <div
                      key={attack}
                      className="rounded p-2 text-center shadow-sm"
                      style={{ backgroundColor: "#E9D3B4" }}
                    >
                      <p className="font-semibold capitalize text-[#6B3E1B]">
                        {attack}
                      </p>
                      <p className="text-[#5A3F28]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Drops */}
        {monster.drops && (
          <section
            className="mt-12 rounded-lg p-6 shadow"
            style={{ backgroundColor: "#F7E7D0" }}
          >
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ color: "#6B3E1B" }}
            >
              Drops
            </h2>

            {Object.entries(monster.drops).map(([rank, dropData]) => (
              <div key={rank} className="mb-6">
                <h3
                  className="text-xl font-semibold capitalize mb-2"
                  style={{ color: "#5A3F28" }}
                >
                  {rank}
                </h3>

                {Object.entries(dropData).map(([category, items]: any) => (
                  <div key={category} className="mb-2">
                    <h4 className="font-semibold capitalize text-[#6B3E1B]">
                      {category}
                    </h4>
                    <ul className="list-disc list-inside text-[#5A3F28]">
                      {items.map((item: any, idx: number) => (
                        <li key={idx}>
                          <Link
                            to={`/item/${encodeURIComponent(
                              item.name
                            )}`}
                            className="text-[#5A3F28] hover:underline"
                          >
                            {item.name} ({item.chance})
                          </Link>
                          
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
