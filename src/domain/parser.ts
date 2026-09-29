import type { Clock } from './clock';
import type { ParseResult, ParsedItem } from './types';

export type ParseContext = { clock: Clock; timeZone: string };

export interface BrainDumpParser {
  parse(input: string, context: ParseContext): Promise<ParseResult>;
}

export const DEMO_DUMP = 'Finish the database assignment tomorrow, call Daniel tonight, and buy data.';

function localDueDate(clock: Clock, dayOffset: number, hour: number): string {
  const date = clock.now();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function item(title: string, sourceFragment: string, dueAt: string | null): ParsedItem {
  return {
    title, sourceFragment, dueAt, kind: 'task', durationMinutes: null,
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
        item('Finish the database assignment', 'Finish the database assignment tomorrow', localDueDate(context.clock, 1, 18)),
        item('Call Daniel', 'call Daniel tonight', localDueDate(context.clock, 0, 21)),
        item('Buy data', 'buy data', null),
      ] };
    }
    return { items: [item(trimmed, trimmed, null)] };
  }
}
