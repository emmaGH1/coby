import type { Clock } from './clock';
import type { CobyItem } from './types';

export type RankedItem = { item: CobyItem; score: number; reasonCodes: string[] };

export function rankItems(items: CobyItem[], clock: Clock): RankedItem[] {
  const now = clock.now().getTime();
  return items
    .filter((item) => item.status !== 'completed' && item.status !== 'archived')
    .map((item) => {
      let score = 5;
      const reasonCodes: string[] = [];
      if (item.status === 'active') { score += 200; reasonCodes.push('active'); }
      if (item.dueAt) {
        const remaining = new Date(item.dueAt).getTime() - now;
        if (remaining < 0) { score += 100; reasonCodes.push('overdue'); }
        else if (item.durationMinutes !== null && remaining <= item.durationMinutes * 60_000) {
          score += 80; reasonCodes.push('latestStart');
        }
        else if (remaining <= 24 * 60 * 60_000) { score += 55; reasonCodes.push('dueSoon'); }
        else if (remaining <= 48 * 60 * 60_000) { score += 30; reasonCodes.push('dueTomorrow'); }
      } else if (item.dueDate) {
        const today = clock.now();
        const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const tomorrow = clock.now(); tomorrow.setDate(tomorrow.getDate() + 1);
        const localTomorrow = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
        if (item.dueDate < localToday) { score += 100; reasonCodes.push('overdueDate'); }
        else if (item.dueDate === localToday) { score += 55; reasonCodes.push('dueTodayDate'); }
        else if (item.dueDate === localTomorrow) { score += 30; reasonCodes.push('dueTomorrowDate'); }
      }
      if (item.explicitPriority === 'urgent') { score += 25; reasonCodes.push('urgent'); }
      if (item.explicitPriority === 'important') { score += 15; reasonCodes.push('important'); }
      if (!reasonCodes.length) reasonCodes.push('held');
      return { item, score, reasonCodes };
    })
    .sort((a, b) => b.score - a.score || a.item.createdAt.localeCompare(b.item.createdAt) || a.item.id.localeCompare(b.item.id));
}

export function reasonText(codes: string[]): string {
  if (codes.includes('active')) return 'You already started this.';
  if (codes.includes('overdue')) return 'Its due time has passed.';
  if (codes.includes('overdueDate')) return 'Its due date has passed.';
  if (codes.includes('latestStart')) return 'This is the latest start to finish on time.';
  if (codes.includes('dueTodayDate')) return 'Due today. No exact time was set.';
  if (codes.includes('dueTomorrowDate')) return 'Due tomorrow. No exact time was set.';
  if (codes.includes('dueSoon')) return 'Due within 24 hours.';
  if (codes.includes('dueTomorrow')) return 'Due within two days.';
  if (codes.includes('urgent')) return 'You marked this urgent.';
  if (codes.includes('important')) return 'You marked this important.';
  return 'Coby is holding this for you.';
}
