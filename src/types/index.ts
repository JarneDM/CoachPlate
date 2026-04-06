export interface Coach {
  id: string;
  full_name: string;
  email: string;
  logo_url?: string;
  brand_color?: string;
  created_at: string;
  invite_code: string;
}

export interface Client {
  id: string;
  coach_id: string;
  full_name: string;
  email?: string;
  birth_date?: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  goal?: string;
  calories_goal?: number;
  protein_goal?: number;
  carbs_goal?: number;
  fat_goal?: number;
  allergies?: string[];
  preferences?: string;
  notes?: string;
  created_at: string;
}

export type AddClientPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export type EditClientPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export interface Recipe {
  id: string;
  coach_id: string;
  name: string;
  description?: string;
  instructions?: string;
  prep_time_min?: number;
  meal_type?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  servings?: number;
  image_url?: string;
  created_at: string;
}

export interface MealPlan {
  id: string;
  coach_id: string;
  client_id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  coach_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: "starter" | "pro" | "studio";
  status: "active" | "cancelled" | "past_due";
  current_period_end?: string;
  created_at: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount_g: number;
  ingredients: {
    name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  created_at: string;
}
