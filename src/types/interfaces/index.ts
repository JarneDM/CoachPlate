export interface IngredientRow {
  id: string;
  name: string;
  amount_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface IngredientInput {
  name: string;
  amount_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface RecipeInput {
  name: string;
  description?: string;
  instructions?: string;
  prep_time_min?: number;
  meal_type?: string;
  servings?: number;
  ingredients: IngredientInput[];
}