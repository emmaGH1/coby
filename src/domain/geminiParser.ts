import type { BrainDumpParser, ParseContext } from './parser';
import type { ExplicitPriority, ItemKind, ParseResult, ParsedItem } from './types';

type Fetcher = typeof fetch;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateItem(value: unknown, input: string): ParsedItem {
  if (!isRecord(value) || typeof value.title !== 'string' || typeof value.sourceFragment !== 'string') {
    throw new Error('Invalid extraction item');
  }
  const fragment = value.sourceFragment.trim();
  if (!fragment || !input.toLocaleLowerCase().includes(fragment.toLocaleLowerCase())) {
    throw new Error('Extraction was not anchored to the original words');
  }
  const kind: ItemKind = value.kind === 'event' || value.kind === 'reminder' ? value.kind : 'task';
  const temporalCue = /\b(today|tomorrow|tonight|due|by|before|after|on|at|next|this|morning|afternoon|evening|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\d[/:.-]\d/i.test(fragment);
  const exactClockCue = /\b(at|by|before)\s*(\d{1,2}(:\d{2})?\s*(am|pm)?|noon|midnight)\b|\b\d{1,2}:\d{2}\s*(am|pm)?\b/i.test(fragment);
  const dueDate = temporalCue && typeof value.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.dueDate) && Number.isFinite(Date.parse(value.dueDate))
    ? value.dueDate : null;
  const dueAt = exactClockCue && typeof value.dueAt === 'string' && Number.isFinite(Date.parse(value.dueAt))
    ? new Date(value.dueAt).toISOString() : null;
  const durationCue = /\b\d+\s*(minutes?|mins?|hours?|hrs?)\b/i.test(fragment);
  const durationMinutes = durationCue && Number.isInteger(value.durationMinutes) && (value.durationMinutes as number) > 0
    ? value.durationMinutes as number : null;
  const priorityCue = /\b(urgent|important|asap|critical)\b/i.test(fragment);
  const explicitPriority: ExplicitPriority = priorityCue && (value.explicitPriority === 'urgent' || value.explicitPriority === 'important')
    ? value.explicitPriority : null;
  const needsClarification = value.needsClarification === true;
  return {
    title: value.title.trim(), sourceFragment: fragment, kind, dueDate, dueAt, durationMinutes,
    explicitPriority, confidence: typeof value.confidence === 'number' ? Math.max(0, Math.min(1, value.confidence)) : 0,
    needsClarification,
    clarificationQuestion: needsClarification && typeof value.clarificationQuestion === 'string' ? value.clarificationQuestion : null,
  };
}

export function validateParseResult(value: unknown, input: string): ParseResult {
  if (!isRecord(value) || !Array.isArray(value.items)) throw new Error('Invalid extraction response');
  const items = value.items.map((entry) => validateItem(entry, input));
  if (items.some((entry) => !entry.title)) throw new Error('Empty extraction title');
  return { items };
}

export class GeminiBrainDumpParser implements BrainDumpParser {
  constructor(private apiKey: string, private model: string, private fetcher: Fetcher = fetch) {}

  async parse(input: string, context: ParseContext): Promise<ParseResult> {
    if (!this.apiKey || !this.model) throw new Error('Gemini is not configured');
    const response = await this.fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'Extract only tasks, events, and reminders from the user text. Return JSON with an items array. Each item needs title, sourceFragment copied exactly from the user text, kind (task/event/reminder), dueDate YYYY-MM-DD or null, dueAt ISO datetime or null, durationMinutes integer or null, explicitPriority (urgent/important) or null, confidence 0..1, needsClarification boolean, clarificationQuestion string or null. A day such as tomorrow supplies dueDate but NOT dueAt; set dueAt only when an exact clock time is stated. Never invent life details, deadlines, durations, or priorities. Resolve clear relative dates/times from supplied local datetime and timezone. If uncertain, leave null and flag clarification. Do not rank, schedule, or give advice.' }] },
        contents: [{ role: 'user', parts: [{ text: `Local datetime: ${context.clock.now().toISOString()}\nTimezone: ${context.timeZone}\nBrain dump: ${input}` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0 },
      }),
    });
    if (!response.ok) throw new Error(`Gemini request failed (${response.status})`);
    const payload: unknown = await response.json();
    if (!isRecord(payload)) throw new Error('Invalid Gemini response');
    const candidates = payload.candidates;
    if (!Array.isArray(candidates) || !isRecord(candidates[0]) || !isRecord(candidates[0].content)) throw new Error('No Gemini candidate');
    const parts = candidates[0].content.parts;
    if (!Array.isArray(parts) || !isRecord(parts[0]) || typeof parts[0].text !== 'string') throw new Error('No Gemini text');
    return validateParseResult(JSON.parse(parts[0].text), input);
  }
}
