import { useEffect, useState } from "react";
import type { Ingredient, MealRecipe, IngredientType, MealEffect } from "../types/Kitchen";

export default function Kitchen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<MealRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<IngredientType>("meat");
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [mealEffects, setMealEffects] = useState<MealEffect[]>([]);

  const ingredientTypes: IngredientType[] = ["meat", "bran", "fish", "fruit", "veggie"];
  const categoryLabels: Record<IngredientType, string> = {
    meat: "Meat",
    bran: "Bran",
    fish: "Fish",
    fruit: "Fruit",
    veggie: "Veggie",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientsRes, recipesRes] = await Promise.all([
          fetch("/data/meals.json"),
          fetch("/data/meal-effects.json"),
        ]);

        const ingredientsData = await ingredientsRes.json();
        const recipesData = await recipesRes.json();

        setIngredients(ingredientsData);
        setRecipes(recipesData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentCategoryIngredients = ingredients.filter(
    (ing) => ing.type === activeCategory
  );

  const addIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.some((ing) => ing.name === ingredient.name)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      updateMealEffects([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (name: string) => {
    const updated = selectedIngredients.filter((ing) => ing.name !== name);
    setSelectedIngredients(updated);
    updateMealEffects(updated);
  };

  const updateMealEffects = (current: Ingredient[]) => {
    if (current.length < 2) {
      setMealEffects([]);
      return;
    }

    const allEffects: MealEffect[] = [];

    // Check all combinations
    for (let i = 0; i < current.length; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const ing1 = current[i];
        const ing2 = current[j];

        const recipe = recipes.find(
          (r) =>
            ((r.meal1 === ing1.type && r.meal2 === ing2.type) ||
              (r.meal1 === ing2.type && r.meal2 === ing1.type)) &&
            r["chief-number"] === Math.min(ing1["chief-number"], ing2["chief-number"])
        );

        if (recipe) {
          allEffects.push(...recipe.effects);
        }
      }
    }

    // Combine effects by stat
    const effectMap = new Map<string, number>();
    allEffects.forEach((effect) => {
      const current = effectMap.get(effect.stat) || 0;
      effectMap.set(effect.stat, current + effect.points);
    });

    setMealEffects(
      Array.from(effectMap.entries()).map(([stat, points]) => ({
        stat,
        points,
      }))
    );
  };

  if (loading) return <div className="p-4 text-[#5A3F28]">Loading recipe data...</div>;

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Kitchen</h1>
        <p className="text-lg mb-6 opacity-80">Build your perfect meal with selected ingredients</p>

        {/* Ingredient Selector Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Ingredient Selector</h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ingredientTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveCategory(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeCategory === type
                    ? "bg-[#8B6F47] text-white"
                    : "bg-gray-200 text-[#5A3F28] hover:bg-gray-300"
                }`}
              >
                {categoryLabels[type]}
              </button>
            ))}
          </div>

          {/* Ingredients List */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3">
              {categoryLabels[activeCategory]} Ingredients
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {currentCategoryIngredients.map((ingredient) => (
                <button
                  key={ingredient.name}
                  onClick={() => addIngredient(ingredient)}
                  disabled={selectedIngredients.some(
                    (ing) => ing.name === ingredient.name
                  )}
                  className="p-3 rounded-md border-2 border-gray-300 text-left hover:border-[#8B6F47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <div className="font-semibold">{ingredient.name}</div>
                  <div className="text-sm text-gray-600">
                    Quality: {ingredient["chief-number"]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Ingredients Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Selected Ingredients</h2>
          {selectedIngredients.length === 0 ? (
            <p className="text-gray-500 italic">No ingredients selected yet</p>
          ) : (
            <div className="space-y-2">
              {selectedIngredients.map((ingredient) => (
                <div
                  key={ingredient.name}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-md"
                >
                  <div>
                    <span className="font-semibold">{ingredient.name}</span>
                    <span className="text-sm text-gray-600 ml-3">
                      [{categoryLabels[ingredient.type]}]
                    </span>
                  </div>
                  <button
                    onClick={() => removeIngredient(ingredient.name)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meal Effects Section */}
        {selectedIngredients.length >= 2 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Meal Effects</h2>
            {mealEffects.length === 0 ? (
              <p className="text-gray-500 italic">
                No effects available for this combination
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealEffects.map((effect) => (
                  <div
                    key={effect.stat}
                    className="bg-gradient-to-r from-[#E9D3B4] to-[#F5E6D3] p-4 rounded-md border-l-4 border-[#8B6F47]"
                  >
                    <div className="text-sm text-gray-600 capitalize">
                      {effect.stat}
                    </div>
                    <div className="text-2xl font-bold text-[#5A3F28]">
                      {effect.points > 0 ? "+" : ""}
                      {effect.points}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {selectedIngredients.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600">
              Select at least 2 ingredients from different categories to see meal effects
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
