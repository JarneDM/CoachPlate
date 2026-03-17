import React from 'react'
import { getTrainingPlans } from '@/app/services/trainingplans/getTrainingPlans';
import { TrainingPlan } from '@/types/training-plans';
import { getExercises } from "@/app/services/trainingplans/getExercises";


async function TrainingPlans() {
  const response = await getTrainingPlans();
  const trainingPlans: TrainingPlan[] = response || [];
  const exercisesRes = await getExercises();
  const exercises = exercisesRes || [];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Training Schema{"'"}s</h1>
      <p className="text-gray-400 text-sm mt-1">{trainingPlans.length} plannen aangemaakt</p>
      <div className="mt-6">
        {exercises.length !== 0 ? (
          exercises.map((exercise) => (
            <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{exercise.name}</h2>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Geen oefeningen gevonden.</p>
        )}
      </div>
    </div>
  );
}

export default TrainingPlans
