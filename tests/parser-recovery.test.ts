import assert from 'node:assert/strict';
import test from 'node:test';
import { GeminiBrainDumpParser } from '../src/domain/geminiParser';
import { DemoClock } from '../src/domain/clock';
import { DEMO_DUMP, unparsedReceipt } from '../src/domain/parser';
import { initialCommitment } from '../src/domain/itemActions';
const context = { clock: new DemoClock(new Date('2026-10-01T09:00:00Z')), timeZone: 'UTC' };

test('Gentle starts only for explicitly timed future items', () => {
  const base = unparsedReceipt('Buy milk').items[0];
  assert.equal(initialCommitment(base, context.clock), 'none');
  assert.equal(initialCommitment({ ...base, dueDate: '2026-10-02' }, context.clock), 'none');
  assert.equal(initialCommitment({ ...base, dueAt: '2026-10-01T10:00:00Z' }, context.clock), 'gentle');
  assert.equal(initialCommitment({ ...base, dueAt: '2026-10-01T08:00:00Z' }, context.clock), 'none');
  assert.equal(initialCommitment({ ...base, dueAt: 'invalid' }, context.clock), 'none');
});

test('explicit offline recovery keeps even the demo phrase intact and invents no timing', () => {
  const result = unparsedReceipt(DEMO_DUMP);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].title, DEMO_DUMP);
  assert.equal(result.items[0].dueDate, null);
  assert.equal(result.items[0].dueAt, null);
  assert.equal(result.items[0].durationMinutes, null);
  assert.equal(unparsedReceipt('  ').items.length, 0);
});

test('stalled extraction releases the caller and aborts the network request', async () => {
  let signal: AbortSignal | undefined;
  const stalled: typeof fetch = async (_, options) => {
    signal = options?.signal ?? undefined;
    return new Promise<Response>(() => {});
  };
  const parser = new GeminiBrainDumpParser('test-only', 'test-model', stalled, 10);
  await assert.rejects(parser.parse('Buy milk', context), /timed out/);
  assert.equal(signal?.aborted, true);
});

test('failed extraction can retry using the same parser without inventing items', async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls++;
    if (calls === 1) throw new Error('offline');
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ items: [{
      title: 'Buy milk', sourceFragment: 'Buy milk', kind: 'task', dueAt: null, dueDate: null,
      durationMinutes: null, explicitPriority: null, confidence: 1, needsClarification: false,
      clarificationQuestion: null,
    }] }) }] } }] }));
  };
  const parser = new GeminiBrainDumpParser('test-only', 'test-model', fetcher, 1000);
  await assert.rejects(parser.parse('Buy milk', context), /offline/);
  const result = await parser.parse('Buy milk', context);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].dueAt, null);
});
