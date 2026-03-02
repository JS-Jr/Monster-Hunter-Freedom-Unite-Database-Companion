export type IngredientType = "meat" | "bran" | "fish" | "fruit" | "veggie";

export interface Ingredient {
  name: string;
  type: IngredientType;
  "chief-number": number;
}

export interface MealEffect {
  stat: string;
  points: number;
}

export interface MealRecipe {
  meal1: IngredientType;
  meal2: IngredientType;
  "chief-number": number;
  "highest-star": number;
  effects: MealEffect[];
}
