import type { BadgeProps } from "@radix-ui/themes";

export function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

// status is a list of boolean flags (e.g. [{ key: "Due", value: true }]) —
// show whichever flags are actually set.
export function statusLabel(status: { key: string; value: boolean }[]) {
  const active = status.filter((flag) => flag.value).map((flag) => flag.key);
  return active.length > 0 ? active.join(", ") : "—";
}

// Keys observed so far: Due, Overdue, Paid — mapped to their usual
// semantic colors. Anything unrecognized (or no active flag) falls back to
// gray rather than guessing.
const STATUS_COLORS: Record<string, BadgeProps["color"]> = {
  Paid: "green",
  Due: "amber",
  Overdue: "red",
};

export function statusColor(
  status: { key: string; value: boolean }[]
): BadgeProps["color"] {
  const active = status.find((flag) => flag.value)?.key;
  return (active && STATUS_COLORS[active]) || "gray";
}
