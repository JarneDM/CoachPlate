"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label: string;
  pendingLabel: string;
  className?: string;
};

export default function SettingsSubmitButton({ label, pendingLabel, className = "" }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${className} ${pending ? "cursor-not-allowed opacity-70" : ""}`.trim()}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}