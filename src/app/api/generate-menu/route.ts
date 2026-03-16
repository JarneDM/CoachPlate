import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GeneratedMeal {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: GeneratedIngredient[];
}

interface GeneratedIngredient {
  name: string;
  amount_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface GeneratedDay {
  day: string;
  meals: {
    ontbijt: GeneratedMeal;
    lunch: GeneratedMeal;
    avondeten: GeneratedMeal;
    snack: GeneratedMeal;
  };
}

interface GeneratedPlan {
  days: GeneratedDay[];
}

function tryParsePlan(rawText: string): GeneratedPlan | null {
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return isGeneratedPlan(parsed) ? parsed : null;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    const jsonSlice = cleaned.slice(start, end + 1);

    try {
      const parsed = JSON.parse(jsonSlice);
      return isGeneratedPlan(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}

function isGeneratedMeal(value: unknown): value is GeneratedMeal {
  if (!value || typeof value !== "object") return false;
  const meal = value as Record<string, unknown>;

  const hasValidIngredients =
    Array.isArray(meal.ingredients) &&
    meal.ingredients.length > 0 &&
    meal.ingredients.every((ingredient) => {
      if (!ingredient || typeof ingredient !== "object") return false;

      const ing = ingredient as Record<string, unknown>;
      return (
        typeof ing.name === "string" &&
        typeof ing.amount_g === "number" &&
        typeof ing.calories === "number" &&
        typeof ing.protein_g === "number" &&
        typeof ing.carbs_g === "number" &&
        typeof ing.fat_g === "number"
      );
    });

  return (
    typeof meal.name === "string" &&
    typeof meal.calories === "number" &&
    typeof meal.protein_g === "number" &&
    typeof meal.carbs_g === "number" &&
    typeof meal.fat_g === "number" &&
    hasValidIngredients
  );
}

function isGeneratedPlan(value: unknown): value is GeneratedPlan {
  if (!value || typeof value !== "object") return false;

  const plan = value as Record<string, unknown>;
  if (!Array.isArray(plan.days) || plan.days.length !== 7) return false;

  return plan.days.every((day) => {
    if (!day || typeof day !== "object") return false;

    const dayRecord = day as Record<string, unknown>;
    const meals = dayRecord.meals as Record<string, unknown> | undefined;

    if (typeof dayRecord.day !== "string" || !meals) return false;

    return (
      isGeneratedMeal(meals.ontbijt) &&
      isGeneratedMeal(meals.lunch) &&
      isGeneratedMeal(meals.avondeten) &&
      isGeneratedMeal(meals.snack)
    );
  });
}

export async function POST(req: NextRequest) {
  const { client } = await req.json();

  if (!client) {
    return NextResponse.json({ error: "Ontbrekende klantgegevens" }, { status: 400 });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 10000,
    messages: [
      {
        role: "user",
        content: `Je bent een professionele diëtist. Genereer een volledig weekmenu voor deze klant:

Naam: ${client.full_name}
Doel: ${client.goal || "geen specifiek doel"}
Calorie doel per dag: ${client.calories_goal}
Proteïne doel per dag (g): ${client.protein_goal}
Koolhydraten doel per dag (g): ${client.carbs_goal}
Vet doel per dag (g): ${client.fat_goal}
Allergieën: ${(client.allergies || []).join(", ") || "geen"}
Voorkeuren en wensen: ${client.preferences || "geen"}

Maak EXACT 7 dagen met deze dag-namen in volgorde:
Maandag, Dinsdag, Woensdag, Donderdag, Vrijdag, Zaterdag, Zondag

Voor elke dag geef exact 4 maaltijden: ontbijt, lunch, avondeten, snack.
Voor elke maaltijd geef: name, calories, protein_g, carbs_g, fat_g en ingredients.
ingredients is een array met minimum 3 ingrediënten.
Elke ingredient heeft: name, amount_g, calories, protein_g, carbs_g, fat_g.
Macro's voor ingredienten zijn per 100g.
Geef amount_g als hele getallen (integers, geen decimalen).
Gebruik alleen numerieke waardes voor macro's (geen strings).
Houd tekst compact: maaltijdnaam max 6 woorden, ingredientnaam max 2 woorden.

Geef ALLEEN geldige JSON terug, zonder markdown of extra uitleg, in exact dit formaat:
{
  "days": [
    {
      "day": "Maandag",
      "meals": {
        "ontbijt": { "name": "...", "calories": 450, "protein_g": 35, "carbs_g": 45, "fat_g": 15, "ingredients": [{ "name": "...", "amount_g": 100, "calories": 120, "protein_g": 8, "carbs_g": 10, "fat_g": 5 }] },
        "lunch": { "name": "...", "calories": 550, "protein_g": 40, "carbs_g": 55, "fat_g": 18, "ingredients": [{ "name": "...", "amount_g": 100, "calories": 120, "protein_g": 8, "carbs_g": 10, "fat_g": 5 }] },
        "avondeten": { "name": "...", "calories": 650, "protein_g": 45, "carbs_g": 60, "fat_g": 22, "ingredients": [{ "name": "...", "amount_g": 100, "calories": 120, "protein_g": 8, "carbs_g": 10, "fat_g": 5 }] },
        "snack": { "name": "...", "calories": 250, "protein_g": 20, "carbs_g": 20, "fat_g": 10, "ingredients": [{ "name": "...", "amount_g": 100, "calories": 120, "protein_g": 8, "carbs_g": 10, "fat_g": 5 }] }
      }
    }
  ]
}`,
      },
    ],
  });

  const response = message.content[0];
  if (response.type !== "text") {
    return NextResponse.json({ error: "Onverwacht antwoord van AI" }, { status: 500 });
  }

  if (message.stop_reason === "max_tokens" || !response.text.trim().endsWith("}")) {
    return NextResponse.json(
      { error: "AI antwoord werd afgekapt. Probeer opnieuw of verklein de wensen." },
      { status: 502 },
    );
  }

  const menu = tryParsePlan(response.text);

  if (!menu) {
    console.error("AI response kon niet geparsed/gevalideerd worden:", response.text);
    return NextResponse.json({ error: "AI gaf geen geldige JSON terug" }, { status: 500 });
  }

  return NextResponse.json({ menu });
}
