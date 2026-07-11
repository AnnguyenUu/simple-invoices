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
