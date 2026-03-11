export function formatDateForInput(date?: string) {
  if (!date) return "";
  return date.slice(0, 10);
}

export function valueOrEmpty(value: string | number | null | undefined) {
  return value ?? "";
}