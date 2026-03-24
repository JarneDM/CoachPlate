"use client";

import { useState } from "react";
import { Search, X, Dumbbell, Plus } from "lucide-react";
import { createExercise } from "@/app/services/training-plans/builder-actions";
import { Props, Exercise } from "../../types/training-plans";

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Legs", "Glutes", "Triceps", "Biceps", "Core", "Cardio"];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-50 text-green-600",
  intermediate: "bg-yellow-50 text-yellow-600",
  advanced: "bg-red-50 text-red-600",
};

export default function ExercisePicker({ exercises, onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("");
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const [rest, setRest] = useState(60);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMuscle, setNewMuscle] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = exercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || (e.muscle_group?.toLowerCase().includes(search.toLowerCase()) ?? false) || (e.category?.toLowerCase().includes(search.toLowerCase()) ?? false);
    
    const matchesMuscle =
      !muscleFilter ||
      e.muscle_group?.toLowerCase() === muscleFilter.toLowerCase();
    return matchesSearch && matchesMuscle;
  });

  async function handleCreateExercise() {
    if (!newName) return;
    setCreating(true);

    const result = await createExercise({
      name: newName,
      muscle_group: newMuscle || undefined,
    });

    if (result.exercise) {
      setSelected(result.exercise);
      setShowNewForm(false);
      setNewName("");
      setNewMuscle("");
    }

    setCreating(false);
  }

  function handleConfirm() {
    if (!selected) return;
    onSelect({
      exerciseId: selected.id,
      sets,
      reps,
      weightKg: weight > 0 ? weight : undefined,
      restSeconds: rest > 0 ? rest : undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[85vh]">

        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h3 className="font-semibold text-gray-900">Oefening toevoegen</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 space-y-3 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Zoek oefening... bv. Full Body"
              autoFocus
              className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setMuscleFilter("")}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                !muscleFilter
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-200 text-gray-500 hover:border-green-300"
              }`}
            >
              Alle
            </button>
            {MUSCLE_GROUPS.map(mg => (
              <button
                key={mg}
                onClick={() => setMuscleFilter(mg === muscleFilter ? "" : mg)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  muscleFilter === mg
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-200 text-gray-500 hover:border-green-300"
                }`}
              >
                {mg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map(exercise => (
              <button
                key={exercise.id}
                onClick={() => setSelected(exercise)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 mb-1 ${
                  selected?.id === exercise.id
                    ? "bg-green-50 border border-green-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Dumbbell size={14} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {exercise.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {exercise.muscle_group && (
                      <span className="text-xs text-gray-400">
                        {exercise.muscle_group}
                      </span>
                    )}
                    {exercise.difficulty && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        DIFFICULTY_COLORS[exercise.difficulty.toLowerCase()] ?? "bg-gray-50 text-gray-600"
                      }`}>
                        {exercise.difficulty}
                      </span>
                    )}
                  </div>
                </div>
                {selected?.id === exercise.id && (
                  <div className="w-4 h-4 bg-green-500 rounded-full shrink-0 flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-3">
                {exercises.length === 0
                  ? "Nog geen oefeningen aangemaakt"
                  : "Geen oefeningen gevonden"}
              </p>
              <button
                onClick={() => setShowNewForm(true)}
                className="text-sm text-green-600 hover:underline"
              >
                Nieuwe oefening aanmaken
              </button>
            </div>
          )}

          {!showNewForm ? (
            <button
              onClick={() => setShowNewForm(true)}
              className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-green-600 py-3 border border-dashed border-gray-200 hover:border-green-300 rounded-lg transition-colors mt-2"
            >
              <Plus size={12} />
              Nieuwe oefening aanmaken
            </button>
          ) : (
            <div className="border border-green-200 bg-green-50/30 rounded-lg p-3 mt-2 space-y-2">
              <p className="text-xs font-medium text-gray-700">Nieuwe oefening</p>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Naam van de oefening"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={newMuscle}
                onChange={e => setNewMuscle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Spiergroep (optioneel)</option>
                {MUSCLE_GROUPS.map(mg => (
                  <option key={mg} value={mg}>{mg}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewForm(false)}
                  className="flex-1 text-xs text-gray-500 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Annuleer
                </button>
                <button
                  onClick={handleCreateExercise}
                  disabled={!newName || creating}
                  className="flex-1 text-xs text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 py-2 rounded-lg transition-colors"
                >
                  {creating ? "Aanmaken..." : "Aanmaken"}
                </button>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl shrink-0 space-y-3">
            <p className="text-xs font-medium text-gray-600">
              {selected.name} instellen
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Sets", value: sets, set: setSets, min: 1, step: 1 },
                { label: "Reps", value: reps, set: setReps, min: 1, step: 1 },
                { label: "Kg", value: weight, set: setWeight, min: 0, step: 2.5 },
                { label: "Rust (s)", value: rest, set: setRest, min: 0, step: 15 },
              ].map(({ label, value, set, min, step }) => (
                <div key={label} className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => set(Math.max(min, value - step))}
                      className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-xs flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-gray-800 w-8 text-center">
                      {value}
                    </span>
                    <button
                      onClick={() => set(value + step)}
                      className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Toevoegen aan dag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}