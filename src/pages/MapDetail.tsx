import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import type { MapData, Node } from "../types/MapV2";
import MapMarkers from "../components/MapMarkers";
import { useSingleDataFetch } from "../hooks/useDataFetch";
import { decodeName } from "../utils/urlSafe";
import { mapRawMapToMap } from "../utils/mapMaps";
import ContentWrapper from "../components/ContentWrapper";
import deepSearch from "../function/deepSearch";

type SelectedNode = {
  node: Node;
  areaName: string;
};

function getAllNodeTypes(map: MapData | null): string[] {
  if (!map) return [];

  return Array.from(
    new Set(
      map.areas.flatMap((area) => area.nodes.map((node) => node.nodeType))
    )
  ).sort();
}

function getMapImageUrl(mapName: string) {
  const cleanFileName = mapName.replaceAll(" ", "");
  const mapImageUrl = `/img/maps/Map-${cleanFileName}.png`;
  return mapImageUrl;
}

function NodeList({
  map,
  onSelectNode,
}: {
  map: MapData;
  onSelectNode: (selection: SelectedNode) => void;
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
                onClick={() =>
                  onSelectNode({ node: node, areaName: area.areaName })
                }
                className="cursor-pointer p-2 rounded hover:bg-gray-200 transition"
              >
                ▶ <strong>Node {node.nodeNumber}</strong> - {node.nodeType}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function NodeDetails({
  selected,
  onBack,
  rankFilter, // pass this down
}: {
  selected: { node: Node; areaName: string };
  onBack: () => void;
  rankFilter: string;
}) {
  const { node, areaName } = selected;

  const rankKeys = rankFilter
    ? [rankFilter]
    : [
        "low-rank",
        "high-rank",
        "g-rank",
        "training-school",
        "treasure-hunting",
      ];

  return (
    <div className="space-y-3">
      <button onClick={onBack}>← Back to all nodes</button>
      <h3>
        Node {node.nodeNumber} - {node.nodeType} (Area: {areaName})
      </h3>

      {rankKeys.map((rankKey) => {
        const data = node[rankKey as keyof Node] as any;
        if (!data?.items?.length) return null;
        return (
          <div key={rankKey}>
            <p className="font-medium">{rankKey}:</p>
            <ul className="ml-4 list-disc">
              {data.items.map((item: any) => (
                <li key={item.itemName}>{item.itemName}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function filterArea(
  map: MapData,
  searchValue: string,
  nodeTypeFilter: string,
  rankFilter: string
): MapData {
  return {
    ...map,
    areas: map.areas
      .map((area) => {
        const nodes = area.nodes
          .filter((node) => {
            const matchesSearch = deepSearch(node, searchValue);
            const typeMatch =
              !nodeTypeFilter || node.nodeType === nodeTypeFilter;
            return matchesSearch && typeMatch;
          })
          .map((node) => {
            if (rankFilter) {
              const newNode: Node = { ...node };
              if (rankFilter === "low-rank") {
                newNode["high-rank"] = null;
                newNode["g-rank"] = null;
                newNode["training-school"] = null;
                newNode["treasure-hunting"] = null;
              } else if (rankFilter === "high-rank") {
                newNode["low-rank"] = null;
                newNode["g-rank"] = null;
                newNode["training-school"] = null;
                newNode["treasure-hunting"] = null;
              } else if (rankFilter === "g-rank") {
                newNode["low-rank"] = null;
                newNode["high-rank"] = null;
                newNode["training-school"] = null;
                newNode["treasure-hunting"] = null;
              } else if (rankFilter === "training-school") {
                newNode["low-rank"] = null;
                newNode["g-rank"] = null;
                newNode["high-rank"] = null;
                newNode["treasure-hunting"] = null;
              } else if (rankFilter === "treasure-hunting") {
                newNode["low-rank"] = null;
                newNode["high-rank"] = null;
                newNode["g-rank"] = null;
                newNode["training-school"] = null;
              }

              return newNode;
            }

            return node;
          });

        return { ...area, nodes };
      })
      .filter((area) => area.nodes.length > 0),
  };
}

export default function MapDetail() {
  const mapName = decodeName(useParams<{ mapName: string }>().mapName ?? "");
  const [search, setSearch] = useState("");
  const [nodeTypeFilter, setNodeTypeFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);

  // console.log("selectedNode", selectedNode);

  const mapMapper = useCallback(
    (rawData: any[]) => rawData.map(mapRawMapToMap),
    []
  );

  const { data: map, loading } = useSingleDataFetch<MapData>(
    "/data/map-pins.json",
    mapName,
    {
      mapper: mapMapper,
    }
  );

  const nodeTypes = getAllNodeTypes(map);
  const mapImageUrl = getMapImageUrl(mapName);
  console.log("mapImageUrl", mapImageUrl);

  const filterMap: MapData = useMemo(() => {
    const EMPTY_MAP: MapData = {
      identifier: "",
      mapName: "",
      areas: [],
    };

    if (!map) return EMPTY_MAP;
    return filterArea(map, search, nodeTypeFilter, rankFilter);
  }, [map, search, nodeTypeFilter, rankFilter]);

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }

  if (!map) {
    return <div className="p-4">Map not found</div>;
  }

  return (
    <ContentWrapper>
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
              <MapMarkers map={filterMap} onSelectNode={setSelectedNode} />
            </MapContainer>
          </div>

          {/* SIDEBAR */}
          <div className="w-72 bg-gray-100 rounded-lg p-4 shadow max-h-[750px] overflow-y-auto">
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
            {selectedNode ? (
              <NodeDetails
                selected={selectedNode}
                onBack={() => setSelectedNode(null)}
                rankFilter={rankFilter}
              />
            ) : (
              <NodeList
                map={filterMap}
                onSelectNode={(selection) => setSelectedNode(selection)}
              />
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
