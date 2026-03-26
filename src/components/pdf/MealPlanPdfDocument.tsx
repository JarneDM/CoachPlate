import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

type Recipe = {
  id?: string;
  name?: string | null;
  instructions?: string | null;
  prep_time_min?: number | null;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  recipe_ingredients?: RecipeIngredient[] | null;
};

type IngredientItem = {
  id?: string;
  name?: string | null;
};

type RecipeIngredient = {
  id?: string;
  amount_g?: number | null;
  ingredients?: IngredientItem | null;
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
    calories_goal?: number | null;
    protein_goal?: number | null;
    carbs_goal?: number | null;
    fat_goal?: number | null;
  } | null;
};

type Props = {
  plan: Plan;
  days: Day[];
};

const GREEN = "#16a34a";
const GREEN_LIGHT = "#dcfce7";
const GREEN_DARK = "#065f46";
const GRAY_50 = "#f9fafb";
const GRAY_100 = "#f3f4f6";
const GRAY_200 = "#e5e7eb";
const GRAY_400 = "#9ca3af";
const GRAY_600 = "#4b5563";
const GRAY_800 = "#1f2937";
const GRAY_900 = "#111827";
const WHITE = "#ffffff";
const ORANGE = "#ea580c";
const BLUE = "#2563eb";
const YELLOW = "#ca8a04";
const RED = "#dc2626";

const MEAL_COLORS: Record<string, string> = {
  ontbijt: ORANGE,
  lunch: YELLOW,
  avondeten: BLUE,
  snack: GREEN,
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 36,
    fontSize: 10,
    color: GRAY_900,
    backgroundColor: WHITE,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: GREEN,
  },
  headerLeft: {
    flex: 1,
  },
  brandName: {
    fontSize: 11,
    color: GREEN,
    fontWeight: 700,
    marginBottom: 6,
    letterSpacing: 1,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: GRAY_900,
    marginBottom: 4,
  },
  planMeta: {
    fontSize: 9,
    color: GRAY_600,
    marginBottom: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  clientBadge: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clientName: {
    fontSize: 10,
    color: GREEN_DARK,
    fontWeight: 700,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: GRAY_900,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionDivider: {
    marginTop: 24,
    marginBottom: 14,
    borderTopWidth: 1,
    borderTopColor: GRAY_200,
    paddingTop: 16,
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayCard: {
    width: "48.5%",
    borderWidth: 1,
    borderColor: GRAY_200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  dayHeader: {
    backgroundColor: GREEN,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: WHITE,
  },
  dayDate: {
    fontSize: 8,
    color: GREEN_LIGHT,
  },
  dayBody: {
    padding: 8,
    backgroundColor: WHITE,
  },

  mealRow: {
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_100,
  },
  mealRowLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    gap: 4,
  },
  mealTypeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mealTypeLabel: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "capitalize",
  },
  recipeLine: {
    fontSize: 9,
    color: GRAY_800,
    marginLeft: 10,
    marginBottom: 1,
  },
  macroLine: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 10,
    marginTop: 2,
  },
  macroBadge: {
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  macroText: {
    fontSize: 7,
    fontWeight: 700,
  },
  emptyText: {
    fontSize: 8,
    color: GRAY_400,
    marginLeft: 10,
    fontStyle: "italic",
  },

  dayTotals: {
    backgroundColor: GRAY_50,
    borderTopWidth: 1,
    borderTopColor: GRAY_100,
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayTotalItem: {
    alignItems: "center",
  },
  dayTotalValue: {
    fontSize: 9,
    fontWeight: 700,
    color: GRAY_900,
  },
  dayTotalLabel: {
    fontSize: 7,
    color: GRAY_400,
  },

  recipeCard: {
    borderWidth: 1,
    borderColor: GRAY_200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  recipeHeader: {
    backgroundColor: GRAY_50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_200,
  },
  recipeName: {
    fontSize: 11,
    fontWeight: 700,
    color: GRAY_900,
    flex: 1,
  },
  recipePrepTime: {
    fontSize: 8,
    color: GRAY_600,
    backgroundColor: GRAY_100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recipeBody: {
    padding: 10,
  },
  recipeMacrosRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  recipeMacroBadge: {
    flex: 1,
    borderRadius: 6,
    padding: 6,
    alignItems: "center",
  },
  recipeMacroValue: {
    fontSize: 11,
    fontWeight: 700,
  },
  recipeMacroLabel: {
    fontSize: 7,
    marginTop: 1,
  },
  recipeInstructionsLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: GRAY_600,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recipeBottomSection: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
  },
  ingredientsLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: GRAY_600,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ingredientLine: {
    fontSize: 9,
    color: GRAY_800,
    marginBottom: 2,
  },
  ingredientAmount: {
    color: GRAY_600,
  },
  recipeSectionSpacer: {
    marginTop: 8,
    width: "40%",
  },
  recipeInstructions: {
    fontSize: 9,
    color: GRAY_800,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  instructionsGrid: {
    marginTop: 2,
  },
  instructionStep: {
    fontSize: 9,
    color: GRAY_800,
    lineHeight: 1.5,
    marginBottom: 2,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: GRAY_200,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: GRAY_400,
  },
  footerBrand: {
    fontSize: 8,
    color: GREEN,
    fontWeight: 700,
  },
});

function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mealTypeLabel(mealType?: string | null) {
  const labels: Record<string, string> = {
    ontbijt: "Ontbijt",
    lunch: "Lunch",
    avondeten: "Avondeten",
    snack: "Snack",
  };
  return labels[mealType ?? ""] ?? mealType ?? "Maaltijd";
}

function calcDayTotals(meals: Meal[]) {
  let calories = 0,
    protein = 0,
    carbs = 0,
    fat = 0;
  meals.forEach((meal) => {
    meal.meal_recipes?.forEach((mr) => {
      const s = mr.servings ?? 1;
      calories += (mr.recipes?.calories ?? 0) * s;
      protein += (mr.recipes?.protein_g ?? 0) * s;
      carbs += (mr.recipes?.carbs_g ?? 0) * s;
      fat += (mr.recipes?.fat_g ?? 0) * s;
    });
  });
  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

function getUniqueRecipes(days: Day[]): Recipe[] {
  const seen = new Set<string>();
  const recipes: Recipe[] = [];
  days.forEach((day) => {
    day.meals?.forEach((meal) => {
      meal.meal_recipes?.forEach((mr) => {
        if (mr.recipes?.id && !seen.has(mr.recipes.id)) {
          seen.add(mr.recipes.id);
          recipes.push(mr.recipes);
        }
      });
    });
  });
  return recipes;
}

function getInstructionSteps(instructions: string): string[] {
  return instructions
    .split(/\r?\n|,/)
    .map((step) => step.trim())
    .filter(Boolean);
}

export default function MealPlanPdfDocument({ plan, days }: Props) {
  const uniqueRecipes = getUniqueRecipes(days);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>COACHPLATE</Text>
            <Text style={styles.planTitle}>{plan.name}</Text>
            {plan.start_date && plan.end_date && (
              <Text style={styles.planMeta}>
                {formatDate(plan.start_date)} → {formatDate(plan.end_date)}
              </Text>
            )}
            <Text style={styles.planMeta}>Gegenereerd op {formatDate(new Date().toISOString())}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.clientBadge}>
              <Text style={styles.clientName}>{plan.clients?.full_name ?? "Onbekende klant"}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Macro doel klant</Text>
          <View style={{ flexDirection: "row", gap: 5, marginTop: 4 }}>
            <View style={{ backgroundColor: "#fff7ed", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 7, fontWeight: 700, color: ORANGE, paddingHorizontal: 6, paddingVertical: 2 }}>
                {plan.clients?.calories_goal ? `${plan.clients.calories_goal} kcal` : "kcal doel niet ingesteld"}
              </Text>
            </View>
            <View style={{ backgroundColor: "#eff6ff", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 7, fontWeight: 700, color: BLUE, paddingHorizontal: 6, paddingVertical: 2 }}>
                {plan.clients?.protein_goal ? `${plan.clients.protein_goal}g Proteine` : "eiwit doel niet ingesteld"}
              </Text>
            </View>
            <View style={{ backgroundColor: "#fefce8", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 7, fontWeight: 700, color: YELLOW, paddingHorizontal: 6, paddingVertical: 2 }}>
                {plan.clients?.carbs_goal ? `${plan.clients.carbs_goal}g Koolhydraten` : "koolh doel niet ingesteld"}
              </Text>
            </View>
            <View style={{ backgroundColor: "#fef2f2", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 7, fontWeight: 700, color: RED, paddingHorizontal: 6, paddingVertical: 2 }}>
                {plan.clients?.fat_goal ? `${plan.clients.fat_goal}g Vetten` : "vet doel niet ingesteld"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Weekoverzicht</Text>
        <View style={styles.daysGrid}>
          {days.map((day) => {
            const sortedMeals = [...(day.meals ?? [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
            const totals = calcDayTotals(sortedMeals);
            const DAY_NAMES = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

            return (
              <View key={day.id ?? `day-${day.day_number}`} style={styles.dayCard} wrap={false}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>{DAY_NAMES[day.day_number - 1] ?? `Dag ${day.day_number}`}</Text>
                  {day.date && <Text style={styles.dayDate}>{formatDate(day.date)}</Text>}
                </View>

                <View style={styles.dayBody}>
                  {sortedMeals.length > 0 ? (
                    sortedMeals.map((meal, mealIdx) => {
                      const isLast = mealIdx === sortedMeals.length - 1;
                      const color = MEAL_COLORS[meal.meal_type ?? ""] ?? GREEN;

                      return (
                        <View key={meal.id ?? `${day.day_number}-${meal.meal_type}`} style={isLast ? styles.mealRowLast : styles.mealRow}>
                          <View style={styles.mealHeader}>
                            <View style={[styles.mealTypeDot, { backgroundColor: color }]} />
                            <Text style={[styles.mealTypeLabel, { color }]}>{mealTypeLabel(meal.meal_type)}</Text>
                          </View>

                          {(meal.meal_recipes ?? []).length > 0 ? (
                            meal.meal_recipes!.map((entry) => (
                              <View key={entry.id}>
                                <Text style={styles.recipeLine}>
                                  {entry.recipes?.name ?? "Onbekend recept"}
                                  {entry.servings && entry.servings !== 1 ? ` ×${entry.servings}` : ""}
                                </Text>
                                {entry.recipes?.calories && (
                                  <View style={styles.macroLine}>
                                    <View style={[styles.macroBadge, { backgroundColor: "#fff7ed" }]}>
                                      <Text style={[styles.macroText, { color: ORANGE }]}>
                                        {Math.round((entry.recipes.calories ?? 0) * (entry.servings ?? 1))} kcal
                                      </Text>
                                    </View>
                                    <View style={[styles.macroBadge, { backgroundColor: "#eff6ff" }]}>
                                      <Text style={[styles.macroText, { color: BLUE }]}>
                                        {Math.round((entry.recipes.protein_g ?? 0) * (entry.servings ?? 1))}g P
                                      </Text>
                                    </View>
                                    <View style={[styles.macroBadge, { backgroundColor: "#fefce8" }]}>
                                      <Text style={[styles.macroText, { color: YELLOW }]}>
                                        {Math.round((entry.recipes.carbs_g ?? 0) * (entry.servings ?? 1))}g K
                                      </Text>
                                    </View>
                                    <View style={[styles.macroBadge, { backgroundColor: "#fef2f2" }]}>
                                      <Text style={[styles.macroText, { color: RED }]}>
                                        {Math.round((entry.recipes.fat_g ?? 0) * (entry.servings ?? 1))}g V
                                      </Text>
                                    </View>
                                  </View>
                                )}
                              </View>
                            ))
                          ) : (
                            <Text style={styles.emptyText}>Geen recepten</Text>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.emptyText}>Geen maaltijden ingepland</Text>
                  )}
                </View>

                {sortedMeals.length > 0 && (
                  <View style={styles.dayTotals}>
                    <View style={styles.dayTotalItem}>
                      <Text style={[styles.dayTotalValue, { color: ORANGE }]}>{totals.calories}</Text>
                      <Text style={styles.dayTotalLabel}>kcal</Text>
                    </View>
                    <View style={styles.dayTotalItem}>
                      <Text style={[styles.dayTotalValue, { color: BLUE }]}>{totals.protein}g</Text>
                      <Text style={styles.dayTotalLabel}>prot</Text>
                    </View>
                    <View style={styles.dayTotalItem}>
                      <Text style={[styles.dayTotalValue, { color: YELLOW }]}>{totals.carbs}g</Text>
                      <Text style={styles.dayTotalLabel}>koolh</Text>
                    </View>
                    <View style={styles.dayTotalItem}>
                      <Text style={[styles.dayTotalValue, { color: RED }]}>{totals.fat}g</Text>
                      <Text style={styles.dayTotalLabel}>vet</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {plan.clients?.full_name ?? ""} — {plan.name}
          </Text>
          <Text style={styles.footerBrand}>CoachPlate</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} van ${totalPages}`} />
        </View>
      </Page>

      {uniqueRecipes.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.sectionDivider}>
            <Text style={styles.sectionTitle}>Recepten</Text>
            {uniqueRecipes.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard} wrap={false}>
                <View style={styles.recipeHeader}>
                  <Text style={styles.recipeName}>{recipe.name ?? "Onbekend recept"}</Text>
                  {recipe.prep_time_min && <Text style={styles.recipePrepTime}>{recipe.prep_time_min} min</Text>}
                </View>

                <View style={styles.recipeBody}>
                  {recipe.calories && (
                    <View style={styles.recipeMacrosRow}>
                      <View style={[styles.recipeMacroBadge, { backgroundColor: "#fff7ed" }]}>
                        <Text style={[styles.recipeMacroValue, { color: ORANGE }]}>{recipe.calories}</Text>
                        <Text style={[styles.recipeMacroLabel, { color: ORANGE }]}>kcal</Text>
                      </View>
                      <View style={[styles.recipeMacroBadge, { backgroundColor: "#eff6ff" }]}>
                        <Text style={[styles.recipeMacroValue, { color: BLUE }]}>{recipe.protein_g}g</Text>
                        <Text style={[styles.recipeMacroLabel, { color: BLUE }]}>proteïne</Text>
                      </View>
                      <View style={[styles.recipeMacroBadge, { backgroundColor: "#fefce8" }]}>
                        <Text style={[styles.recipeMacroValue, { color: YELLOW }]}>{recipe.carbs_g}g</Text>
                        <Text style={[styles.recipeMacroLabel, { color: YELLOW }]}>koolhydraten</Text>
                      </View>
                      <View style={[styles.recipeMacroBadge, { backgroundColor: "#fef2f2" }]}>
                        <Text style={[styles.recipeMacroValue, { color: RED }]}>{recipe.fat_g}g</Text>
                        <Text style={[styles.recipeMacroLabel, { color: RED }]}>vetten</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.recipeBottomSection}>
                    {recipe.instructions && (
                      <View style={styles.recipeSectionSpacer}>
                        <Text style={styles.recipeInstructionsLabel}>Bereiding</Text>
                        <View style={styles.instructionsGrid}>
                          {getInstructionSteps(recipe.instructions).map((step, idx) => (
                            <Text key={`${recipe.id ?? "recipe"}-step-${idx}`} style={styles.instructionStep}>
                              {idx + 1}. {step}
                            </Text>
                          ))}
                        </View>
                      </View>
                    )}

                    {(recipe.recipe_ingredients ?? []).length > 0 && (
                      <View style={styles.recipeSectionSpacer}>
                        <Text style={styles.ingredientsLabel}>Ingredienten</Text>
                        {(recipe.recipe_ingredients ?? []).map((ri) => (
                          <Text key={ri.id ?? `${recipe.id ?? "recipe"}-ingredient`} style={styles.ingredientLine}>
                            - {ri.ingredients?.name ?? "Onbekend ingrediënt"}
                            {ri.amount_g ? <Text style={styles.ingredientAmount}> ({ri.amount_g}g)</Text> : ""}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              {plan.clients?.full_name ?? ""} — {plan.name}
            </Text>
            <Text style={styles.footerBrand}>CoachPlate</Text>
            <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} van ${totalPages}`} />
          </View>
        </Page>
      )}
    </Document>
  );
}
