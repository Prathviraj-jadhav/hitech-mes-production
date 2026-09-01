// Deterministic date formatting utilities
// Always uses Asia/Kolkata timezone to prevent hydration mismatches

const TZ = "Asia/Kolkata";

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

export function formatTimeSec(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: TZ,
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

export function formatDateTimeFull(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    timeZone: TZ,
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: TZ,
  });
}

export function formatDateYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    timeZone: TZ,
  });
}

export function formatDateWeekday(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    weekday: "short",
    timeZone: TZ,
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: TZ,
  });
}

// ISO format for display (no locale issues)
export function formatISO(iso: string): string {
  return new Date(iso).toISOString();
}
