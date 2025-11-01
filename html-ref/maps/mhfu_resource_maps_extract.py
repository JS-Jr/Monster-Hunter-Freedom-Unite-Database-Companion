import json
import sys
from bs4 import BeautifulSoup

def split_items(cell):
    """Split multiline <td> into list of item dicts"""
    return [{"itemName": i.strip()} for i in cell.get_text(separator="\n", strip=True).split("\n") if i.strip() and i.strip() != "-"]

def parse_area_table(table):
    """Parse one area table"""
    rows = table.find_all("tr")
    areas = []

    # Detect area name
    first_row = rows[0].find_all("td")
    if not first_row:
        return None
    area_name = first_row[0].get_text(strip=True)

    area = {
        "areaName": area_name,
        "areaNumber": None,
        "nodes": []
    }

    if "Area" in area_name and area_name.replace("Area", "").strip().isdigit():
        area["areaNumber"] = int(area_name.replace("Area", "").strip())

    # Skip the first two rows (area header + column headers)
    for row in rows[2:]:
        cells = row.find_all("td")
        if not cells or len(cells) < 2:
            continue

        node = {"nodeNumber": cells[0].get_text(strip=True), "nodeType": cells[1].get_text(strip=True)}

        # --- handle 8-column normal tables ---
        if len(cells) >= 8:
            node["low-rank"] = {"items": split_items(cells[2])}
            node["high-rank"] = {"items": split_items(cells[3])}
            node["g-rank"] = {"items": split_items(cells[4])}
            node["training-school"] = {"items": split_items(cells[5])}

            # Treasure hunting + points
            treasure_items = split_items(cells[6])
            points_text = cells[7].get_text(separator="\n", strip=True)
            points = [p.strip() for p in points_text.split("\n") if p.strip()]

            treasure_combined = []
            for i, item in enumerate(treasure_items):
                pt = 0
                if i < len(points):
                    try:
                        pt = int(points[i])
                    except ValueError:
                        pt = 0
                treasure_combined.append({"itemName": item["itemName"], "points": pt})
            node["treasure-hunting"] = {"items": treasure_combined}

        # --- handle 4-column Secret Area tables ---
        elif len(cells) == 4:
            node["high-rank"] = {"items": split_items(cells[2])}
            node["g-rank"] = {"items": split_items(cells[3])}

        area["nodes"].append(node)

    return area


def parse_html(html):
    soup = BeautifulSoup(html, "html.parser")
    maps = []

    for h3 in soup.find_all("h3"):
        map_name = h3.get_text(strip=True)
        map_obj = {"mapName": map_name, "areas": []}

        # collect all ffaq tables until the next h3 or h2
        for sib in h3.find_all_next(["table", "h2", "h3"]):
            if sib.name in ["h2", "h3"] and sib is not h3:
                break
            if sib.name == "table" and "ffaq" in sib.get("class", []):
                area = parse_area_table(sib)
                if area:
                    map_obj["areas"].append(area)

        maps.append(map_obj)

    return maps


def main():
    if len(sys.argv) < 2:
        print("Usage: python mhfu_resource_maps_extract_v2.py <path_to_html_or_url>")
        sys.exit(1)

    src = sys.argv[1]
    if src.startswith("http://") or src.startswith("https://"):
        import requests
        html = requests.get(src).text
    else:
        with open(src, "r", encoding="utf-8") as f:
            html = f.read()

    maps = parse_html(html)
    out_file = "mhfu_resource_maps.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(maps, f, ensure_ascii=False, indent=2)

    print(f"✅ Exported {len(maps)} maps → {out_file}")


if __name__ == "__main__":
    main()
