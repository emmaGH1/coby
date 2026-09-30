import assert from 'node:assert/strict';
import test from 'node:test';
import { DemoClock } from '../src/domain/clock';
import { planNudges, postponeNudge, REMINDER_DELAYS } from '../src/domain/nudges';
import { applyItemEdit } from '../src/domain/itemActions';
import type { CobyItem } from '../src/domain/types';

const clock = new DemoClock(new Date('2026-09-30T17:00:00Z'));
const item: CobyItem = { id: 'sample', title: 'Sample errand', sourceText: 'Sample errand', sourceFragment: 'Sample errand',
  kind: 'task', dueDate: '2026-09-30', dueAt: '2026-09-30T17:20:00Z', durationMinutes: null,
  explicitPriority: null, confidence: 1, needsClarification: false, clarificationQuestion: null,
  createdAt: '2026-09-30T16:00:00Z', status: 'planned', commitmentMode: 'gentle', completedAt: null };

test('all quick delays create one reminder and preserve the actual deadline', () => {
  for (const minutes of REMINDER_DELAYS) {
    const postponed = postponeNudge(item, minutes, clock, `request-${minutes}`)!;
    assert.equal(postponed.dueAt, item.dueAt);
    assert.equal(postponed.durationMinutes, null);
    const nudges = planNudges(postponed, clock);
    assert.equal(nudges.length, 1);
    assert.equal(nudges[0].kind, 'snoozed');
    assert.equal(nudges[0].at.getTime() - clock.now().getTime(), minutes * 60_000);
  }
});

test('duplicate notification delivery cannot postpone the same reminder twice', () => {
  const postponed = postponeNudge(item, 15, clock, 'same-response')!;
  assert.equal(postponeNudge(postponed, 15, clock, 'same-response'), null);
});

test('stale actions cannot revive completed, archived or disabled reminders', () => {
  for (const changed of [{ ...item, status: 'completed' as const }, { ...item, status: 'archived' as const },
    { ...item, commitmentMode: 'none' as const }, { ...item, dueAt: null }]) {
    assert.equal(postponeNudge(changed, 15, clock, 'stale'), null);
  }
  assert.equal(postponeNudge(item, 999, clock, 'unsupported'), null);
});

test('changing the deadline clears a postponed reminder; a title edit preserves it', () => {
  const postponed = postponeNudge(item, 30, clock, 'edit')!;
  assert.equal(applyItemEdit(postponed, { ...postponed, title: 'Corrected title' }).reminderAt, postponed.reminderAt);
  const edited = applyItemEdit(postponed, { ...postponed, dueAt: '2026-09-30T18:00:00Z' });
  assert.equal(edited.reminderAt, null);
  assert.notEqual(planNudges(edited, clock)[0].kind, 'snoozed');
});

test('completing an item cancels even an explicitly postponed reminder', () => {
  const postponed = postponeNudge(item, 60, clock, 'complete')!;
  assert.deepEqual(planNudges({ ...postponed, status: 'completed' }, clock), []);
});
