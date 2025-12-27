from bs4 import BeautifulSoup
import json

with open("skills.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")
    
results = []

# Find all h4 headers that are followed by tables
for h4 in soup.find_all("h4"):
    skill_type = h4.get_text(strip=True).replace(":", "")
    table = h4.find_next("table")

    if not table:
        continue

    current_skill_point = None
    rowspan_count = 0

    rows = table.find_all("tr")[1:]  # skip header row

    for row in rows:
        cols = row.find_all("td")

        # Handle rowspan skill point (e.g. Attack, Defense, etc.)
        if rowspan_count == 0:
            current_skill_point = cols[0].get_text(strip=True)
            rowspan_count = int(cols[0].get("rowspan", 1))
            cols = cols[1:]

        rowspan_count -= 1

        points = cols[0].get_text(strip=True)
        skill_name = cols[1].get_text(strip=True)
        description = cols[2].get_text(strip=True)

        results.append({
            "skill_type": skill_type,
            "skill_point": current_skill_point,
            "points": points,
            "skill_name": skill_name,
            "description": description
        })

# Pretty print JSON
# print(json.dumps(results, indent=2))

with open("skills.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("✅ skills.json saved successfully")
