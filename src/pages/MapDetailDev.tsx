import {
  MapContainer,
  ImageOverlay,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L, { LatLng } from "leaflet";
import { useEffect, useState } from "react";

import type { MapData, MapsFile, Pin, Node } from "../types/MapV2";
import { useParams } from "react-router-dom";

import MapMarkers from "../components/MapMarkers";

/* =======================
   Click-to-create pin
   ======================= */
function ClickMarker({ onCreatePin }: { onCreatePin: (pin: Pin) => void }) {
  const [pos, setPos] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      const pin: Pin = {
        x: Math.round(e.latlng.lng),
        y: Math.round(e.latlng.lat),
        label: "",
      };

      setPos(e.latlng);
      onCreatePin(pin);
    },
  });

  return pos ? (
    <Marker position={pos}>
      <Popup>
        X: {pos.lng.toFixed(0)}, Y: {pos.lat.toFixed(0)}
      </Popup>
    </Marker>
  ) : null;
}

/* =======================
   Main component
   ======================= */
export default function MapDetailDev() {
  const { mapName } = useParams<{ mapName: string }>();

  const [maps, setMaps] = useState<MapsFile>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [pendingPin, setPendingPin] = useState<Pin | null>(null);

  const decodedMapName = decodeURIComponent(mapName ?? "").replaceAll(" ", "");
  const mapImageUrl = `/img/maps/Map-${decodedMapName}.png`;

  const selectedMap = maps.find((m) => m.mapName === mapName);

  /* =======================
     Load maps JSON
     ======================= */
  useEffect(() => {
    fetch("/data/map-pins.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch map-pins.json");
        return res.json();
      })
      .then((data: unknown) => {
        if (!Array.isArray(data)) {
          console.error("map-pins.json is not an array");
          return;
        }

        const cleaned: MapsFile = data
          .filter(
            (m): m is MapData =>
              m && typeof m.mapName === "string" && Array.isArray(m.areas)
          )
          .map((m) => ({
            ...m,
            areas: Array.isArray(m.areas) ? m.areas : [],
          }));

        setMaps(cleaned);
      })
      .catch((err) => console.error("Error loading maps:", err));
  }, []);

  /* =======================
     Attach pin to node
     ======================= */
  function attachPinToSelectedNode() {
    if (!pendingPin || !selectedNode || !selectedMap) return;

    setMaps((prev) =>
      prev.map((map) => {
        if (map.mapName !== selectedMap.mapName) return map;

        return {
          ...map,
          areas: map.areas.map((area) => ({
            ...area,
            nodes: area.nodes.map((node) =>
              node.nodeNumber === selectedNode.nodeNumber
                ? { ...node, pin: pendingPin }
                : node
            ),
          })),
        };
      })
    );

    setPendingPin(null);
  }

  /* =======================
     Export JSON
     ======================= */
  function exportCurrentMap() {
    if (!selectedMap) return;

    const blob = new Blob([JSON.stringify(selectedMap, null, 2)], {
      type: "application/json",
    });

    const safeName = selectedMap.mapName.replace(/\s+/g, "_").toLowerCase();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `map-${safeName}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /* =======================
     Render
     ======================= */
  return (
    <div className="flex gap-4 p-4">
      {/* ================= Map ================= */}
      <div className="rounded-lg overflow-hidden shadow">
        <MapContainer
          crs={L.CRS.Simple}
          bounds={[
            [0, 0],
            [1000, 1000],
          ]}
          maxBounds={[
            [0, 0],
            [1000, 1000],
          ]}
          attributionControl={false}
          className="h-[750px] w-[750px]"
          maxBoundsViscosity={1.0}
        >
          <ImageOverlay
            url={mapImageUrl}
            bounds={[
              [0, 0],
              [1000, 1000],
            ]}
          />

          <ClickMarker onCreatePin={setPendingPin} />

          <MapMarkers map={selectedMap} onSelectNode={setSelectedNode} />
        </MapContainer>
      </div>

      {/* ================= Sidebar: Map Data ================= */}
      <div className="w-64 bg-gray-100 rounded-lg p-4 shadow overflow-y-auto max-h-[750px]">
        <button
          onClick={exportCurrentMap}
          disabled={!selectedMap}
          className="mb-3 w-full px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Export Current Map
        </button>

        <h2 className="text-xl font-bold mb-2">
          {selectedMap?.mapName || "Loading map..."}
        </h2>

        {selectedMap?.areas.map((area) => (
          <div key={area.areaName} className="mb-4">
            <h3 className="font-semibold">
              {area.areaName}{" "}
              {area.areaNumber !== null && `(Area ${area.areaNumber})`}
            </h3>

            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {area.nodes.map((node) => (
                <li
                  key={node.nodeNumber}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(node)}
                >
                  <strong>Node {node.nodeNumber}</strong> – {node.nodeType}
                  {node.pin && <span className="ml-1 text-green-600">📍</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ================= Sidebar: Selected Node ================= */}
      <div className="w-64 bg-gray-100 rounded-lg p-4 shadow overflow-y-auto max-h-[750px]">
        <h2 className="text-xl font-bold mb-2">Selected Node</h2>

        {selectedNode ? (
          <>
            <p>
              <strong>Node {selectedNode.nodeNumber}</strong> –{" "}
              {selectedNode.nodeType}
            </p>

            {selectedNode.pin && (
              <p className="text-sm text-gray-600 mt-1">
                Pin: X {selectedNode.pin.x}, Y {selectedNode.pin.y}
              </p>
            )}

            {pendingPin && (
              <button
                onClick={attachPinToSelectedNode}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Attach Pin to Node
              </button>
            )}

            {[
              "low-rank",
              "high-rank",
              "g-rank",
              "training-school",
              "treasure-hunting",
            ].map((rank) => {
              const rankData = (selectedNode as any)[rank];
              if (!rankData?.items?.length) return null;

              return (
                <div key={rank} className="ml-2 mt-2">
                  <em className="text-gray-500">{rank}</em>
                  <ul className="list-disc list-inside text-gray-700 text-sm">
                    {rankData.items.map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.itemName}{" "}
                        {"points" in item && `- ${item.points} pts`}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </>
        ) : (
          <p className="text-gray-500">Click a node to see details</p>
        )}
      </div>
    </div>
  );
}
