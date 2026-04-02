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
  public: boolean;
}

export interface ClientOption {
  id: string;
  full_name: string;
}

export interface Recipe {
  id: string;
  name: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
}

export interface MealRecipe {
  id: string;
  servings: number;
  recipes: Recipe;
}

export interface Meal {
  id: string;
  meal_type: string;
  meal_recipes: MealRecipe[];
}

export interface Day {
  id: string;
  day_number: number;
  date: string | null;
  meals: Meal[];
}

export interface Client {
  id: string;
  full_name: string;
  calories_goal: number | null;
  protein_goal: number | null;
  carbs_goal: number | null;
  fat_goal: number | null;
}

export interface Props {
  plan: { id: string };
  days: Day[];
  recipes: Recipe[];
  client: Client | null;
  day?: Day;
}

export interface GeneratedIngredient {
  name: string;
  amount_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface GeneratedRecipe {
  name: string;
  description: string;
  instructions: string;
  prep_time_min: number;
  servings: number;
  meal_type: string;
  ingredients: GeneratedIngredient[];
}