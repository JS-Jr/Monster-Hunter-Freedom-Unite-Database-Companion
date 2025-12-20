import { Marker, Popup } from "react-leaflet";
import type { MapData } from "../types/MapV2";
import type React from "react";

interface MapMarkersProps {
  map: MapData | undefined;
  onSelectNode?: (node: any) => void; // callback when node is clicked
}

function MapMarkers({ map, onSelectNode }: MapMarkersProps) {
  if (!map) return null;

  return (
    <>
      {map.areas.map((area) =>
        area.nodes.map((node) => {
          if (!node.pin) return null;

          const { x, y, label } = node.pin;

          const key =
            area.areaNumber !== null
              ? `${area.areaNumber}-${node.nodeNumber}`
              : `${area.areaName}-${node.nodeNumber}`;

          return (
            <Marker
              key={key}
              position={[y, x]}
              eventHandlers={{
                click: () => onSelectNode?.(node), // trigger selection
              }}
            >
              <Popup>
                <div>
                  <strong>{label || `Node ${node.nodeNumber}`}</strong>
                  <br />
                  Type: {node.nodeType}
                  {area.areaNumber !== null && <br />}
                  Area: {area.areaName}{" "}
                  {area.areaNumber !== null && `(Area ${area.areaNumber})`}
                </div>
              </Popup>
            </Marker>
          );
        })
      )}
    </>
  );
}

export default MapMarkers;
