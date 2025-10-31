import json
import sys
from bs4 import BeautifulSoup

def extract_items_from_html(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    items = []

    # Loop through all tables
    for table in soup.find_all("table"):
        # Find the nearest <h2> or <h3> above the table
        header = "Unknown"
        prev = table.find_previous(["h2", "h3"])
        if prev and prev.get_text(strip=True):
            header = prev.get_text(strip=True)

        # Get all rows (skip header row)
        rows = table.find_all("tr")[1:]
        for row in rows:
            cols = row.find_all("td")
            if len(cols) < 6:
                continue
            item = {
                "itemType": header,
                "itemName": cols[1].get_text(strip=True),
                "rarity": cols[2].get_text(strip=True),
                "capacity": cols[3].get_text(strip=True).replace("x", "").strip(),
                "value": cols[4].get_text(strip=True),
                "howToGet": " ".join(cols[5].get_text(" ", strip=True).split())
            }
            items.append(item)

    return items


def main():
    if len(sys.argv) < 2:
        print("Usage: python mhfu_extract.py <path_to_html_or_url>")
        sys.exit(1)

    source = sys.argv[1]
    if source.startswith("http://") or source.startswith("https://"):
        import requests
        response = requests.get(source)
        html_content = response.text
    else:
        with open(source, "r", encoding="utf-8") as f:
            html_content = f.read()

    items = extract_items_from_html(html_content)
    output_file = "mhfu_items.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"✅ Exported {len(items)} items → {output_file}")


if __name__ == "__main__":
    main()
