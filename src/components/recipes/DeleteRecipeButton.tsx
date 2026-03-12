"use client";

import { deleteRecipeAction } from "@/app/services/recipes/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash } from "lucide-react";

export default function DeleteRecipeButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    await deleteRecipeAction(id);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Zeker?</span>
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Ja
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Nee
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-gray-300 hover:text-red-400 transition-colors"
    >
      <Trash className="w-4 h-4 text-red-500" />
    </button>
  );
}
