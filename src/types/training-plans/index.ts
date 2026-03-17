export type TrainingPlan = {
  id: string;
  name: string;
  // description: string;
  coach_id: string;
  // created_at: string;
  // updated_at: string;
  clients: {
    id: string;
    full_name: string;
  }[];
}