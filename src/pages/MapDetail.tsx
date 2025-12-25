import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import type { MapData } from "../types/MapV2";
import MapMarkers from "../components/MapMarkers";
import { useDataFetchArray } from "../hooks/useDataFetch";

export default function MapDetail() {
  const { mapName } = useParams<{ mapName: string }>();
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const { data: maps, loading } = useDataFetchArray<MapData>(
    "/data/map-pins.json"
  );

  if (loading) return <div className="p-4">Loading…</div>;
  if (!maps || maps.length === 0) return <div className="p-4">Empty Map</div>;

  const selectedMap = maps.find((m) => m.mapName === mapName);
  if (!selectedMap) return <div className="p-4">Map not found</div>;

  const decodedMapName = decodeURIComponent(mapName ?? "").replaceAll(" ", "");
  const mapImageUrl = `/img/maps/Map-${decodedMapName}.png`;

  return (
    <div className="flex justify-center p-6">
      <div className="flex gap-6 max-w-[1200px] w-full">
        {/* MAP */}
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
            className="h-[750px] w-[750px]"
            attributionControl={false}
            maxBoundsViscosity={1.0}
          >
            <ImageOverlay
              url={mapImageUrl}
              bounds={[
                [0, 0],
                [1000, 1000],
              ]}
            />
            <MapMarkers map={selectedMap} onSelectNode={setSelectedNode} />
          </MapContainer>
        </div>

        {/* SIDEBAR */}
        <div className="w-72 bg-gray-100 rounded-lg p-4 shadow max-h-[750px] overflow-y-auto">
          {selectedNode ? (
            <NodeDetails
              node={selectedNode}
              onBack={() => setSelectedNode(null)}
            />
          ) : (
            <NodeList map={selectedMap} onSelectNode={setSelectedNode} />
          )}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Node List (default sidebar)
------------------------------ */

function NodeList({
  map,
  onSelectNode,
}: {
  map: MapData;
  onSelectNode: (node: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [nodeTypeFilter, setNodeTypeFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");

  const filteredAreas = useMemo(() => {
    return map.areas
      .map((area) => {
        const nodes = area.nodes.filter((node) => {
          const searchMatch =
            !search ||
            node.nodeType.toLowerCase().includes(search.toLowerCase()) ||
            node.nodeNumber.toString().includes(search);

          const typeMatch = !nodeTypeFilter || node.nodeType === nodeTypeFilter;

          const rankMatch = nodeHasRank(node, rankFilter);

          return searchMatch && typeMatch && rankMatch;
        });

        return { ...area, nodes };
      })
      .filter((area) => area.nodes.length > 0);
  }, [map.areas, search, nodeTypeFilter, rankFilter]);

  return (
    <>
      <h2 className="text-xl font-bold mb-3">{map.mapName}</h2>

      <input
        type="text"
        placeholder="Search nodes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 px-2 py-1 border rounded"
      />

      <div className="flex gap-2 mb-4">
        <select
          value={nodeTypeFilter}
          onChange={(e) => setNodeTypeFilter(e.target.value)}
          className="flex-1 border rounded px-2 py-1 text-sm"
        >
          <option value="">All Types</option>
          <option value="Mining">Mining</option>
          <option value="Fishing">Fishing</option>
        </select>

        <select
          value={rankFilter}
          onChange={(e) => setRankFilter(e.target.value)}
          className="flex-1 border rounded px-2 py-1 text-sm"
        >
          <option value="">All Ranks</option>
          <option value="low-rank">Low Rank</option>
          <option value="high-rank">High Rank</option>
          <option value="g-rank">G Rank</option>
        </select>
      </div>

      <ul className="space-y-4">
        {filteredAreas.map((area) => (
          <li key={area.areaName}>
            <p className="font-semibold text-gray-700 mb-2">{area.areaName}</p>

            <ul className="space-y-2 ml-3">
              {area.nodes.map((node) => (
                <li
                  key={`${area.areaName}-${node.nodeNumber}`}
                  onClick={() => onSelectNode(node)}
                  className="cursor-pointer p-2 rounded hover:bg-gray-200 transition"
                >
                  ▶ <strong>Node {node.nodeNumber}</strong> – {node.nodeType}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

/* -----------------------------
   Node Details (selected)
------------------------------ */

function NodeDetails({ node, onBack }: { node: any; onBack: () => void }) {
  return (
    <>
      <button onClick={onBack} className="text-sm text-blue-600 mb-3">
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-1">
        Node {node.nodeNumber} – {node.nodeType}
      </h2>

      {[
        "low-rank",
        "high-rank",
        "g-rank",
        "training-school",
        "treasure-hunting",
      ].map((rank) => {
        const rankData = node[rank];
        if (!rankData?.items?.length) return null;

        return (
          <div key={rank} className="mt-3">
            <div className="text-sm font-semibold text-gray-600">{rank}</div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {rankData.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.itemName}
                  {"points" in item && ` – ${item.points} pts`}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

function nodeHasRank(node: any, rank: string) {
  if (!rank) return true;
  const data = node[rank];
  return data?.items?.length > 0;
}
