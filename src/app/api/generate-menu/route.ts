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
  instructions: string;
  prep_time_min: number;
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
    typeof meal.instructions === "string" &&
    typeof meal.prep_time_min === "number" &&
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
    max_tokens: 15000,
    system:
      "Antwoord ALLEEN met geldige JSON. Geen tekst voor of na. Geen markdown code blocks. Kom zodicht mogelijk bij het gevraagde doel van kcal/proteïne/kh/vet, kleine afwijkingen (100 - 200ckal) maakt niet uit. Gebruik de exacte structuur zoals hieronder, inclusief alle velden, ook al zijn sommige waarden 0 of lege lijsten.",
    messages: [
      {
        role: "user",
        content: `Genereer een volledig weekmenu in JSON formaat voor:
Klant: ${client.full_name}
Kcal/dag: ${client.calories_goal} | Proteïne: ${client.protein_goal}g | Kh: ${client.carbs_goal}g | Vet: ${client.fat_goal}g
Allergie(ën): ${(client.allergies || []).join(", ") || "geen"}
Voorkeur: ${client.preferences || "geen"}

RETOURNEER ALLEEN DIT JSON FORMAAT, NIETS ANDERS:
{"days":[{"day":"Maandag","meals":{"ontbijt":{"name":"Ontbijt naam","calories":450,"protein_g":35,"carbs_g":45,"fat_g":15,"prep_time_min":15,"instructions":"stap 1,stap 2,stap 3","ingredients":[{"name":"ingredient",amount_g":100,"calories":120,"protein_g":8,"carbs_g":10,"fat_g":5}]},"lunch":{"name":"Lunch","calories":550,"protein_g":40,"carbs_g":55,"fat_g":18,"prep_time_min":20,"instructions":"stap 1,stap 2","ingredients":[{"name":"ingredient","amount_g":150,"calories":140,"protein_g":10,"carbs_g":15,"fat_g":6}]},"avondeten":{"name":"Diner","calories":650,"protein_g":45,"carbs_g":60,"fat_g":22,"prep_time_min":30,"instructions":"stap 1,stap 2,stap 3","ingredients":[{"name":"ingredient","amount_g":200,"calories":160,"protein_g":12,"carbs_g":18,"fat_g":8}]},"snack":{"name":"Snack","calories":250,"protein_g":20,"carbs_g":20,"fat_g":10,"prep_time_min":10,"instructions":"bereid","ingredients":[{"name":"ingredient","amount_g":100,"calories":120,"protein_g":8,"carbs_g":10,"fat_g":5}]}}},{"day":"Dinsdag","meals":{...}},...7 dagen totaal]}`,
      },
    ],
  });

  const response = message.content[0];
  if (response.type !== "text") {
    return NextResponse.json({ error: "Onverwacht antwoord van AI" }, { status: 500 });
  }

  if (message.stop_reason === "max_tokens") {
    return NextResponse.json({ error: "AI antwoord werd afgekapt. Probeer opnieuw." }, { status: 502 });
  }

  const trimmedResponse = response.text.trim();
  if (!trimmedResponse.startsWith("{") || !trimmedResponse.endsWith("}")) {
    console.error("Ongeldig AI antwoord format. Gekregen:", trimmedResponse);
    return NextResponse.json({ error: "AI gaf geen geldige JSON terug" }, { status: 500 });
  }

  const menu = tryParsePlan(trimmedResponse);

  if (!menu) {
    console.error("AI response kon niet geparsed/gevalideerd worden:", trimmedResponse.substring(0, 300));
    return NextResponse.json({ error: "AI gaf geen geldige menu structuur terug" }, { status: 500 });
  }

  console.log(message.usage);
  return NextResponse.json({ menu });
}
