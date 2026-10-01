import type { Clock } from './clock';

export function dueText(item: { dueAt: string | null; dueDate: string | null }, clock: Clock): string {
  const date = item.dueAt ? new Date(item.dueAt) : item.dueDate ? new Date(`${item.dueDate}T12:00:00`) : null;
  if (!date || !Number.isFinite(date.getTime())) return '';
  const today = clock.now();
  const tomorrow = clock.now(); tomorrow.setDate(tomorrow.getDate() + 1);
  let label: string;
  if (date.toDateString() === today.toDateString()) label = 'Today';
  else if (date.toDateString() === tomorrow.toDateString()) label = 'Tomorrow';
  else label = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short',
    ...(date.getFullYear() === today.getFullYear() ? { weekday: 'short' as const } : { year: 'numeric' as const }) }).format(date);
  if (item.dueAt) label += `, ${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date)}`;
  return label;
}
