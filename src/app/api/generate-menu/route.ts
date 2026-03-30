import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canGenerateMealPlan } from "@/lib/supabase/subscriptionHelpers";

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

function normalizeModelJsonText(rawText: string): string {
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return trimmed;
}

function tryParsePlan(rawText: string): GeneratedPlan | null {
  const cleaned = normalizeModelJsonText(rawText)
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
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet geauthenticeerd" }, { status: 401 });
  }

  // Check Pro plan requirement for meal plan generation
  const canGenerate = await canGenerateMealPlan(user.id);
  if (!canGenerate) {
    return NextResponse.json({ error: "Weekmenu's genereren met AI is alleen beschikbaar bij het Pro plan" }, { status: 403 });
  }

  const { client } = await req.json();

  if (!client) {
    return NextResponse.json({ error: "Ontbrekende klantgegevens" }, { status: 400 });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 20000,
    system: "Antwoord ALLEEN met geldige JSON. Geen tekst voor/na de JSON. Geen markdown code blocks. Start met { en eindig met }.",
    messages: [
      {
        role: "user",
        content: `Genereer een volledig weekmenu in JSON formaat voor:
Klant: ${client.full_name}
Doel klant: ${client.goal}
DAGDOELEN:
- Totale kcal/dag: ${client.calories_goal}
- Totale proteïne/dag: ${client.protein_goal}g
- Totale koolhydraten/dag: ${client.carbs_goal}g
- Totaal vet/dag: ${client.fat_goal}g
Allergie(ën): ${(client.allergies || []).join(", ") || "geen"} (alles wat deze klant niet mag eten, vermijden in ingrediënten)
Voorkeur: ${client.preferences || "geen"}

KRITIEK: Het TOTAAL van alle 4 maaltijden (ontbijt+lunch+avondeten+snack) PER DAG moet zo dicht mogelijk bij deze doelen liggen:
- kcal: max ±50 afwijking van doel
- proteïne: max ±3g afwijking van doel
- koolhydraten: max ±5g afwijking van doel
- vet: max ±3g afwijking van doel

Verdeel de doelen logisch over 4 maaltijden (ontbijt ~25%, lunch ~30%, avondeten ~35%, snack ~10% van totaal).

RETOURNEER ALLEEN DIT JSON FORMAAT:
{"days":[{"day":"Maandag","meals":{"ontbijt":{"name":"Naam max 5 woorden","calories":450,"protein_g":35,"carbs_g":45,"fat_g":15,"prep_time_min":15,"instructions":"stap 1,stap 2,stap 3","ingredients":[{"name":"ingredient1","amount_g":100,"calories":120,"protein_g":8,"carbs_g":10,"fat_g":5},{"name":"ingredient2","amount_g":50,"calories":80,"protein_g":6,"carbs_g":8,"fat_g":3}]},"lunch":{...},"avondeten":{...},"snack":{...}}},...)]}

- Elke dag: Maandag t/m Zondag in volgorde.
- Elke ingredient: name (max 2 woorden), amount_g (geheel getal), calories, protein_g, carbs_g, fat_g.
- Macro's accurate: zorg dat sum(alle meals van dag) = doel ±tolerantie.
- Instructions: gedetaileerde en duidelijke instructies, komma gescheiden.
- Min 2-3 ingrediënten.
- wees creatief maar realistisch bij de recepten
- Alle velden verplicht, geen null/undefined.`,
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

  const normalizedResponse = normalizeModelJsonText(response.text);
  const menu = tryParsePlan(normalizedResponse);
  console.log("AI raw response:", response.text);
  console.log("Genormaliseerde response:", normalizedResponse);

  if (!menu) {
    console.error("AI response kon niet geparsed/gevalideerd worden:", normalizedResponse.substring(0, 300));
    return NextResponse.json({ error: "AI gaf geen geldige menu structuur terug" }, { status: 500 });
  }

  console.log(message.usage);
  return NextResponse.json({ menu });
}
