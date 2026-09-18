export function formatRand(amount: number, opts?: { signed?: boolean }): string {
  const abs = Math.abs(amount);
  const body = abs.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = opts?.signed ? (amount < 0 ? "- " : "+ ") : amount < 0 ? "- " : "";
  return `${sign}R ${body}`;
}

export function formatDateLong(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export function formatMonth(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}
