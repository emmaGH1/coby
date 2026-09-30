import test from 'node:test';
import assert from 'node:assert/strict';
import { correctReceipt, receiptFields } from '../src/domain/receipt';
import type { ParsedItem } from '../src/domain/types';

const item: ParsedItem = { title: 'Call Mum', sourceFragment: 'call Mum', kind: 'task', dueDate: null, dueAt: null, durationMinutes: null, explicitPriority: null, confidence: 1, needsClarification: false, clarificationQuestion: null };

test('receipt keeps unspecified timing and duration null and preserves source words', () => {
  const result = correctReceipt(item, receiptFields(item));
  assert.deepEqual(result.item, item);
});
test('receipt rejects nonexistent dates and time without a date', () => {
  assert.equal(correctReceipt(item, { ...receiptFields(item), date: '2026-02-30' }).item, null);
  assert.equal(correctReceipt(item, { ...receiptFields(item), time: '18:00' }).item, null);
  assert.equal(correctReceipt(item, { ...receiptFields(item), date: '2026-09-30', time: '25:00' }).item, null);
});
test('date-only correction never creates an hour, and blanking fields clears old timing', () => {
  const result = correctReceipt(item, { ...receiptFields(item), date: '2026-09-30' }).item!;
  assert.equal(result.dueDate, '2026-09-30');
  assert.equal(result.dueAt, null);
  const cleared = correctReceipt(result, { ...receiptFields(result), date: '' }).item!;
  assert.equal(cleared.dueDate, null);
});
test('timed receipt corrections round trip through local date and time', () => {
  const result = correctReceipt(item, { ...receiptFields(item), date: '2026-09-30', time: '18:45', duration: '15' }).item!;
  assert.equal(receiptFields(result).time, '18:45');
  assert.equal(receiptFields(result).date, '2026-09-30');
  assert.equal(result.durationMinutes, 15);
  assert.equal(correctReceipt(item, { ...receiptFields(item), duration: '0' }).item, null);
  assert.equal(correctReceipt(item, { ...receiptFields(item), duration: '1.5' }).item, null);
});
test('uncertain extraction requires explicit review before receipt acceptance', () => {
  const uncertain = { ...item, needsClarification: true, clarificationQuestion: 'Which day?' };
  assert.equal(correctReceipt(uncertain, receiptFields(uncertain)).item, null);
  const accepted = correctReceipt(uncertain, { ...receiptFields(uncertain), clarified: true }).item!;
  assert.equal(accepted.needsClarification, false);
  assert.equal(accepted.clarificationQuestion, null);
  assert.equal(accepted.dueAt, null);
});
