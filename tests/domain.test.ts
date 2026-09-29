import assert from 'node:assert/strict';
import test from 'node:test';
import { DemoClock } from '../src/domain/clock';
import { DEMO_DUMP, FixtureBrainDumpParser } from '../src/domain/parser';
import { rankItems } from '../src/domain/ranking';
import type { CobyItem } from '../src/domain/types';

const clock = new DemoClock(new Date('2026-09-29T12:00:00Z'));
const parser = new FixtureBrainDumpParser();

test('fixture recognizes only the explicit demo input', async () => {
  const result = await parser.parse(DEMO_DUMP, { clock, timeZone: 'UTC' });
  assert.equal(result.items.length, 3);
  assert.equal(result.items[2].title, 'Buy data');
  assert.equal(result.items[2].dueAt, null);
  assert.equal(result.items[2].durationMinutes, null);
});

test('other words are held intact without invented details', async () => {
  const result = await parser.parse('I should study operating systems.', { clock, timeZone: 'UTC' });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].title, 'I should study operating systems.');
  assert.equal(result.items[0].dueAt, null);
  assert.equal(result.items[0].durationMinutes, null);
});

function stored(id: string, dueAt: string | null, status: CobyItem['status'] = 'captured'): CobyItem {
  return { id, title: id, sourceText: id, sourceFragment: id, kind: 'task',
    createdAt: id === 'a' ? '2026-09-29T08:00:00Z' : '2026-09-29T09:00:00Z',
    dueAt, durationMinutes: null, explicitPriority: null, confidence: 1,
    needsClarification: false, clarificationQuestion: null, status,
    commitmentMode: 'none', completedAt: null };
}

test('Home ranking favors a deadline and excludes completed items', () => {
  const ranked = rankItems([
    stored('a', null), stored('b', '2026-09-29T20:00:00Z'), stored('c', null, 'completed'),
  ], clock);
  assert.deepEqual(ranked.map(({ item }) => item.id), ['b', 'a']);
  assert.deepEqual(ranked[0].reasonCodes, ['dueSoon']);
});

test('ranking is stable for equal priorities', () => {
  assert.deepEqual(rankItems([stored('b', null), stored('a', null)], clock).map(({ item }) => item.id), ['a', 'b']);
});

test('latest safe start outranks another due-soon item', () => {
  const latest = { ...stored('a', '2026-09-29T12:45:00Z'), durationMinutes: 45 };
  const later = stored('b', '2026-09-29T16:00:00Z');
  const ranked = rankItems([later, latest], clock);
  assert.equal(ranked[0].item.id, 'a');
  assert.deepEqual(ranked[0].reasonCodes, ['latestStart']);
});
