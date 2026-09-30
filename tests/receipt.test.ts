import test from 'node:test';
import assert from 'node:assert/strict';
import { correctReceipt, pickedDateFields, pickedTimeFields, pickerDate, receiptFields, reviewReceipt } from '../src/domain/receipt';
import type { ParsedItem } from '../src/domain/types';

const item: ParsedItem = { title: 'Call Mum', sourceFragment: 'call Mum', kind: 'task', dueDate: null, dueAt: null, durationMinutes: null, explicitPriority: null, confidence: 1, needsClarification: false, clarificationQuestion: null };

test('receipt review identifies the earlier invalid item while blocking the whole save', () => {
  const uncertain = { ...item, needsClarification: true };
  const entries = [{ item: uncertain, fields: receiptFields(uncertain) }, { item, fields: { ...receiptFields(item), duration: '-5' } }, { item, fields: receiptFields(item) }];
  const review = reviewReceipt(entries);
  assert.deepEqual(review.issues.map(issue => issue.index), [0, 1]);
  assert.match(review.issues[0].error, /I reviewed these details/);
  assert.deepEqual(review.items, []);
  entries[0].fields.clarified = true;
  entries[1].fields.duration = '';
  assert.equal(reviewReceipt(entries).items.length, 3);
});

test('picker preview does not invent a deadline and selecting date/time changes only that field', () => {
  const fields = receiptFields(item);
  const fallback = new Date(2026, 9, 1, 11, 15);
  const preview = pickerDate(fields, fallback);
  assert.deepEqual(fields, receiptFields(item));
  assert.equal(preview.getTime(), fallback.getTime());
  assert.deepEqual(pickedDateFields(new Date(2026, 9, 3, 18, 45)), { date: '2026-10-03' });
  assert.deepEqual(pickedTimeFields(new Date(2026, 9, 3, 18, 45)), { time: '18:45' });
  const edited = { ...fields, ...pickedDateFields(preview) };
  assert.equal(correctReceipt(item, edited).item?.dueAt, null);
  assert.equal(pickerDate({ ...fields, date: '2026-02-30', time: '25:00' }, fallback).getTime(), fallback.getTime());
  const selected = pickerDate({ ...fields, date: '2026-10-03', time: '18:45' }, fallback);
  assert.equal(selected.getDate(), 3);
  assert.equal(selected.getHours(), 18);
  assert.equal(selected.getMinutes(), 45);
});

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
