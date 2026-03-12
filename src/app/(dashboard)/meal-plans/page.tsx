import { getMealPlans } from "@/app/services/coaches/mealplans/getMealPlans";
import React from "react";
import Link from "next/link";

async function MealPlans() {
  let mealplans: Awaited<ReturnType<typeof getMealPlans>> = [];
  mealplans = await getMealPlans();
  return (
    <div>
      <h1>Meal Plans</h1>
      <p>Welkom bij de meal plans!</p>
      <div>
        {mealplans && mealplans.length > 0 ? (
          mealplans.map((plan) => (
            <div key={plan.id}>
              <h2>{plan.name}</h2>
              <p>Client: {plan.clients.full_name}</p>
              <p>Start Date: {plan.start_date}</p>
              <p>End Date: {plan.end_date}</p>
            </div>
          ))
        ) : (
          <div>
            <p>Geen meal plans gevonden.</p>
            <Link href="/meal-plans/new">Create Meal Plan</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealPlans;
