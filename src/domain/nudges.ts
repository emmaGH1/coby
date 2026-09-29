import type { Clock } from './clock';
import type { CobyItem } from './types';

export type Nudge = { at: Date; kind: 'comfortable' | 'latest'; body: string };

export function planNudges(item: CobyItem, clock: Clock): Nudge[] {
  if (!item.dueAt || item.status === 'completed' || item.status === 'archived') return [];
  if (item.commitmentMode === 'none' || item.commitmentMode === 'locked') return [];
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
  return points.filter((point) => point.at.getTime() > clock.now().getTime()).slice(0, 2);
}
