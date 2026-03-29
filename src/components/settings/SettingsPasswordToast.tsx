"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  saved?: string;
  error?: string;
};

export default function SettingsPasswordToast({ saved, error }: Props) {
  useEffect(() => {
    if (saved === "password") {
      toast.success("Wachtwoord succesvol aangepast.");
      return;
    }

    if (!error) return;

    const lowerError = error.toLowerCase();
    if (lowerError.includes("wachtwoord")) {
      toast.error(error);
    }
  }, [saved, error]);

  return null;
}