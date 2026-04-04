import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canGenerateRecipe } from "@/lib/supabase/subscriptionHelpers";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet geauthenticeerd" }, { status: 401 });
  }

  // Check AI recipe generation limit
  const { canGenerate, used, limit } = await canGenerateRecipe(user.id);

  if (!canGenerate) {
    if (limit === 0) {
      return NextResponse.json({ error: "AI recepten zijn niet beschikbaar bij jouw huidige plan." }, { status: 403 });
    }

    return NextResponse.json(
      {
        error: `Je hebt je limit van ${limit} AI recepten per maand bereikt. Je hebt ${used} gegenereerd.`,
        used,
        limit,
      },
      { status: 429 },
    );
  }

  const adminSupabase = createAdminClient();
  const { error: logError } = await adminSupabase.from("ai_recipe_generations").insert({
    coach_id: user.id,
  });

  if (logError) {
    console.error("Error logging AI recipe generation:", logError);
    return NextResponse.json({ error: "AI receptgebruik registreren mislukt" }, { status: 500 });
  }

  const { name, wishes, mealType } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Je bent een professionele diëtist. Genereer een recept op basis van de volgende info:

Naam: ${name}
Maaltijdtype: ${mealType || "niet opgegeven"}
Wensen: ${wishes || "geen"}

Geef ALLEEN een JSON object terug in dit exacte formaat, geen extra tekst:
{
  "name": "naam van het recept",
  "description": "korte beschrijving",
  "instructions": "stap voor stap bereiding, gescheiden door kommas",
  "prep_time_min": 15,
  "servings": 1,
  "meal_type": "${mealType || "lunch"}",
  "ingredients": [
    {
      "name": "ingrediënt naam",
      "amount_g": 100,
      "calories": 89,
      "protein_g": 3.5,
      "carbs_g": 20,
      "fat_g": 0.5
    }
  ]
}

Geef realistische macro's per 100g voor elk ingrediënt.
Geef ALLEEN de JSON terug, geen markdown, geen uitleg.`,
      },
    ],
  });

  const response = message.content[0];
  if (response.type !== "text") {
    return NextResponse.json({ error: "Onverwacht antwoord van AI" }, { status: 500 });
  }

  try {
    const recipe = JSON.parse(response.text);
    return NextResponse.json({ recipe });
  } catch {
    return NextResponse.json({ error: "AI gaf geen geldige JSON terug" }, { status: 500 });
  }
}
