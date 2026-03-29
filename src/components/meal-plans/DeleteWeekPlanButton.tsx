"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteWeekPlanButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/meal-plans/${id}`, { method: "DELETE" });

      if (!response.ok) {
        console.error("Failed to delete week plan", await response.text());
        return;
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Zeker?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
        >
          {isDeleting ? "Verwijderen..." : "Ja"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isDeleting}
          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
        >
          Nee
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-gray-300 hover:text-red-400 p-2 rounded-lg hover:bg-red-50 transition-colors"
    >
      <Trash2 size={14} />
    </button>
  );
}
