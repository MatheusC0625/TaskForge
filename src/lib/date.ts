export function formatDueDate(dueDate: string | Date) {
  const date = new Date(dueDate);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function isOverdue(dueDate: string | Date) {
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
