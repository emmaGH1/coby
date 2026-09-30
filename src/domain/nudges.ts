import type { Clock } from './clock';
import type { CobyItem } from './types';

export type Nudge = { at: Date; kind: 'comfortable' | 'latest' | 'snoozed'; body: string };

export const REMINDER_DELAYS = [15, 30, 60] as const;

export function postponeNudge(item: CobyItem, minutes: number, clock: Clock, responseId: string): CobyItem | null {
  if (!REMINDER_DELAYS.some((delay) => delay === minutes) || !responseId ||
      item.lastNudgeResponseId === responseId || !item.dueAt ||
      item.status === 'completed' || item.status === 'archived' ||
      item.commitmentMode === 'none' || item.commitmentMode === 'locked') return null;
  const when = clock.now();
  when.setMinutes(when.getMinutes() + minutes);
  return { ...item, reminderAt: when.toISOString(), lastNudgeResponseId: responseId };
}

export function planNudges(item: CobyItem, clock: Clock): Nudge[] {
  if (!item.dueAt || item.status === 'completed' || item.status === 'archived') return [];
  if (item.commitmentMode === 'none' || item.commitmentMode === 'locked') return [];
  if (item.reminderAt) {
    const reminder = new Date(item.reminderAt);
    if (Number.isFinite(reminder.getTime()) && reminder.getTime() > clock.now().getTime()) {
      return [{ at: reminder, kind: 'snoozed', body: 'Checking in, as you asked.' }];
    }
  }
  const due = new Date(item.dueAt).getTime();
  if (!Number.isFinite(due) || due <= clock.now().getTime()) return [];
  const durationKnown = item.durationMinutes !== null;
  const duration = (item.durationMinutes ?? 30) * 60_000;
  const latest = due - duration;
  const comfortable = latest - 30 * 60_000;
  const points: Nudge[] = [
    { at: new Date(comfortable), kind: 'comfortable', body: durationKnown ? 'This is a good time to start.' : 'This is coming up soon.' },
  ];
  if (item.commitmentMode === 'persistent') {
    points.push({ at: new Date(latest), kind: 'latest', body: durationKnown ? 'Start now to finish on time.' : 'This is due soon.' });
  }
  const future = points.filter((point) => point.at.getTime() > clock.now().getTime());
  // A newly enabled reminder must still reach the user when its earlier
  // intervention point has passed. This is a reminder buffer, not a duration
  // estimate, and must never imply that late work can finish on time.
  if (!future.length) {
    const now = clock.now().getTime();
    return [{ at: new Date(now + Math.min(60_000, (due - now) / 2)),
      kind: 'comfortable', body: 'Your deadline is approaching.' }];
  }
  return future.slice(0, 2);
}
