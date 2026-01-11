import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useCallback, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { MapData, Node } from "../types/MapV2";
import MapMarkers from "../components/MapMarkers";
import { useSingleDataFetch } from "../hooks/useDataFetch";
import { decodeName, encodeName } from "../utils/urlSafe";
import { mapRawMapToMap } from "../utils/mapMaps";
import ContentWrapper from "../components/ContentWrapper";
import deepSearch from "../function/deepSearch";
import { DetailEmptyState } from "../components/DetailEmptyState";
import { MapDetailSkeleton } from "../components/skeletal/MapDetailSkeleton";

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
  // if (cleanFileName.toLowerCase().includes("Tower")) {
  //   return getTowerMapImageUrl(mapName);
  // }
  const mapImageUrl = `/img/maps/Map-${cleanFileName}.png`;
  return mapImageUrl;
}

// function getTowerMapImageUrl(mapName: String) {
//   return null;
// }

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
          <p className="font-semibold text-[#6B3E1B] mb-2">{area.areaName}</p>
          <ul className="space-y-2 ml-3">
            {area.nodes.map((node) => (
              <li
                key={`${area.areaName}-${node.nodeNumber}`}
                onClick={() =>
                  onSelectNode({ node: node, areaName: area.areaName })
                }
                className="cursor-pointer p-2 rounded hover:bg-[#DCC4A8] transition text-[#5A3F28]"
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
      <button
        onClick={onBack}
        className="text-[#5A3F28] hover:underline font-semibold"
      >
        ← Back to all nodes
      </button>
      <h3 className="text-[#6B3E1B] font-bold">
        Node {node.nodeNumber} - {node.nodeType} (Area: {areaName})
      </h3>

      {rankKeys.map((rankKey) => {
        const data = node[rankKey as keyof Node] as any;
        if (!data?.items?.length) return null;
        return (
          <div key={rankKey}>
            <p className="font-medium text-[#6B3E1B]">{rankKey}:</p>
            <ul className="ml-4 list-disc text-[#5A3F28]">
              {data.items.map((item: any) => (
                <li key={item.itemName}>
                  <Link
                    to={`/item/${encodeName(item.itemName)}`}
                    className="text-[#5A3F28] hover:underline"
                  >
                    {item.itemName}
                  </Link>
                </li>
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

  console.log("mapName", mapName);
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
    return (
      <ContentWrapper>
        <MapDetailSkeleton />
      </ContentWrapper>
    );
  }

  if (!map) {
    return (
      <ContentWrapper>
        <DetailEmptyState message="Map not found" entityName="Map" />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        {/* <h1 className="text-4xl font-extrabold text-center text-[#6B3E1B] mb-6">
          {map.mapName}
        </h1> */}

        {/* <div className="my-6 h-px bg-[#CBA986]" /> */}

        <div className="flex justify-center lg:justify-start gap-6 lg:gap-8 flex-col lg:flex-row">
          {/* MAP */}
          <div className="rounded-lg overflow-hidden shadow flex-shrink-0">
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
          <div className="flex-1 bg-[#F7E7D0] rounded-lg p-6 shadow max-h-[750px] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#6B3E1B]">
              {map.mapName}
            </h2>

            <input
              type="text"
              placeholder="Search nodes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-[#CBA986] rounded bg-white text-[#5A3F28] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B3E1B]"
            />

            <div className="flex gap-2 mb-4">
              <select
                value={nodeTypeFilter}
                onChange={(e) => setNodeTypeFilter(e.target.value)}
                className="flex-1 border border-[#CBA986] rounded px-3 py-2 text-sm bg-white text-[#5A3F28] focus:outline-none focus:ring-2 focus:ring-[#6B3E1B]"
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
                className="flex-1 border border-[#CBA986] rounded px-3 py-2 text-sm bg-white text-[#5A3F28] focus:outline-none focus:ring-2 focus:ring-[#6B3E1B]"
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
