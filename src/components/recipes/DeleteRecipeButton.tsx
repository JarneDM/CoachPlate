"use client";

import { deleteRecipeAction } from "@/app/services/recipes/actions";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { Trash2, TriangleAlert, Loader2 } from "lucide-react";

export default function DeleteRecipeButton({ id }: { id: string }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenConfirm(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenConfirm(false);
      }
    }

    if (openConfirm) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [openConfirm]);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteRecipeAction(id);
    setOpenConfirm(false);
    router.refresh();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpenConfirm(!openConfirm)}
        className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
        aria-label="Verwijder recept"
      >
        <Trash2 size={16} />
      </button>

      {openConfirm && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-30 min-w-64">
          <div className="flex gap-3">
            <TriangleAlert size={20} className="text-orange-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">Recept verwijderen?</p>
              <p className="text-xs text-gray-500 mt-1">Dit kan niet ongedaan worden gemaakt.</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <button
              onClick={() => setOpenConfirm(false)}
              disabled={isDeleting}
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verwijderen...
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Verwijderen
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


