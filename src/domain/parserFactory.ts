import { FixtureBrainDumpParser, type BrainDumpParser } from './parser';
import { GeminiBrainDumpParser } from './geminiParser';

export function createBrainDumpParser(): BrainDumpParser {
  if (process.env.EXPO_PUBLIC_COBY_AI_PROVIDER === 'gemini') {
    return createGeminiBrainDumpParser();
  }
  return new FixtureBrainDumpParser();
}

export function createGeminiBrainDumpParser(): BrainDumpParser {
  return new GeminiBrainDumpParser(
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '',
    process.env.EXPO_PUBLIC_COBY_AI_MODEL || 'gemini-3.5-flash-lite',
  );
}
