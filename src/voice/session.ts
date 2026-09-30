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
  get continues(): boolean { return this.keepOpen && !this.failed; }

  begin(text: string, keepOpen = false): boolean {
    if (this.phase !== 'idle') return false;
    this.base = text;
    this.final = ''; this.partial = ''; this.failed = false; this.hadWords = false;
    this.keepOpen = keepOpen;
    this.phase = 'preparing';
    return true;
  }

  starting(): void { if (this.phase === 'preparing') this.phase = 'starting'; }
  ready(): void { if (this.phase === 'starting' || this.phase === 'restarting') this.phase = 'listening'; }
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
    if (isFinal) { this.final = appendTranscript(this.final, text); this.partial = ''; }
    else this.partial = text;
    return appendTranscript(appendTranscript(this.base, this.final), this.partial);
  }
  end(): { text: string; empty: boolean; restart?: true } | null {
    if (this.phase === 'idle' || this.phase === 'preparing' || this.phase === 'restarting') return null;
    const result = { text: appendTranscript(appendTranscript(this.base, this.final), this.partial), empty: !this.hadWords && !this.failed };
    if (this.continues) {
      this.base = result.text; this.final = ''; this.partial = '';
      this.phase = 'restarting';
      return { ...result, restart: true };
    }
    this.phase = 'idle';
    return result;
  }
  cancel(): void { this.failed = true; this.keepOpen = false; this.phase = 'idle'; }
}
