// ItemDetail.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Item } from "../types/Item";

export default function ItemDetail() {
  const { itemName } = useParams<{ itemName: string }>();
  const [itemData, setItemData] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/data/item.json")
      .then((res) => res.json())
      .then((data: Item[]) => {
        const found = data.find(
          (w) => w.itemName.toLowerCase() === itemName?.toLowerCase()
        );

        let mappedData: Item | null = null;
        if (found) {
          mappedData = {
            type: found.itemType ?? "",
            name: found.itemName ?? "",
            rarity: Number(found.rarity ?? 0),
            bagCapacity: Number(found.bagCapacity ?? 0),
            sellValue: found.sellValue ?? "",
            howToGet: found.howToGet ?? "",
            image: found.image ?? "",
            description: found.description ?? "",
          };
        }

        setItemData(mappedData);
        found || null;

        setItemData(found || null);
        setLoading(false);
      })

      .catch((err) => console.error("Failed to load itemData:", err));
  }, [itemName]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!itemData) return <p className="text-center mt-10">Item not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center">{itemData.name}</h1>
      <p className="text-center text-lg text-gray-500">{itemData.type}</p>

      {/* Image */}
      {itemData.image && (
        <div className="mt-6 flex justify-center">
          <img
            src={itemData.image}
            alt={itemData.name}
            className="w-full max-w-sm rounded-xl shadow-lg border"
          />
        </div>
      )}

      {/* Basic Info */}
      <div className="mt-10 space-y-4">
        <p>
          <strong>Rarity:</strong> {itemData.rarity}
        </p>
        <p>
          <strong>Bag Capacity:</strong> {itemData.bagCapacity}
        </p>
        <p>
          <strong>Sell Value:</strong> {itemData.sellValue}
        </p>
        <p>
          <strong>How to Get:</strong> {itemData.howToGet}
        </p>
      </div>

      {/* Description */}
      {/* {itemData.description && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">{itemData.description}</p>
        </div>
      )} */}
    </div>
  );
}
