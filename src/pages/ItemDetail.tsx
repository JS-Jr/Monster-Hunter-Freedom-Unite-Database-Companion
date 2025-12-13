import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Item } from "../types/Item";

export default function ItemDetail() {
  const { itemName } = useParams<{ itemName: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch("/data/item.json");
        const rawData: any[] = await response.json();

        const mappedData: Item[] = rawData.map((item) => ({
          type: item.itemType ?? "", // ensure string
          name: item.itemName ?? "",
          rarity: Number(item.rarity ?? 0), // ensure number
          bagCapacity: Number(item.bagCapacity ?? 0),
          sellValue: item.sellValue ?? "",
          howToGet: item.howToGet ?? "",
        }));
        const decodedName = decodeURIComponent(itemName ?? "");
        const found = mappedData.find(
          (i) => i.name.toLowerCase() === decodedName.toLowerCase()
        );

        setItem(found || null);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemName]);

  if (loading)
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] flex items-center justify-center">
        Loading item...
      </div>
    );

  if (!item)
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] flex flex-col items-center justify-center">
        <p className="mb-4">Item not found.</p>
        <Link to="/item" className="underline">
          Back to Items
        </Link>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-2">{item.name}</h1>
        <p className="text-lg text-[#6B3E1B] capitalize">
          {item.type} • Rarity {item.rarity}
        </p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Stat label="Bag Capacity" value={item.bagCapacity} />
          <Stat label="Sell Value" value={item.sellValue} />
        </div>

        {/* How to Get */}
        {item.howToGet && (
          <Section title="How to Get">
            <p>{item.howToGet}</p>
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
