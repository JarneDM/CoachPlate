import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import Image from "next/image";

type Exercise = {
  id?: string;
  name?: string | null;
  muscle_group?: string | null;
  category?: string | null;
};

type ExerciseInPlan = {
  id?: number;
  sets?: number | null;
  reps?: number | null;
  weight_kg?: number | null;
  rest_seconds?: number | null;
  notes?: string | null;
  order_index?: number | null;
  exercises?: Exercise | null;
};

type Day = {
  id?: string;
  day_number: number;
  name?: string | null;
  exercises_trainingplans?: ExerciseInPlan[] | null;
};

type Plan = {
  id: string;
  name: string;
  created_at?: string | null;
  clients?: {
    full_name?: string | null;
  } | null;
};

type Props = {
  plan: Plan;
  days: Day[];
  coachLogoUrl?: string | null;
};

const GREEN = "#16a34a";
const GREEN_LIGHT = "#dcfce7";
const GREEN_DARK = "#065f46";
const GRAY_50 = "#f9fafb";
const GRAY_100 = "#f3f4f6";
const GRAY_200 = "#e5e7eb";
const GRAY_400 = "#9ca3af";
const GRAY_600 = "#4b5563";
const GRAY_900 = "#111827";
const WHITE = "#ffffff";

const MUSCLE_GROUP_COLORS: Record<string, string> = {
  borst: "#dc2626",
  rug: "#2563eb",
  schouders: "#7c3aed",
  benen: "#16a34a",
  armen: "#ea580c",
  core: "#ca8a04",
  cardio: "#db2777",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontSize: 10,
    color: GRAY_900,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: GREEN,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  brandName: {
    fontSize: 11,
    color: GREEN,
    fontWeight: 700,
    marginBottom: 6,
    letterSpacing: 1,
  },
  brandLogo: {
    width: 120,
    height: 36,
    objectFit: "contain",
    marginBottom: 6,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 3,
  },
  planMeta: {
    fontSize: 9,
    color: GRAY_600,
    marginBottom: 2,
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
    marginBottom: 10,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: GRAY_200,
    borderRadius: 8,
    marginBottom: 10,
  },
  dayHeader: {
    backgroundColor: GREEN,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  dayTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: WHITE,
  },
  dayCount: {
    fontSize: 8,
    color: GREEN_LIGHT,
  },
  dayBody: {
    backgroundColor: WHITE,
    padding: 10,
  },
  exerciseRow: {
    borderBottomWidth: 1,
    borderBottomColor: GRAY_100,
    paddingBottom: 7,
    marginBottom: 7,
  },
  exerciseRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  exerciseTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  exerciseName: {
    fontSize: 10,
    fontWeight: 700,
    color: GRAY_900,
    marginRight: 8,
    flex: 1,
  },
  groupBadge: {
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  groupBadgeText: {
    fontSize: 7,
    color: WHITE,
    fontWeight: 700,
    textTransform: "capitalize",
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  metricBadge: {
    backgroundColor: GRAY_50,
    borderWidth: 1,
    borderColor: GRAY_200,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  metricText: {
    fontSize: 8,
    color: GRAY_600,
    fontWeight: 700,
  },
  noteText: {
    marginTop: 3,
    fontSize: 8,
    color: GRAY_600,
  },
  emptyText: {
    fontSize: 9,
    color: GRAY_400,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    left: 36,
    right: 36,
    bottom: 18,
    borderTopWidth: 1,
    borderTopColor: GRAY_200,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: GRAY_400,
  },
  footerLogo: {
    width: 60,
    height: 16,
    objectFit: "contain",
  },
});

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function getGroupColor(muscleGroup?: string | null) {
  const key = (muscleGroup ?? "").toLowerCase();
  return MUSCLE_GROUP_COLORS[key] ?? "#6b7280";
}

export default function TrainingPlanPdfDocument({ plan, days, coachLogoUrl }: Props) {
  const sortedDays = [...days].sort((a, b) => a.day_number - b.day_number);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {coachLogoUrl ? <Image src={coachLogoUrl} alt="Coach Logo" /> : <Text style={styles.brandName}>COACHPLATE</Text>}
            <Text style={styles.planTitle}>{plan.name || "Trainingsschema"}</Text>
            <Text style={styles.planMeta}>Aangemaakt op {formatDate(plan.created_at)}</Text>
            <Text style={styles.planMeta}>
              {sortedDays.length} {sortedDays.length === 1 ? "dag" : "dagen"} in schema
            </Text>
          </View>
          {plan.clients?.full_name ? (
            <View style={styles.clientBadge}>
              <Text style={styles.clientName}>{plan.clients.full_name}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Trainingsdagen</Text>

        {sortedDays.length === 0 ? (
          <Text style={styles.emptyText}>Er zijn nog geen trainingsdagen in dit schema.</Text>
        ) : (
          sortedDays.map((day) => {
            const sortedExercises = [...(day.exercises_trainingplans ?? [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

            return (
              <View key={day.id ?? `day-${day.day_number}`} style={styles.dayCard} wrap={false}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>{day.name || `Dag ${day.day_number}`}</Text>
                  <Text style={styles.dayCount}>
                    {sortedExercises.length} {sortedExercises.length === 1 ? "oefening" : "oefeningen"}
                  </Text>
                </View>

                <View style={styles.dayBody}>
                  {sortedExercises.length === 0 ? (
                    <Text style={styles.emptyText}>Geen oefeningen toegevoegd.</Text>
                  ) : (
                    sortedExercises.map((exerciseInPlan, index) => {
                      const isLast = index === sortedExercises.length - 1;
                      const exerciseName = exerciseInPlan.exercises?.name ?? "Onbekende oefening";
                      const muscleGroup = exerciseInPlan.exercises?.muscle_group;

                      return (
                        <View
                          key={exerciseInPlan.id ?? `${day.id ?? day.day_number}-${index}`}
                          style={isLast ? [styles.exerciseRow, styles.exerciseRowLast] : styles.exerciseRow}
                        >
                          <View style={styles.exerciseTop}>
                            <Text style={styles.exerciseName}>{exerciseName}</Text>
                            {muscleGroup ? (
                              <View style={[styles.groupBadge, { backgroundColor: getGroupColor(muscleGroup) }]}>
                                <Text style={styles.groupBadgeText}>{muscleGroup}</Text>
                              </View>
                            ) : null}
                          </View>

                          <View style={styles.metricsRow}>
                            <View style={styles.metricBadge}>
                              <Text style={styles.metricText}>Sets: {exerciseInPlan.sets ?? "-"}</Text>
                            </View>
                            <View style={styles.metricBadge}>
                              <Text style={styles.metricText}>Reps: {exerciseInPlan.reps ?? "-"}</Text>
                            </View>
                            <View style={styles.metricBadge}>
                              <Text style={styles.metricText}>
                                Gewicht: {exerciseInPlan.weight_kg ? `${exerciseInPlan.weight_kg} kg` : "-"}
                              </Text>
                            </View>
                            <View style={styles.metricBadge}>
                              <Text style={styles.metricText}>Rust: {exerciseInPlan.rest_seconds ?? 0} sec</Text>
                            </View>
                          </View>

                          {exerciseInPlan.notes ? <Text style={styles.noteText}>Notitie: {exerciseInPlan.notes}</Text> : null}
                        </View>
                      );
                    })
                  )}
                </View>
              </View>
            );
          })
        )}

        <View style={styles.footer} fixed>
          {coachLogoUrl ? (
            <Image src={coachLogoUrl} alt="coach logo" />
          ) : (
            <Text style={styles.footerText}>CoachPlate - Trainingsschema export</Text>
          )}
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber}/${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}