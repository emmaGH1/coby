import type { Clock } from './clock';

export function calendarWeek(clock: Clock, weekOffset = 0): Date[] {
  const today = clock.now();
  const mondayOffset = (today.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, offset) => {
    const day = clock.now();
    day.setHours(12, 0, 0, 0);
    day.setDate(day.getDate() - mondayOffset + weekOffset * 7 + offset);
    return day;
  });
}
