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
function ClickMarker({
  onCreatePin,
  enabled,
}: {
  onCreatePin: (pin: Pin) => void;
  enabled: boolean;
}) {
  const [pos, setPos] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      if (!enabled) return;

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
  const [pendingPin, setPendingPin] = useState<Pin | null>(null);

  /**
   * IMPORTANT:
   * Selected node is now scoped by AREA
   */
  const [selectedNode, setSelectedNode] = useState<{
    areaIndex: number;
    node: Node;
  } | null>(null);

  const decodedMapName = decodeURIComponent(mapName ?? "").replaceAll(" ", "");
  const mapImageUrl = `/img/maps/Map-${decodedMapName}.png`;

  const selectedMap = maps.find((m) => m.mapName === mapName);

  /* =======================
     Derived state
     ======================= */
  const selectedArea =
    selectedMap && selectedNode
      ? selectedMap.areas[selectedNode.areaIndex]
      : null;

  const areaPinCount = selectedArea?.nodes.filter((n) => n.pin).length ?? 0;

  const areaMaxPins = selectedArea?.nodes.length ?? 0;

  const canAddPin =
    !!selectedNode &&
    !!selectedArea &&
    areaPinCount < areaMaxPins &&
    !selectedNode.node.pin;

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
            areas: m.areas ?? [],
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
    if (!canAddPin) return;

    setMaps((prev) =>
      prev.map((map) => {
        if (map.mapName !== selectedMap.mapName) return map;

        return {
          ...map,
          areas: map.areas.map((area, areaIndex) => {
            if (areaIndex !== selectedNode.areaIndex) return area;

            return {
              ...area,
              nodes: area.nodes.map((node) =>
                node.nodeNumber === selectedNode.node.nodeNumber
                  ? { ...node, pin: pendingPin }
                  : node
              ),
            };
          }),
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

          <ClickMarker
            enabled={canAddPin}
            onCreatePin={(pin) => {
              if (!selectedNode) {
                alert("Select a node first.");
                return;
              }

              if (!canAddPin) {
                alert("This area already has the maximum number of pins.");
                return;
              }

              setPendingPin(pin);
            }}
          />

          <MapMarkers
            map={selectedMap}
            // onSelectNode={(areaIndex, node) =>
            //   setSelectedNode({ areaIndex, node })
            // }
          />
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

        {selectedMap?.areas.map((area, areaIndex) => {
          const pins = area.nodes.filter((n) => n.pin).length;

          return (
            <div key={area.areaName} className="mb-4">
              <h3 className="font-semibold">
                {area.areaName}{" "}
                {area.areaNumber !== null && `(Area ${area.areaNumber})`}{" "}
                <span className="text-sm text-gray-500">
                  ({pins}/{area.nodes.length})
                </span>
              </h3>

              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {area.nodes.map((node) => (
                  <li
                    key={`${areaIndex}-${node.nodeNumber}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode({ areaIndex, node })}
                  >
                    <strong>Node {node.nodeNumber}</strong> – {node.nodeType}
                    {node.pin && (
                      <span className="ml-1 text-green-600">📍</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ================= Sidebar: Selected Node ================= */}
      <div className="w-64 bg-gray-100 rounded-lg p-4 shadow overflow-y-auto max-h-[750px]">
        <h2 className="text-xl font-bold mb-2">Selected Node</h2>

        {selectedNode ? (
          <>
            <p>
              <strong>Node {selectedNode.node.nodeNumber}</strong> –{" "}
              {selectedNode.node.nodeType}
            </p>

            {selectedArea && (
              <p className="text-sm text-gray-600 mt-1">
                Area pins: {areaPinCount}/{areaMaxPins}
              </p>
            )}

            {selectedNode.node.pin && (
              <p className="text-sm text-gray-600 mt-1">
                Pin: X {selectedNode.node.pin.x}, Y {selectedNode.node.pin.y}
              </p>
            )}

            {pendingPin && canAddPin && (
              <button
                onClick={attachPinToSelectedNode}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Attach Pin to Node
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">Click a node to see details</p>
        )}
      </div>
    </div>
  );
}
