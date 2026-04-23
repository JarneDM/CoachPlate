"use client";

import { useState, useTransition } from "react";
import { deleteAppointmentAvailabilityAction } from "@/app/services/appointments/actions";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteAvailabilitySlotButton({ slotId }: { slotId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteAppointmentAvailabilityAction(slotId);
      setRemoved(true);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending || removed}
      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      {removed ? "Verwijderd" : "Verwijderen"}
    </button>
  );
}