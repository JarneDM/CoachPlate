export function getWeekRangeFromOffset(weekOffset = 0) {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);

  monday.setDate(now.getDate() - day + 1 + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: monday.toISOString().split("T")[0],
    to: sunday.toISOString().split("T")[0],
    label: `${monday.toLocaleDateString("nl-BE", { day: "numeric", month: "short" })} - ${sunday.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "short",
    })}`,
  };
}

export function parseWeekOffset(value?: string | number | null) {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}