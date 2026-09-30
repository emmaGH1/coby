import test from 'node:test';
import assert from 'node:assert/strict';
import { DemoClock } from '../src/domain/clock';
import { isFromEarlierDay, selectHomeItems } from '../src/domain/ranking';
import { applyItemEdit } from '../src/domain/itemActions';
import type { CobyItem } from '../src/domain/types';

function item(id: string, due: Date | null): CobyItem {
  return { id, title: `Sample ${id}`, sourceText: 'sample', sourceFragment: 'sample', kind: 'task', dueAt: due?.toISOString() ?? null, dueDate: null, durationMinutes: null, explicitPriority: null, confidence: 1, needsClarification: false, clarificationQuestion: null, createdAt: new Date(2026, 8, 29, 10).toISOString(), status: 'planned', commitmentMode: 'none', completedAt: null };
}

test('prior local days leave NOW/NEXT but stay held for review, including date-only items', () => {
  const clock = new DemoClock(new Date(2026, 9, 1, 0, 5));
  const prior = item('prior', new Date(2026, 8, 30, 17));
  const dateOnly = { ...item('date', null), dueDate: '2026-09-30' };
  const today = item('today', new Date(2026, 9, 1, 12));
  const home = selectHomeItems([prior, dateOnly, today, item('held', null)], clock);
  assert.equal(home.now?.item.id, 'today');
  assert.deepEqual(home.next.map(r => r.item.id), ['held']);
  assert.deepEqual(home.earlier.map(r => r.id), ['prior', 'date']);
  assert.equal(prior.status, 'planned');
  assert.equal(dateOnly.dueAt, null);
});

test('crossing local midnight moves unfinished obligations to review without storage mutation', () => {
  const clock = new DemoClock(new Date(2026, 8, 30, 23, 59));
  const missed = item('missed', new Date(2026, 8, 30, 17));
  assert.equal(selectHomeItems([missed], clock).now?.item.id, 'missed');
  clock.advanceMinutes(2);
  const home = selectHomeItems([missed], clock);
  assert.equal(home.now, undefined);
  assert.deepEqual(home.next, []);
  assert.equal(home.earlier.length, 1);
  assert.equal(missed.status, 'planned');
});

test('rescheduling an earlier item returns it to today; completed/archived never enter review', () => {
  const clock = new DemoClock(new Date(2026, 9, 1, 10));
  const earlier = item('earlier', new Date(2026, 8, 30, 17));
  const changed = applyItemEdit(earlier, { ...earlier, dueAt: new Date(2026, 9, 1, 18).toISOString(), dueDate: '2026-10-01' });
  const home = selectHomeItems([changed, { ...earlier, id: 'done', status: 'completed' }, { ...earlier, id: 'archive', status: 'archived' }], clock);
  assert.equal(home.now?.item.id, earlier.id);
  assert.deepEqual(home.earlier, []);
  assert.equal(isFromEarlierDay(item('unknown', null), clock), false);
  assert.equal(isFromEarlierDay({ ...earlier, dueAt: 'invalid' }, clock), false);
});

test('recovery preserves the one NOW/two NEXT limit and active current-day work', () => {
  const clock = new DemoClock(new Date(2026, 9, 1, 10));
  const tasks = Array.from({ length: 5 }, (_, index) => item(String(index), new Date(2026, 9, 1, 12 + index)));
  tasks[4].status = 'active';
  const home = selectHomeItems(tasks, clock);
  assert.equal(home.now?.item.id, '4');
  assert.equal(home.next.length, 2);
  assert.equal(home.earlier.length, 0);
});
