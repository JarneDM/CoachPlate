export type TrainingPlan = {
  id: string;
  name: string;
  // description: string;
  coach_id: string;
  created_at: string;
  // updated_at: string;
  client: {
    id: string;
    full_name: string;
  } | null;
};

export interface Exercise {
  id: string;
  name: string;
  muscle_group?: string | null;
  category?: string | null;
  equipment?: string | null;
  difficulty?: string | null;
}

export interface Props {
  exercises: Exercise[];
  onSelect: (data: { exerciseId: string; sets: number; reps: number; weightKg?: number; restSeconds?: number; notes?: string }) => void;
  onClose: () => void;
}