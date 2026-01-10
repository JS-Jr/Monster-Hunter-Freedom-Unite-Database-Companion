import type { MapData } from "../types/MapV2";

export function mapRawMapToMap(raw: any): MapData {
  const mapName = raw.mapName;
  const areas = raw.areas;

//   const identifier = mapName + areas;

  return {
    identifier: mapName,
    mapName: mapName,
    areas: areas,
  };
}
