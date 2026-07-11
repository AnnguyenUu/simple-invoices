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

export function statusLabel(status: { key: string; value: boolean }[]) {
  const active = status.filter((flag) => flag.value).map((flag) => flag.key);
  return active.length > 0 ? active.join(", ") : "—";
}

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
