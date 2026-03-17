import React from 'react'
import { getTrainingPlans } from '@/app/services/trainingplans/getTrainingPlans';
import { TrainingPlan } from '@/types/training-plans';

async function TrainingPlans() {
  const response = await getTrainingPlans();
  const trainingPlans: TrainingPlan[] = response || [];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Training Schema{"'"}s</h1>
      <p className="text-gray-400 text-sm mt-1">
        {trainingPlans.length} plannen aangemaakt
      </p>
    </div>
  )
}

export default TrainingPlans
