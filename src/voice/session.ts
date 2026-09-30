import { appendTranscript } from './speech';

export type VoicePhase = 'idle' | 'preparing' | 'starting' | 'listening' | 'stopping';

// Native errors are followed by an end event. Keep the session locked until end,
// and retain the latest partial words if Android never supplies a final result.
export class VoiceSession {
  phase: VoicePhase = 'idle';
  private base = '';
  private final = '';
  private partial = '';
  private failed = false;
  private hadWords = false;

  begin(text: string): boolean {
    if (this.phase !== 'idle') return false;
    this.base = text;
    this.final = ''; this.partial = ''; this.failed = false; this.hadWords = false;
    this.phase = 'preparing';
    return true;
  }

  starting(): void { if (this.phase === 'preparing') this.phase = 'starting'; }
  ready(): void { if (this.phase === 'starting') this.phase = 'listening'; }
  stop(): boolean {
    if (this.phase !== 'listening') return false;
    this.phase = 'stopping';
    return true;
  }
  fail(): void {
    if (this.phase === 'idle') return;
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
  end(): { text: string; empty: boolean } | null {
    if (this.phase === 'idle' || this.phase === 'preparing') return null;
    const result = { text: appendTranscript(appendTranscript(this.base, this.final), this.partial), empty: !this.hadWords && !this.failed };
    this.phase = 'idle';
    return result;
  }
  cancel(): void { this.failed = true; this.phase = 'idle'; }
}
