export function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export function formatBudget(budget: number, type: "fixed" | "hourly"): string {
  const formatted = `MK ${budget.toLocaleString()}`;
  return type === "hourly" ? `${formatted}/hr` : formatted;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-MW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
