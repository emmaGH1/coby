import test from 'node:test';
import assert from 'node:assert/strict';
import { DemoClock } from '../src/domain/clock';
import { dueText } from '../src/domain/dateText';

test('readable dates use the supplied local clock and retain explicit time', () => {
  const clock = new DemoClock(new Date(2026, 9, 1, 9));
  assert.equal(dueText({ dueAt: new Date(2026, 9, 1, 17).toISOString(), dueDate: null }, clock), 'Today, 5:00 PM');
  assert.equal(dueText({ dueAt: null, dueDate: '2026-10-02' }, clock), 'Tomorrow');
  assert.equal(dueText({ dueAt: null, dueDate: '2026-10-03' }, clock), 'Sat 3 Oct');
  assert.equal(dueText({ dueAt: null, dueDate: '2027-10-03' }, clock), '3 Oct 2027');
});

test('date-only items do not gain a time and relative dates refresh across midnight', () => {
  const clock = new DemoClock(new Date(2026, 11, 31, 23, 59));
  const item = { dueAt: null, dueDate: '2027-01-01' };
  assert.equal(dueText(item, clock), 'Tomorrow');
  clock.advanceMinutes(2);
  assert.equal(dueText(item, clock), 'Today');
});

test('unknown and malformed date values do not claim a date', () => {
  const clock = new DemoClock(new Date(2026, 9, 1));
  assert.equal(dueText({ dueAt: null, dueDate: null }, clock), '');
  assert.equal(dueText({ dueAt: 'not-a-date', dueDate: null }, clock), '');
});
