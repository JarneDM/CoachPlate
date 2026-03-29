"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";

export default function DeleteTrainingPlanButton({ id }: { id: string }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
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
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openConfirm]);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/training-plans/${id}`, { method: "DELETE" });

      if (!response.ok) {
        console.error("Failed to delete training plan", await response.text());
        return;
      }

      setOpenConfirm(false);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpenConfirm((prev) => !prev)}
        className="text-gray-300 hover:text-red-400 p-2 rounded-lg hover:bg-red-50 transition-colors"
        aria-label="Verwijder trainingsschema"
      >
        <Trash2 size={14} />
      </button>

      {openConfirm && (
        <div className="absolute bottom-9 right-0 w-64 rounded-xl border border-gray-200 bg-white shadow-lg p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 rounded-full bg-red-50 p-1.5">
              <TriangleAlert size={14} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Schema verwijderen?</p>
              <p className="text-xs text-gray-500 mt-0.5">Deze actie kan je niet ongedaan maken.</p>
            </div>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenConfirm(false)}
              disabled={isDeleting}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isDeleting ? <Loader2 size={12} className="animate-spin" /> : null}
              {isDeleting ? "Verwijderen..." : "Verwijderen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
