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

import type { MapData, MapsFile } from "../types/MapV2";
import { useParams } from "react-router-dom";

import MapMarkers from "../components/MapMarkers";

function ClickMarker() {
  const [pos, setPos] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      const pin = `{"x": ${e.latlng.lng}, "y": ${e.latlng.lat}, "label": ""},`;
      navigator.clipboard.writeText(pin);
      alert("Pin copied to clipboard!");
      setPos(e.latlng);
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

export default function MapDetail() {
  const { mapName } = useParams<{ mapName: string }>();
  const [maps, setMaps] = useState<MapsFile>([]);
  const [selectedNode, setSelectedNode] = useState<any | null>(null); // node clicked

  const decodedMapName = decodeURIComponent(mapName ?? "").replaceAll(" ", "");
  // console.log(mapName + " vs " + decodedMapName);
  const mapImageUrl = `/img/maps/Map-${decodedMapName}.png`;

  const selectedMap = maps.find((m) => m.mapName === mapName);

  useEffect(() => {
    fetch("/data/map-pins.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch map.json");
        return res.json();
      })
      .then((data: unknown) => {
        if (!Array.isArray(data)) {
          console.error("map.json is not an array");
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

  return (
    <div className="flex gap-4 p-4">
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

          <ClickMarker />
          <MapMarkers map={selectedMap} onSelectNode={setSelectedNode} />
        </MapContainer>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-gray-100 rounded-lg p-4 shadow overflow-y-auto max-h-[750px]">
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
                <li key={node.nodeNumber} className="mb-1">
                  <strong>Node {node.nodeNumber}</strong> - {node.nodeType}
                  {/* Ranks */}
                  {[
                    "low-rank",
                    "high-rank",
                    "g-rank",
                    "training-school",
                    "treasure-hunting",
                  ].map((rank) => {
                    const rankData = (node as any)[rank];
                    if (!rankData?.items?.length) return null;

                    return (
                      <div key={rank} className="ml-4 mt-1">
                        <em className="text-gray-500">{rank}</em>
                        <ul className="list-disc list-inside text-gray-700 text-sm">
                          {rankData.items.map((item: any, idx: number) => (
                            <li key={idx}>
                              {item.itemName}
                              {"points" in item ? ` - ${item.points} pts` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Sidebar 2 - selected node */}
      <div className="w-64 bg-gray-100 rounded-lg p-4 shadow overflow-y-auto max-h-[750px]">
        <h2 className="text-xl font-bold mb-2">Selected Node</h2>

        {selectedNode ? (
          <div>
            <p>
              <strong>Node {selectedNode.nodeNumber}</strong> -{" "}
              {selectedNode.nodeType}
            </p>

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
                        {"points" in item ? `- ${item.points} pts` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">Click a node to see details</p>
        )}
      </div>
    </div>
  );
}
