import type { ParsedItem } from './types';

export type ReceiptFields = { title: string; date: string; time: string; duration: string; clarified: boolean };

export function reviewReceipt(entries: { item: ParsedItem; fields: ReceiptFields }[]) {
  const results = entries.map(({ item, fields }) => correctReceipt(item, fields));
  const issues = results.flatMap((result, index) => result.error ? [{ index, error: result.error }] : []);
  return { issues, items: issues.length ? [] : results.map(result => result.item!) };
}

export function pickerDate(fields: ReceiptFields, fallback: Date): Date {
  const result = new Date(fallback.getTime());
  if (/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
    const candidate = new Date(`${fields.date}T12:00:00`);
    const pad = (n: number) => String(n).padStart(2, '0');
    if (Number.isFinite(candidate.getTime()) && `${candidate.getFullYear()}-${pad(candidate.getMonth() + 1)}-${pad(candidate.getDate())}` === fields.date) {
      result.setFullYear(candidate.getFullYear(), candidate.getMonth(), candidate.getDate());
    }
  }
  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(fields.time)) result.setHours(Number(fields.time.slice(0, 2)), Number(fields.time.slice(3)), 0, 0);
  return result;
}

export function pickedDateFields(value: Date): Pick<ReceiptFields, 'date'> {
  const pad = (n: number) => String(n).padStart(2, '0');
  return { date: `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` };
}

export function pickedTimeFields(value: Date): Pick<ReceiptFields, 'time'> {
  const pad = (n: number) => String(n).padStart(2, '0');
  return { time: `${pad(value.getHours())}:${pad(value.getMinutes())}` };
}

export function receiptFields(item: ParsedItem): ReceiptFields {
  const date = item.dueAt ? new Date(item.dueAt) : null;
  const pad = (value: number) => String(value).padStart(2, '0');
  return {
    title: item.title,
    date: date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : item.dueDate ?? '',
    time: date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : '',
    duration: item.durationMinutes === null ? '' : String(item.durationMinutes),
    clarified: !item.needsClarification,
  };
}

export function correctReceipt(item: ParsedItem, fields: ReceiptFields): { item: ParsedItem | null; error: string | null } {
  const title = fields.title.trim();
  const date = fields.date.trim();
  const time = fields.time.trim();
  const duration = fields.duration.trim();
  if (!title) return { item: null, error: 'Give this a title, or go back and edit your dump.' };
  let dueAt: string | null = null;
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { item: null, error: 'Use YYYY-MM-DD for the date, or leave it blank.' };
    const [year, month, day] = date.split('-').map(Number);
    const parsed = new Date(`${date}T12:00:00`);
    if (year < 1000 || parsed.getFullYear() !== year || parsed.getMonth() + 1 !== month || parsed.getDate() !== day) return { item: null, error: 'That date does not exist. Check it or leave it blank.' };
    if (time) {
      if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return { item: null, error: 'Use HH:MM in 24-hour time, or leave it blank.' };
      const timed = new Date(`${date}T${time}:00`);
      if (timed.getHours() !== Number(time.slice(0, 2)) || timed.getMinutes() !== Number(time.slice(3))) return { item: null, error: 'That time is unavailable in your timezone. Choose another time.' };
      dueAt = timed.toISOString();
    }
  } else if (time) return { item: null, error: 'Add a date for this time, or leave both blank.' };
  if (duration && (!/^\d+$/.test(duration) || !Number.isSafeInteger(Number(duration)) || Number(duration) <= 0)) return { item: null, error: 'Duration needs a positive number of minutes, or leave it blank.' };
  if (item.needsClarification && !fields.clarified) return { item: null, error: 'Review these details, then tick “I reviewed these details.” Unknown timing can stay blank.' };
  return { item: { ...item, title, dueDate: date || null, dueAt, durationMinutes: duration ? Number(duration) : null, needsClarification: false, clarificationQuestion: null }, error: null };
}
