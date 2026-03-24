"use client";

import { useState, useTransition } from "react";
import { Plus, X, ChevronDown, ChevronUp, Timer, Repeat } from "lucide-react";
import { updateExercise } from "@/app/services/training-plans/builder-actions";

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

interface Props {
  day: Day;
  planId: string;
  onAddExercise: () => void;
  onRemoveExercise: (id: number) => void;
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

export default function DayCard({ day, planId, onAddExercise, onRemoveExercise }: Props) {
  const sortedExercises = [...day.exercises_trainingplans].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  return (
    <div className="bg-white rounded-xl border border-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Dag {day.day_number}</span>
            <h3 className="font-semibold text-gray-900 mt-0.5">{day.name ?? `Dag ${day.day_number}`}</h3>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{sortedExercises.length} oefeningen</span>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-2">
        {sortedExercises.map((etp) => (
          <ExerciseRow key={etp.id} etp={etp} planId={planId} onRemove={() => onRemoveExercise(etp.id)} />
        ))}

        {sortedExercises.length === 0 && (
          <button
            onClick={onAddExercise}
            className="w-full text-xs text-gray-300 hover:text-green-400 text-center py-6 border border-dashed border-gray-200 rounded-lg hover:border-green-300 transition-colors"
          >
            + oefening toevoegen
          </button>
        )}
      </div>

      {sortedExercises.length > 0 && (
        <div className="p-3 border-t border-gray-50">
          <button
            onClick={onAddExercise}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-green-600 hover:bg-green-50 py-2 rounded-lg transition-colors"
          >
            <Plus size={12} />
            Oefening toevoegen
          </button>
        </div>
      )}
    </div>
  );
}

function ExerciseRow({ etp, planId, onRemove }: { etp: ExerciseTrainingPlan; planId: string; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [sets, setSets] = useState(etp.sets ?? 3);
  const [reps, setReps] = useState(etp.reps ?? 10);
  const [weight, setWeight] = useState(etp.weight_kg ?? 0);
  const [rest, setRest] = useState(etp.rest_seconds ?? 60);
  const [isPending, startTransition] = useTransition();

  const muscleColor = MUSCLE_GROUP_COLORS[etp.exercises.muscle_group?.toLowerCase() ?? ""] ?? "bg-gray-50 text-gray-600";

  function handleUpdate(field: string, value: number) {
    startTransition(async () => {
      await updateExercise(etp.id, { [field]: value }, planId);
    });
  }

  return (
    <div className={`rounded-lg border transition-all ${expanded ? "border-green-200 bg-green-50/30" : "border-gray-100 bg-gray-50"}`}>
      <div className="flex items-center gap-2 p-2.5">
        <button onClick={() => setExpanded(!expanded)} className="flex-1 flex items-center gap-2 text-left min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{etp.exercises.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {etp.exercises.muscle_group && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${muscleColor}`}>{etp.exercises.muscle_group}</span>
              )}
              <span className="text-xs text-gray-400">
                {sets}×{reps}
                {weight > 0 && ` @ ${weight}kg`}
              </span>
            </div>
          </div>
          {expanded ? (
            <ChevronUp size={13} className="text-gray-400 shrink-0" />
          ) : (
            <ChevronDown size={13} className="text-gray-400 shrink-0" />
          )}
        </button>
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
          <X size={13} />
        </button>
      </div>

      {expanded && (
        <div className="px-2.5 pb-2.5 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Sets"
              value={sets}
              onChange={(v) => {
                setSets(v);
                handleUpdate("sets", v);
              }}
              min={1}
            />
            <NumberInput
              label="Reps"
              value={reps}
              onChange={(v) => {
                setReps(v);
                handleUpdate("reps", v);
              }}
              min={1}
            />
            <NumberInput
              label="Gewicht (kg)"
              value={weight}
              onChange={(v) => {
                setWeight(v);
                handleUpdate("weight_kg", v);
              }}
              min={0}
              step={2.5}
            />
            <NumberInput
              label="Rust (sec)"
              value={rest}
              onChange={(v) => {
                setRest(v);
                handleUpdate("rest_seconds", v);
              }}
              min={0}
              step={15}
            />
          </div>

          {isPending && <p className="text-xs text-gray-400 text-center">Opslaan...</p>}
        </div>
      )}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="bg-white rounded-lg p-2 border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xs transition-colors"
        >
          −
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-gray-800">{value}</span>
        <button
          onClick={() => onChange(value + step)}
          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xs transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
