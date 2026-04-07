export function formatDateTime(value) {
  if (!value) return "Unavailable";
  return new Date(value).toLocaleString();
}

export function roleBadge(role) {
  return role === "admin" ? "bg-dawn/20 text-dawn" : "bg-moss/20 text-emerald-300";
}
