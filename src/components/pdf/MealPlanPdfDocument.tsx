import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

type Recipe = {
  id?: string;
  name?: string | null;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
};

type MealRecipe = {
  id?: string;
  servings?: number | null;
  recipes?: Recipe | null;
};

type Meal = {
  id?: string;
  meal_type?: string | null;
  order_index?: number | null;
  meal_recipes?: MealRecipe[] | null;
};

type Day = {
  id?: string;
  day_number: number;
  date?: string | null;
  meals?: Meal[] | null;
};

type Plan = {
  id: string;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  clients?: {
    full_name?: string | null;
  } | null;
};

type Props = {
  plan: Plan;
  days: Day[];
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 11,
    color: "#111827",
  },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 6,
    color: "#065f46",
  },
  dayCard: {
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f9fffc",
  },
  dayTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  mealRow: {
    marginTop: 4,
    marginBottom: 2,
  },
  mealType: {
    fontSize: 10,
    color: "#047857",
    fontWeight: 700,
    marginBottom: 2,
    textTransform: "capitalize",
  },
  recipeLine: {
    fontSize: 10,
    color: "#1f2937",
    marginLeft: 8,
    marginBottom: 1,
  },
  emptyText: {
    fontSize: 10,
    color: "#6b7280",
    marginLeft: 8,
  },
  footer: {
    marginTop: 12,
    fontSize: 9,
    color: "#6b7280",
  },
  MacrosLine: {
    fontSize: 8,
    color: "#4b5563",
    marginLeft: 12,
    marginBottom: 2,
    fontWeight: 700,
  },
});

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mealTypeLabel(mealType?: string | null) {
  if (!mealType) return "Maaltijd";

  const labels: Record<string, string> = {
    ontbijt: "Ontbijt",
    lunch: "Lunch",
    avondeten: "Avondeten",
    snack: "Snack",
  };

  return labels[mealType] ?? mealType;
}

export default function MealPlanPdfDocument({ plan, days }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{plan.name}</Text>
          <Text style={styles.subtitle}>Klant: {plan.clients?.full_name ?? "Onbekend"}</Text>
          {plan.start_date && plan.end_date && (
            <Text style={styles.subtitle}>
              Periode: {formatDate(plan.start_date)} → {formatDate(plan.end_date)}
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Weekoverzicht</Text>
        {days.map((day) => {
          const sortedMeals = [...(day.meals ?? [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

          return (
            <View key={day.id ?? `day-${day.day_number}`} style={styles.dayCard}>
              <Text style={styles.dayTitle}>
                Dag {day.day_number}
                {day.date ? ` (${formatDate(day.date)})` : ""}
              </Text>

              {sortedMeals.length > 0 ? (
                sortedMeals.map((meal) => {
                  const mealRecipes = meal.meal_recipes ?? [];

                  return (
                    <View key={meal.id ?? `${day.day_number}-${meal.meal_type ?? "meal"}`} style={styles.mealRow}>
                      <Text style={styles.mealType}>{mealTypeLabel(meal.meal_type)}</Text>
                      {mealRecipes.length > 0 ? (
                        mealRecipes.map((entry) => (
                          <View key={entry.id ?? `${meal.id}-${entry.recipes?.id ?? "recipe"}`}>
                            <Text style={styles.recipeLine}>
                              - {entry.recipes?.name ?? "Onbekend recept"}
                              {entry.servings ? ` (${entry.servings} portie${entry.servings > 1 ? "s" : ""})` : ""}
                            </Text>
                            <Text style={styles.MacrosLine}>
                              {entry.recipes
                                ? `  (Kcal: ${entry.recipes.calories ?? "n.v.t."}, Eiwit: ${entry.recipes.protein_g ?? "n.v.t."}g, Koolhydraten: ${
                                    entry.recipes.carbs_g ?? "n.v.t."
                                  }g, Vet: ${entry.recipes.fat_g ?? "n.v.t."}g)`
                                : ""}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.emptyText}>Geen recepten toegevoegd</Text>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>Geen maaltijden ingepland</Text>
              )}
            </View>
          );
        })}

        <Text style={styles.footer}>Gegenereerd met CoachPlate</Text>
      </Page>
    </Document>
  );
}
