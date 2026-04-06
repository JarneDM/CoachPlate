"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscle_group?: string | null;
  category?: string | null;
}

interface ExerciseTrainingPlan {
  id: number;
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  rest_seconds: number | null;
  notes: string | null;
  order_index: number | null;
  exercises: Exercise;
}

interface Day {
  id: string;
  day_number: number;
  name: string | null;
  exercises_trainingplans: ExerciseTrainingPlan[];
}

const MUSCLE_GROUP_COLORS: Record<string, string> = {
  borst: "bg-red-50 text-red-600",
  rug: "bg-blue-50 text-blue-600",
  schouders: "bg-purple-50 text-purple-600",
  benen: "bg-green-50 text-green-600",
  armen: "bg-orange-50 text-orange-600",
  core: "bg-yellow-50 text-yellow-600",
  cardio: "bg-pink-50 text-pink-600",
};

export default function ClientTrainingDays({ days }: { days: Day[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {days.map((day) => (
        <DayCard key={day.id} day={day} />
      ))}
    </div>
  );
}

function DayCard({ day }: { day: Day }) {
  const sortedExercises = [...day.exercises_trainingplans].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Dag {day.day_number}
            </span>
            <h3 className="font-semibold text-gray-900 mt-0.5">
              {day.name ?? `Dag ${day.day_number}`}
            </h3>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            {sortedExercises.length} oefeningen
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 p-3">
        {sortedExercises.length === 0 ? (
          <p className="text-xs text-gray-300 text-center py-6">Geen oefeningen gepland.</p>
        ) : (
          sortedExercises.map((etp) => <ExerciseRow key={etp.id} etp={etp} />)
        )}
      </div>
    </div>
  );
}

function ExerciseRow({ etp }: { etp: ExerciseTrainingPlan }) {
  const [expanded, setExpanded] = useState(false);
  const muscleColor =
    MUSCLE_GROUP_COLORS[etp.exercises.muscle_group?.toLowerCase() ?? ""] ?? "bg-gray-50 text-gray-600";

  return (
    <div
      className={`rounded-lg border transition-all ${
        expanded ? "border-green-200 bg-green-50/30" : "border-gray-100 bg-gray-50"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-2.5 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{etp.exercises.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {etp.exercises.muscle_group && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${muscleColor}`}>
                {etp.exercises.muscle_group}
              </span>
            )}
            {etp.sets && etp.reps && (
              <span className="text-xs text-gray-400">
                {etp.sets}×{etp.reps}
              </span>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={13} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={13} className="text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-2.5 pb-2.5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {etp.sets != null && (
              <div className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-0.5">Sets</p>
                <p className="text-sm font-semibold text-gray-800">{etp.sets}</p>
              </div>
            )}
            {etp.reps != null && (
              <div className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-0.5">Reps</p>
                <p className="text-sm font-semibold text-gray-800">{etp.reps}</p>
              </div>
            )}
            {etp.weight_kg != null && etp.weight_kg > 0 && (
              <div className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-0.5">KG</p>
                <p className="text-sm font-semibold text-gray-800">{etp.weight_kg}</p>
              </div>
            )}
            {etp.rest_seconds != null && etp.rest_seconds > 0 && (
              <div className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-0.5">Rust</p>
                <p className="text-sm font-semibold text-gray-800">{etp.rest_seconds}s</p>
              </div>
            )}
          </div>
          {etp.notes && (
            <p className="text-xs text-gray-500 italic mt-2 px-1">{etp.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
