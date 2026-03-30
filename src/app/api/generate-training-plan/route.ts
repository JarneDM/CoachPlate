import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canGenerateTrainingPlan } from "@/lib/supabase/subscriptionHelpers";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GeneratedExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  notes: string;
}

interface GeneratedDay {
  day_number: number;
  name: string;
  exercises: GeneratedExercise[];
}

interface GeneratedTrainingPlan {
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

function isGeneratedExercise(value: unknown): value is GeneratedExercise {
  if (!value || typeof value !== "object") return false;
  const exercise = value as Record<string, unknown>;

  return (
    typeof exercise.name === "string" &&
    exercise.name.trim().length > 0 &&
    typeof exercise.muscle_group === "string" &&
    typeof exercise.sets === "number" &&
    Number.isFinite(exercise.sets) &&
    exercise.sets > 0 &&
    typeof exercise.reps === "number" &&
    Number.isFinite(exercise.reps) &&
    exercise.reps > 0 &&
    typeof exercise.rest_seconds === "number" &&
    Number.isFinite(exercise.rest_seconds) &&
    exercise.rest_seconds >= 0 &&
    typeof exercise.notes === "string"
  );
}

function isGeneratedTrainingPlan(value: unknown): value is GeneratedTrainingPlan {
  if (!value || typeof value !== "object") return false;

  const plan = value as Record<string, unknown>;
  if (!Array.isArray(plan.days) || plan.days.length === 0 || plan.days.length > 7) return false;

  return plan.days.every((day, index) => {
    if (!day || typeof day !== "object") return false;

    const dayRecord = day as Record<string, unknown>;

    return (
      typeof dayRecord.day_number === "number" &&
      Number.isFinite(dayRecord.day_number) &&
      dayRecord.day_number === index + 1 &&
      typeof dayRecord.name === "string" &&
      dayRecord.name.trim().length > 0 &&
      Array.isArray(dayRecord.exercises) &&
      dayRecord.exercises.length > 0 &&
      dayRecord.exercises.every((exercise) => isGeneratedExercise(exercise))
    );
  });
}

function tryParsePlan(rawText: string): GeneratedTrainingPlan | null {
  const cleaned = normalizeModelJsonText(rawText)
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return isGeneratedTrainingPlan(parsed) ? parsed : null;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    const jsonSlice = cleaned.slice(start, end + 1);

    try {
      const parsed = JSON.parse(jsonSlice);
      return isGeneratedTrainingPlan(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
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

  // Check Pro plan requirement for training plan generation
  const canGenerate = await canGenerateTrainingPlan(user.id);
  if (!canGenerate) {
    return NextResponse.json({ error: "Trainingsschema's genereren met AI is alleen beschikbaar bij het Pro plan" }, { status: 403 });
  }

  const { client, extraWishes } = await req.json();

  if (!client) {
    return NextResponse.json({ error: "Ontbrekende klantgegevens" }, { status: 400 });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 5000,
    system: "Antwoord ALLEEN met geldige JSON. Geen tekst voor/na de JSON. Geen markdown code blocks. Start met { en eindig met }.",
    messages: [
      {
        role: "user",
        content: `Genereer een trainingsschema in JSON voor deze klant:
        \nNaam: ${client.full_name}
        \nDoel: ${client.goal || "niet opgegeven"}\nVoorkeuren: ${client.preferences || "geen"}
        \nNotities: ${client.notes || "geen"}\nExtra wensen coach: ${extraWishes || "geen"}
        \nSplit: ${client.split || "geen"}\n
        \nEisen:\n- Maak ${client.days || "3 tot 6"} trainingsdagen. (afhankelijk van de split en voorkeuren), als het doel iets met afvallen of vetverlies te maken heeft. voeg ook 1 cardio oefening toe per dag.\n
        \n- day_number moet oplopen vanaf 1 zonder gaten.
        \n- Elke dag bevat 4 tot 8 oefeningen.
        \n- Geef realistische sets/reps/rust volgens het doel van de klant.
        \n- Wissel spiergroepen logisch af over de week.\n- Notes kort en praktisch (1 zin).\n
        \nRetourneer ALLEEN dit JSON formaat:\n
        {\n  "days": [\n    {\n      "day_number": 1,\n      "name": "Upper Body",\n      "exercises": [\n        {\n          "name": "Bench Press",\n          "muscle_group": "Chest",\n          "sets": 4,\n          "reps": 8,\n          "rest_seconds": 90,\n          "notes": "Houd schouders laag en span core aan."\n        }\n      ]\n    }\n  ]\n}\n\nGeen extra velden, geen null, geen markdown, geen uitleg.`,
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

  const plan = tryParsePlan(response.text);

  if (!plan) {
    return NextResponse.json({ error: "AI gaf geen geldig trainingsschema terug" }, { status: 500 });
  }

  return NextResponse.json({ plan });
}
