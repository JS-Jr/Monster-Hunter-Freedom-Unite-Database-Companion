import { Link, useParams } from "react-router-dom";
import { DetailEmptyState } from "../components/DetailEmptyState";
import { useSingleDataFetch } from "../hooks/useDataFetch";
import { decodeName, encodeName } from "../utils/urlSafe";
import type { Decoration } from "../types/Decoration";

export default function DecorationDetail() {
  const decorationName = decodeName(
    useParams<{ decorationName: string }>().decorationName ?? ""
  );
  console.log("decorationName", decorationName);

  const { data: decoration, loading } = useSingleDataFetch<Decoration>(
    "/data/decoration-modified.json",
    decorationName
  );

  // console.log("weaponName", weaponName);

  if (loading) return <>Hello</>;

  if (!decoration)
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] flex flex-col items-center justify-center">
        <DetailEmptyState
          message="Decoration not found"
          entityName="Decoration"
          returnPath="/decorations"
        />
      </div>
    );

  return (
    <div className="min-h-screen w-full px-4 py-10 bg-[#E9D3B4]">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center tracking-wide text-[#6B3E1B]">
          {decoration.name}
        </h1>
        <p className="text-center text-lg mt-1 text-[#5A3F28]">
          {decoration.skill_group}
        </p>

        <div className="mx-auto my-6 h-px w-2/3 bg-[#CBA986]" />

        {/* Main Info */}
        <div className="rounded-lg p-6 shadow bg-[#F7E7D0]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <InfoCard label="Slots" value={decoration.slots} />
            <InfoCard label="Rarity" value={decoration.rarity} />
            <InfoCard label="Cost" value={decoration.cost} />
            <InfoCard label="Skills" value={decoration.skills.join(", ")} />
          </div>
        </div>

        {/* Materials */}
        {decoration.materials.length > 0 && (
          <section className="mt-12 rounded-lg p-6 shadow bg-[#F7E7D0]">
            <h2 className="text-2xl font-semibold mb-4 text-[#6B3E1B]">
              Materials
            </h2>
            <ul className="list-disc list-inside text-[#5A3F28]">
              {decoration.materials.map((mat, idx) => (
                <li key={idx}>
                  <Link
                    to={`/item/${encodeName(mat.item)}`}
                    className="font-semibold text-[#5A3F28] hover:underline"
                  >
                    {mat.item}
                  </Link>{" "}
                  x {mat.qty}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Alternative Materials */}
        {decoration.alt_materials.length > 0 && (
          <section className="mt-12 rounded-lg p-6 shadow bg-[#F7E7D0]">
            <h2 className="text-2xl font-semibold mb-4 text-[#6B3E1B]">
              Alternative Materials
            </h2>
            <ul className="list-disc list-inside text-[#5A3F28]">
              {decoration.alt_materials.map((mat, idx) => (
                <li key={idx}>
                  <Link
                    to={`/item/${encodeName(mat.item)}`}
                    className="font-semibold text-[#5A3F28] hover:underline"
                  >
                    {mat.item}
                  </Link>{" "}
                  x {mat.qty}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/* Small helper component to keep styling consistent */
function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded p-4 shadow-sm bg-[#E9D3B4]">
      <p className="font-semibold text-[#6B3E1B]">{label}</p>
      <p className="text-[#5A3F28]">{value}</p>
    </div>
  );
}
