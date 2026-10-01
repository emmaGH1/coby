import type { CobyItem, ItemStatus, ParsedItem } from './types';
import type { Clock } from './clock';

export function initialCommitment(item: ParsedItem, clock: Clock): 'gentle' | 'none' {
  return item.dueAt && Date.parse(item.dueAt) > clock.now().getTime() ? 'gentle' : 'none';
}

// A correction updates the held item, retaining its identity and capture history.
export function applyItemEdit(item: CobyItem, corrected: ParsedItem): CobyItem {
  return {
    ...item,
    title: corrected.title, kind: corrected.kind,
    dueDate: corrected.dueDate, dueAt: corrected.dueAt,
    durationMinutes: corrected.durationMinutes,
    needsClarification: corrected.needsClarification,
    clarificationQuestion: corrected.clarificationQuestion,
    reminderAt: corrected.dueAt === item.dueAt ? item.reminderAt : null,
  };
}

export function leaveFocusItem(item: CobyItem, previousStatus: ItemStatus): CobyItem {
  return { ...item, status: previousStatus === 'active' ? 'planned' : previousStatus };
}
