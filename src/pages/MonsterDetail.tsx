import { Link, useParams } from "react-router-dom";
import type { Monster } from "../types/Monster";
import { useSingleDataFetch } from "../hooks/useDataFetch";
import { DetailSkeleton } from "../components/DetailSkeleton";
import { DetailEmptyState } from "../components/DetailEmptyState";
import { encodeName } from "../utils/urlSafe";

export default function MonsterDetail() {
  const { monsterName } = useParams<{ monsterName: string }>();

  const { data: monster, loading } = useSingleDataFetch<Monster>(
    "/data/monster.json",
    monsterName
  );

  if (loading)
    return (
      <div className="min-h-screen w-full px-4 py-10 bg-[#E9D3B4]">
        <DetailSkeleton />
      </div>
    );

  if (!monster)
    return (
      <div className="min-h-screen w-full px-4 py-10 bg-[#E9D3B4]">
        <DetailEmptyState message="Monster not found" entityName="Monster" />
      </div>
    );

  const WEAPON_TYPES = ["cut", "bash", "shot"] as const;
  const ELEMENT_TYPES = ["fir", "wtr", "thn", "ice", "drg"] as const;

  type WeaponType = (typeof WEAPON_TYPES)[number];
  type ElementType = (typeof ELEMENT_TYPES)[number];
  const getBestAverageType = <T extends readonly string[]>(
    hitzones: Record<string, HitzoneStats>,
    types: T
  ): T[number] | null => {
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    types.forEach((type) => {
      totals[type] = 0;
      counts[type] = 0;
    });

    Object.values(hitzones).forEach((stats) => {
      types.forEach((type) => {
        const value = Number(stats[type]);
        if (!Number.isNaN(value)) {
          totals[type] += value;
          counts[type] += 1;
        }
      });
    });

    let bestType: T[number] | null = null;
    let bestAvg = -Infinity;

    types.forEach((type) => {
      if (counts[type] === 0) return;

      const avg = totals[type] / counts[type];
      if (avg > bestAvg) {
        bestAvg = avg;
        bestType = type;
      }
    });

    return bestType;
  };
  const suggestedWeapon = monster.hitzones
    ? getBestAverageType(monster.hitzones, WEAPON_TYPES)
    : null;

  const suggestedElement = monster.hitzones
    ? getBestAverageType(monster.hitzones, ELEMENT_TYPES)
    : null;

  return (
    <div className="min-h-screen w-full px-4 py-10 bg-[#E9D3B4]">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center tracking-wide text-[#6B3E1B]">
          {monster.name}
        </h1>
        <p className="text-center text-lg mt-1 text-[#5A3F28]">
          {monster.type}
        </p>

        <div className="mx-auto my-6 h-px w-2/3 bg-[#CBA986]" />

        {/* Image + Description */}
        <div className="mt-8 flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="flex-1 flex justify-center">
            {/* <img
              src={monster.image}
              alt={monster.name}
              className="w-full max-w-md rounded-xl shadow-lg border border-[#CBA986]"
            /> */}
          </div>

          {/* Description */}
          <div className="flex-1 rounded-lg p-6 shadow bg-[#F7E7D0]">
            <h2 className="text-2xl font-semibold mb-3 text-[#6B3E1B]">
              Description
            </h2>
            <p className="leading-relaxed text-[#5A3F28]">
              {monster.description}
            </p>

            {monster.habitats?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-[#6B3E1B]">
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
          <section className="mt-12 rounded-lg p-6 shadow bg-[#F7E7D0]">
            <h2 className="text-2xl font-semibold mb-4 text-[#6B3E1B]">
              Hitzones
            </h2>

            {(suggestedWeapon || suggestedElement) && (
              <div className="mb-6 rounded-lg p-4 bg-[#E2C29B] shadow-inner">
                <h3 className="text-lg font-semibold text-[#6B3E1B] mb-3">
                  Suggested Damage Types
                </h3>

                <div className="flex flex-col gap-2 text-[#5A3F28] font-medium">
                  {suggestedWeapon && (
                    <p>
                      <span className="font-semibold text-[#6B3E1B]">
                        Suggested weapon damage:
                      </span>{" "}
                      {suggestedWeapon.toUpperCase()}
                    </p>
                  )}

                  {suggestedElement && (
                    <p>
                      <span className="font-semibold text-[#6B3E1B]">
                        Suggested elemental damage:
                      </span>{" "}
                      {suggestedElement.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {Object.entries(monster.hitzones).map(([zone, stats]) => (
              <div key={zone} className="mb-6">
                <h3 className="text-xl font-semibold capitalize mb-2 text-[#5A3F28]">
                  {zone}
                </h3>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.entries(stats).map(([attack, value]) => (
                    <div
                      key={attack}
                      className="rounded p-2 text-center shadow-sm bg-[#E9D3B4]"
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
          <section className="mt-12 rounded-lg p-6 shadow bg-[#F7E7D0]">
            <h2 className="text-2xl font-semibold mb-4 text-[#6B3E1B]">
              Drops
            </h2>

            {Object.entries(monster.drops).map(([rank, dropData]) => (
              <div key={rank} className="mb-6">
                <h3 className="text-xl font-semibold capitalize mb-2 text-[#5A3F28]">
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
                            to={`/item/${encodeName(item.name)}`}
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
