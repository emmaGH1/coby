import { DemoClock } from '../src/domain/clock';
import { GeminiBrainDumpParser } from '../src/domain/geminiParser';
import { DEMO_DUMP } from '../src/domain/parser';

const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const model = process.env.EXPO_PUBLIC_COBY_AI_MODEL || 'gemini-3.5-flash-lite';
if (!key) throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY in local .env');

async function main() {
  const parser = new GeminiBrainDumpParser(key, model);
  const result = await parser.parse(DEMO_DUMP, {
    clock: new DemoClock(new Date('2026-09-29T12:00:00Z')),
    timeZone: 'Africa/Lagos',
  });
  if (!result.items.length) throw new Error('Gemini returned no items');
  const assignment = result.items.find((item) => item.title.toLocaleLowerCase().includes('assignment'));
  if (!assignment || assignment.dueAt !== null) throw new Error('Date-only assignment received an invented clock time');
  console.log(`Gemini smoke passed: ${result.items.length} anchored item(s), model ${model}.`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : 'Gemini smoke failed'); process.exitCode = 1; });
