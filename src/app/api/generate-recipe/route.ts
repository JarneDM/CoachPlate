import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function normalizeModelJsonText(rawText: string): string {
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return fencedMatch?.[1]?.trim() ?? trimmed;
}

function tryParseRecipe(rawText: string): object | null {
  const cleaned = normalizeModelJsonText(rawText).trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export async function POST(req: NextRequest) {
  const { name, wishes, mealType } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: "Antwoord ALLEEN met geldige JSON. Geen tekst voor/na de JSON. Geen markdown code blocks. Start met { en eindig met }.",
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
  "instructions": "stap voor stap bereiding, gescheiden door | geen genummerde lijst",
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

  const recipe = tryParseRecipe(response.text);
  if (!recipe) {
    return NextResponse.json({ error: "AI gaf geen geldige JSON terug" }, { status: 500 });
  }

  return NextResponse.json({ recipe });
}
