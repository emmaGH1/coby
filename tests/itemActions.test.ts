import test from 'node:test';
import assert from 'node:assert/strict';
import { applyItemEdit, leaveFocusItem } from '../src/domain/itemActions';
import { correctReceipt, receiptFields } from '../src/domain/receipt';
import { planNudges } from '../src/domain/nudges';
import { DemoClock } from '../src/domain/clock';
import type { CobyItem } from '../src/domain/types';

const original: CobyItem = {
  id: 'synthetic-edit', title: 'Collect parcel', kind: 'task',
  sourceFragment: 'collect parcel', sourceText: 'Remember to collect parcel',
  createdAt: '2026-09-30T08:00:00Z', dueDate: '2026-09-30',
  dueAt: '2026-09-30T16:00:00Z', durationMinutes: 20,
  status: 'captured', commitmentMode: 'gentle', completedAt: null,
  explicitPriority: 'important', confidence: 0.9,
  needsClarification: false, clarificationQuestion: null,
};

test('staged reminder correction commits with details without changing the original', () => {
  const changed = applyItemEdit(original, { ...original, title: 'Corrected parcel' }, 'persistent');
  assert.equal(changed.title, 'Corrected parcel');
  assert.equal(changed.commitmentMode, 'persistent');
  assert.equal(original.title, 'Collect parcel');
  assert.equal(original.commitmentMode, 'gentle');
});

test('changing mode clears postponed timing but saving unchanged mode retains it', () => {
  const postponed = { ...original, reminderAt: '2026-09-30T14:00:00Z' };
  assert.equal(applyItemEdit(postponed, original, 'gentle').reminderAt, postponed.reminderAt);
  const off = applyItemEdit(postponed, original, 'none');
  assert.equal(off.commitmentMode, 'none');
  assert.equal(off.reminderAt, null);
  assert.deepEqual(planNudges(off, new DemoClock(new Date('2026-09-30T08:00:00Z'))), []);
});

test('clearing explicit timing through the editor also disables its staged reminder', () => {
  const changed = applyItemEdit(original, { ...original, dueAt: null, dueDate: null }, 'persistent');
  assert.equal(changed.commitmentMode, 'none');
  assert.equal(changed.reminderAt, null);
});

test('saved corrections retain identity, capture history, commitment and lifecycle', () => {
  const corrected = { ...original, title: 'Collect package', kind: 'reminder' as const,
    sourceFragment: 'replacement', explicitPriority: null, confidence: 1 };
  const result = applyItemEdit(original, corrected);
  assert.equal(result.title, 'Collect package');
  assert.equal(result.kind, 'reminder');
  for (const key of ['id', 'sourceText', 'sourceFragment', 'createdAt', 'status',
    'commitmentMode', 'completedAt', 'explicitPriority', 'confidence'] as const) {
    assert.equal(result[key], original[key]);
  }
  assert.equal(original.title, 'Collect parcel');
});

test('editing local date/time shifts nudges and preserves the same saved item', () => {
  const fields = receiptFields(original);
  const corrected = correctReceipt(original, { ...fields, time: '19:30' }).item!;
  assert.ok(corrected);
  const changed = applyItemEdit(original, corrected);
  assert.equal(receiptFields(changed).time, '19:30');
  assert.equal(changed.id, original.id);
  const clock = new DemoClock(new Date('2026-09-30T00:00:00Z'));
  const before = planNudges(original, clock);
  const after = planNudges(changed, clock);
  assert.equal(before.length, 1);
  assert.equal(after.length, 1);
  assert.equal(after[0].at.getTime() - before[0].at.getTime(),
    new Date(changed.dueAt!).getTime() - new Date(original.dueAt!).getTime());
});

test('clearing timing removes the deadline and nudges; invalid corrections are rejected', () => {
  const fields = receiptFields(original);
  assert.equal(correctReceipt(original, { ...fields, time: '29:00' }).item, null);
  const cleared = applyItemEdit(original, correctReceipt(original,
    { ...fields, date: '', time: '', duration: '' }).item!);
  assert.equal(cleared.dueAt, null);
  assert.equal(cleared.dueDate, null);
  assert.equal(cleared.durationMinutes, null);
  assert.deepEqual(planNudges(cleared, new DemoClock(new Date(original.createdAt))), []);
});

test('leaving accidental focus restores the previous held status without completion', () => {
  const active = { ...original, status: 'active' as const };
  for (const previous of ['captured', 'planned'] as const) {
    assert.deepEqual(leaveFocusItem(active, previous), { ...original, status: previous });
  }
  assert.equal(leaveFocusItem(active, 'active').status, 'planned');
  assert.equal(active.status, 'active');
});
