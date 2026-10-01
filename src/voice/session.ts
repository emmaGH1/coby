import { appendTranscript } from './speech';

export type VoicePhase = 'idle' | 'preparing' | 'starting' | 'listening' | 'restarting' | 'stopping';

// Native errors are followed by an end event. Keep the session locked until end,
// and retain the latest partial words if Android never supplies a final result.
export class VoiceSession {
  phase: VoicePhase = 'idle';
  private base = '';
  private final = '';
  private partial = '';
  private failed = false;
  private hadWords = false;
  private keepOpen = false;
  private speechEnded = false;
  get continues(): boolean { return this.keepOpen && !this.failed; }
  get hasRecognizedWords(): boolean { return this.hadWords; }

  begin(text: string, keepOpen = false): boolean {
    if (this.phase !== 'idle') return false;
    this.base = text;
    this.final = ''; this.partial = ''; this.failed = false; this.hadWords = false;
    this.keepOpen = keepOpen;
    this.speechEnded = false;
    this.phase = 'preparing';
    return true;
  }

  starting(): void { if (this.phase === 'preparing') this.phase = 'starting'; }
  ready(): void { if (this.phase === 'starting' || this.phase === 'restarting') this.phase = 'listening'; }
  speechEnd(): void { if (this.phase === 'listening') this.speechEnded = true; }
  speechStart(): void {
    if (this.phase !== 'listening') return;
    // Legacy Google recognition can keep the microphone open but reset partial
    // results for each utterance. Commit only when the next utterance starts,
    // allowing delayed corrections after speech-end to update the prior one.
    if (this.speechEnded && this.partial) {
      this.final = appendTranscript(this.final, this.partial);
      this.partial = '';
    }
    this.speechEnded = false;
  }
  stop(): boolean {
    if (this.phase !== 'listening' && this.phase !== 'restarting') return false;
    this.keepOpen = false;
    this.phase = 'stopping';
    return true;
  }
  fail(recoverableSilence = false): void {
    if (this.phase === 'idle') return;
    if (recoverableSilence) return;
    this.failed = true;
    this.phase = 'stopping';
  }
  result(text: string, isFinal: boolean): string | null {
    if (!['starting', 'listening', 'stopping'].includes(this.phase) || !text.trim()) return null;
    this.hadWords = true;
    const incoming = text.trim();
    // Some engines return the whole native cycle; others return only the new
    // utterance. Never duplicate an already committed prefix in cumulative results.
    const prefix = (this.final.match(/[\p{L}\p{N}]+/gu) ?? []).map((word) => word.toLowerCase());
    const tokens = [...incoming.matchAll(/[\p{L}\p{N}]+/gu)];
    const cumulative = prefix.length > 0 && tokens.length > prefix.length
      && prefix.every((word, index) => tokens[index][0].toLowerCase() === word);
    if (cumulative) {
      // Find the end of the committed word prefix without changing native spelling.
      const nextWord = tokens[prefix.length];
      const rest = incoming.slice(nextWord.index!).trim();
      if (isFinal) { this.final = incoming; this.partial = ''; }
      else this.partial = rest;
    } else if (isFinal) { this.final = appendTranscript(this.final, incoming); this.partial = ''; }
    else this.partial = incoming;
    return appendTranscript(appendTranscript(this.base, this.final), this.partial);
  }
  end(): { text: string; empty: boolean; restart?: true } | null {
    if (this.phase === 'idle' || this.phase === 'preparing' || this.phase === 'restarting') return null;
    const result = { text: appendTranscript(appendTranscript(this.base, this.final), this.partial), empty: !this.hadWords && !this.failed };
    if (this.continues) {
      this.base = result.text; this.final = ''; this.partial = '';
      this.speechEnded = false;
      this.phase = 'restarting';
      return { ...result, restart: true };
    }
    this.phase = 'idle';
    return result;
  }
  cancel(): void { this.failed = true; this.keepOpen = false; this.phase = 'idle'; }
}
