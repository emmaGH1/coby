import assert from 'node:assert/strict';
import test from 'node:test';
import { DemoClock } from '../src/domain/clock';
import { DEMO_DUMP, FixtureBrainDumpParser } from '../src/domain/parser';
import { rankItems, reasonText } from '../src/domain/ranking';
import { planNudges } from '../src/domain/nudges';
import { validateParseResult } from '../src/domain/geminiParser';
import type { CobyItem } from '../src/domain/types';

const clock = new DemoClock(new Date('2026-09-29T12:00:00Z'));
const parser = new FixtureBrainDumpParser();

test('fixture recognizes only the explicit demo input', async () => {
  const result = await parser.parse(DEMO_DUMP, { clock, timeZone: 'UTC' });
  assert.equal(result.items.length, 3);
  assert.equal(result.items[0].dueAt, null);
  assert.equal(result.items[0].dueDate, '2026-09-30');
  assert.equal(result.items[1].durationMinutes, 5);
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
    dueDate: null, dueAt, durationMinutes: null, explicitPriority: null, confidence: 1,
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

test('date-only obligations rank without inventing a clock time or nudge', () => {
  const tomorrow = { ...stored('a', null), dueDate: '2026-09-30', commitmentMode: 'gentle' as const };
  const ranked = rankItems([stored('b', null), tomorrow], clock);
  assert.equal(ranked[0].item.id, 'a');
  assert.deepEqual(ranked[0].reasonCodes, ['dueTomorrowDate']);
  assert.deepEqual(planNudges(tomorrow, clock), []);
});

test('latest safe start outranks another due-soon item', () => {
  const latest = { ...stored('a', '2026-09-29T12:45:00Z'), durationMinutes: 45 };
  const later = stored('b', '2026-09-29T16:00:00Z');
  const ranked = rankItems([later, latest], clock);
  assert.equal(ranked[0].item.id, 'a');
  assert.deepEqual(ranked[0].reasonCodes, ['latestStart']);
});

test('Gentle schedules one comfortable start and Persistent at most two nudges', () => {
  const base = { ...stored('a', '2026-09-29T14:00:00Z'), durationMinutes: 60 };
  const gentle = planNudges({ ...base, commitmentMode: 'gentle' }, clock);
  const persistent = planNudges({ ...base, commitmentMode: 'persistent' }, clock);
  assert.equal(gentle.length, 1);
  assert.equal(gentle[0].at.toISOString(), '2026-09-29T12:30:00.000Z');
  assert.equal(persistent.length, 2);
  assert.equal(persistent[1].at.toISOString(), '2026-09-29T13:00:00.000Z');
});

test('unknown deadlines and completed items never receive nudges', () => {
  assert.deepEqual(planNudges({ ...stored('a', null), commitmentMode: 'gentle' }, clock), []);
  assert.deepEqual(planNudges({ ...stored('a', '2026-09-29T14:00:00Z', 'completed'), commitmentMode: 'gentle' }, clock), []);
});

test('Gemini response validator discards unsupported dates and durations', () => {
  const result = validateParseResult({ items: [{
    title: 'Study operating systems', sourceFragment: 'Study operating systems',
    kind: 'task', dueDate: '2026-10-01', dueAt: '2026-10-01T18:00:00Z', durationMinutes: 120,
    explicitPriority: 'urgent', confidence: 0.9, needsClarification: false,
  }] }, 'Study operating systems');
  assert.equal(result.items[0].dueAt, null);
  assert.equal(result.items[0].dueDate, null);
  assert.equal(result.items[0].durationMinutes, null);
  assert.equal(result.items[0].explicitPriority, null);
});

test('Gemini response validator rejects a fabricated source fragment', () => {
  assert.throws(() => validateParseResult({ items: [{ title: 'Call Sam', sourceFragment: 'Call Sam' }] }, 'Buy data'));
});

test('an ambiguous hour and generic “on” cannot create an exact deadline', () => {
  const response = { items: [{ title: 'Call Sam', sourceFragment: 'Call Sam at 8', kind: 'task', dueDate: '2026-09-29', dueAt: '2026-09-29T20:00:00Z' }] };
  const result = validateParseResult(response, 'Call Sam at 8');
  assert.equal(result.items[0].dueAt, null);
  const generic = validateParseResult({ items: [{ ...response.items[0], sourceFragment: 'Work on the essay' }] }, 'Work on the essay');
  assert.equal(generic.items[0].dueDate, null);
});

test('active work outranks deadlines and gives a truthful explanation', () => {
  const active = stored('active', '2026-09-29T20:00:00Z', 'active');
  const dueSoon = stored('soon', '2026-09-29T13:00:00Z');
  const ranked = rankItems([dueSoon, active], clock);
  assert.equal(ranked[0].item.id, 'active');
  assert.equal(reasonText(ranked[0].reasonCodes), 'You already started this.');
});

test('overdue items outrank a latest-start item and both explanations match', () => {
  const overdue = stored('overdue', '2026-09-29T11:59:00Z');
  const latest = { ...stored('latest', '2026-09-29T12:45:00Z'), durationMinutes: 45 };
  const ranked = rankItems([latest, overdue], clock);
  assert.equal(ranked[0].item.id, 'overdue');
  assert.equal(reasonText(ranked[0].reasonCodes), 'Its due time has passed.');
  const latestRanked = rankItems([latest], clock)[0];
  assert.equal(reasonText(latestRanked.reasonCodes), 'This is the latest start to finish on time.');
});

test('date-only obligations due today and tomorrow have exact explanations', () => {
  const today = { ...stored('today', null), dueDate: '2026-09-29' };
  const tomorrow = { ...stored('tomorrow', null), dueDate: '2026-09-30' };
  const ranked = rankItems([tomorrow, today], clock);
  assert.equal(ranked[0].item.id, 'today');
  assert.equal(reasonText(ranked[0].reasonCodes), 'Due today. No exact time was set.');
  assert.equal(reasonText(ranked[1].reasonCodes), 'Due tomorrow. No exact time was set.');
});

test('equal-priority items use creation time and id as deterministic tie-breakers', () => {
  const createdAt = '2026-09-29T08:00:00Z';
  const laterId = { ...stored('b', null), createdAt };
  const earlierId = { ...stored('a', null), createdAt };
  assert.deepEqual(rankItems([laterId, earlierId], clock).map(({ item }) => item.id), ['a', 'b']);
});

test('DemoClock advances by the requested number of minutes', () => {
  const demo = new DemoClock(new Date('2026-09-29T12:00:00Z'));
  demo.advanceMinutes(60);
  assert.equal(demo.now().toISOString(), '2026-09-29T13:00:00.000Z');
});

test('explicit urgent priority outranks important for otherwise equal items', () => {
  const urgent = { ...stored('urgent', null), explicitPriority: 'urgent' as const };
  const important = { ...stored('important', null), explicitPriority: 'important' as const };
  const ranked = rankItems([important, urgent], clock);
  assert.deepEqual(ranked.map(({ item }) => item.id), ['urgent', 'important']);
  assert.equal(reasonText(ranked[0].reasonCodes), 'You marked this urgent.');
});
