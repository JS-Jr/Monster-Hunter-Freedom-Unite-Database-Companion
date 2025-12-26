import json

# Load original JSON
with open("decoration.json", "r", encoding="utf-8") as f:
    data = json.load(f)

items = data.get("weapons", [])

# --------------------------------------------------
# Step 1: Build child -> parent skill map
# --------------------------------------------------
skill_map = {}

for item in items:
    if item.get("donotrender") and "improve_to" in item:
        parent_skill = item["name"]
        for child in item["improve_to"]:
            skill_map[child] = parent_skill

# --------------------------------------------------
# Step 2: Parse actual decorations
# --------------------------------------------------
decorations = []

for item in items:
    if item.get("donotrender"):
        continue

    name = item["name"]

    deco = {
        "name": name,
        "skill_group": skill_map.get(name),  # <-- THIS IS THE KEY PART
        "skills": item.get("skills", []),
        "slots": item.get("slots"),
        "rarity": item.get("rarity"),
        "cost": item.get("create_cost"),
        "materials": [],
        "alt_materials": []
    }

    for mat in item.get("create_mats", []):
        deco["materials"].append({
            "item": mat["name"],
            "qty": int(mat["amount"])
        })

    for mat in item.get("alternative_create_mats", []):
        deco["alt_materials"].append({
            "item": mat["name"],
            "qty": int(mat["amount"])
        })

    decorations.append(deco)

# --------------------------------------------------
# Step 3: Final cleaned structure
# --------------------------------------------------
cleaned_data = {
    "decorations": decorations
}

with open("cleaned_output.json", "w", encoding="utf-8") as f:
    json.dump(cleaned_data, f, indent=2)

print("✔ Skill groups assigned and JSON cleaned.")
