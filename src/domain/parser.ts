import type { Clock } from './clock';
import type { ParseResult, ParsedItem } from './types';

export type ParseContext = { clock: Clock; timeZone: string };

export interface BrainDumpParser {
  parse(input: string, context: ParseContext): Promise<ParseResult>;
}

export const DEMO_DUMP = 'Finish the database assignment tomorrow, call Daniel by 8 PM tonight for 5 minutes, and buy data.';

function localDate(clock: Clock, dayOffset: number): string {
  const date = clock.now();
  date.setDate(date.getDate() + dayOffset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function localDueDate(clock: Clock, dayOffset: number, hour: number): string {
  const date = clock.now();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function item(title: string, sourceFragment: string, dueDate: string | null, dueAt: string | null, durationMinutes: number | null = null): ParsedItem {
  return {
    title, sourceFragment, dueDate, dueAt, kind: 'task', durationMinutes,
    explicitPriority: null, confidence: 1, needsClarification: false,
    clarificationQuestion: null,
  };
}

// An explicit offline fixture, not a general natural-language parser.
export class FixtureBrainDumpParser implements BrainDumpParser {
  async parse(input: string, context: ParseContext): Promise<ParseResult> {
    const trimmed = input.trim();
    if (!trimmed) return { items: [] };
    if (trimmed.toLocaleLowerCase() === DEMO_DUMP.toLocaleLowerCase()) {
      return { items: [
        item('Finish the database assignment', 'Finish the database assignment tomorrow', localDate(context.clock, 1), null),
        item('Call Daniel', 'call Daniel by 8 PM tonight for 5 minutes', localDate(context.clock, 0), localDueDate(context.clock, 0, 20), 5),
        item('Buy data', 'buy data', null, null),
      ] };
    }
    return { items: [item(trimmed, trimmed, null, null)] };
  }
}
