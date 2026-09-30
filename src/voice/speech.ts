import type { ExpoSpeechRecognitionErrorCode } from 'expo-speech-recognition';

export function speechErrorMessage(code: ExpoSpeechRecognitionErrorCode, nativeCode?: number): string {
  if (code === 'no-speech' || code === 'speech-timeout') return "I didn't catch anything. Tap the mic and try again, or type below.";
  if (code === 'not-allowed') return 'Microphone access is off. Allow it in Android settings, or type below.';
  if (code === 'language-not-supported' && nativeCode === 13) return 'English voice is not installed yet. Enable offline English voice below, or keep typing.';
  if (code === 'service-not-allowed' || code === 'language-not-supported') return 'Android speech recognition is unavailable. Enable Speech Recognition & Synthesis, or type below.';
  if (code === 'network' && (nativeCode === 4 || nativeCode === 11)) return 'Android’s speech service is unavailable right now. Your words are still here; tap Speak to retry.';
  if (code === 'network') return 'Android’s speech service could not connect. Try again or enable offline English voice below. Your words are still here.';
  if (code === 'busy') return 'Voice is still finishing the last attempt. Wait a moment, then tap the mic again.';
  if (code === 'audio-capture') return 'Coby could not hear the microphone. Check microphone access and try again.';
  if (code === 'aborted') return '';
  return 'Voice stopped before Coby caught that. Tap the mic to retry, or type below.';
}

export function appendTranscript(base: string, transcript: string): string {
  const before = base.trimEnd();
  const spoken = transcript.trim();
  if (!before) return spoken;
  if (!spoken) return before;
  return `${before} ${spoken}`;
}
