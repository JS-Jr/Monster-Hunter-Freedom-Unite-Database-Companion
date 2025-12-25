import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import type { MapData } from "../types/MapV2";
import MapMarkers from "../components/MapMarkers";
import { useDataFetchArray } from "../hooks/useDataFetch";

/* -----------------------------
   MAIN PAGE
------------------------------ */

export default function MapDetail() {
  const { mapName } = useParams<{ mapName: string }>();

  // 🔹 All hooks at the top
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [nodeTypeFilter, setNodeTypeFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");

  const { data: maps, loading } = useDataFetchArray<MapData>(
    "/data/map-pins.json"
  );

  const selectedMap = maps?.find((m) => m.mapName === mapName) ?? null;

  // 🔹 Filtered map
  const filteredMap = useMemo(() => {
    if (!selectedMap) return { areas: [] } as MapData;

    return {
      ...selectedMap,
      areas: selectedMap.areas
        .map((area) => {
          const nodes = area.nodes.filter((node) => {
            const matchesSearch = nodeMatchesSearch(node, search);
            const typeMatch =
              !nodeTypeFilter || node.nodeType === nodeTypeFilter;
            const rankFilterMatch = nodeHasRank(node, rankFilter);

            return matchesSearch && typeMatch && rankFilterMatch;
          });

          return { ...area, nodes };
        })
        .filter((area) => area.nodes.length > 0),
    };
  }, [selectedMap, search, nodeTypeFilter, rankFilter]);

  const nodeTypes = Array.from(
    new Set(
      selectedMap?.areas.flatMap((area) =>
        area.nodes.map((node) => node.nodeType)
      ) ?? []
    )
  ).sort();

  const decodedMapName = decodeURIComponent(mapName ?? "").replaceAll(" ", "");
  const mapImageUrl = `/img/maps/Map-${decodedMapName}.png`;

  // 🔹 Render UI conditionally, not hooks
  if (loading) return <div className="p-4">Loading…</div>;
  if (!maps || maps.length === 0) return <div className="p-4">Empty Map</div>;
  if (!selectedMap) return <div className="p-4">Map not found</div>;

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

            {/* 🔥 FILTERED MARKERS */}
            <MapMarkers map={filteredMap} onSelectNode={setSelectedNode} />
          </MapContainer>
        </div>

        {/* SIDEBAR */}
        <div className="w-72 bg-gray-100 rounded-lg p-4 shadow max-h-[750px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-3">{selectedMap.mapName}</h2>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search nodes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-3 px-2 py-1 border rounded"
          />

          {/* FILTERS */}
          <div className="flex gap-2 mb-4">
            <select
              value={nodeTypeFilter}
              onChange={(e) => setNodeTypeFilter(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
            >
              <option value="">All Types</option>
              {nodeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
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
              <option value="training-school">Training School</option>
              <option value="treasure-hunting">Treasure Hunting</option>
            </select>
          </div>

          {/* 🔥 FILTERED LIST */}
          <NodeList map={filteredMap} onSelectNode={setSelectedNode} />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   NODE LIST
------------------------------ */

function NodeList({
  map,
  onSelectNode,
}: {
  map: MapData;
  onSelectNode: (node: any) => void;
}) {
  return (
    <ul className="space-y-4">
      {map.areas.map((area) => (
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
  );
}

/* -----------------------------
   HELPERS
------------------------------ */

function nodeHasRank(node: any, rank: string) {
  if (!rank) return true;
  const data = node[rank];
  return data?.items?.length > 0;
}

function nodeMatchesSearch(node: any, search: string): boolean {
  if (!search) return true;
  const lowerSearch = search.toLowerCase();

  function searchObject(obj: any): boolean {
    if (!obj) return false;
    if (typeof obj === "string") return obj.toLowerCase().includes(lowerSearch);
    if (typeof obj === "number") return obj.toString().includes(lowerSearch);
    if (Array.isArray(obj)) return obj.some(searchObject);
    if (typeof obj === "object") return Object.values(obj).some(searchObject);
    return false;
  }

  return searchObject(node);
}
