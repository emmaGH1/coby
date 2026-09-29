import type { ExpoSpeechRecognitionErrorCode } from 'expo-speech-recognition';

export function speechErrorMessage(code: ExpoSpeechRecognitionErrorCode): string {
  if (code === 'no-speech' || code === 'speech-timeout') return "I didn't catch anything. Tap the mic and try again, or type below.";
  if (code === 'not-allowed') return 'Microphone access is off. Allow it in Android settings, or type below.';
  if (code === 'service-not-allowed' || code === 'language-not-supported') return 'Android speech recognition is unavailable. Enable Speech Recognition & Synthesis, or type below.';
  if (code === 'network') return 'Voice needs a connection right now. Your words are still here, and you can keep typing.';
  if (code === 'busy') return 'Voice is still finishing the last attempt. Wait a moment, then tap the mic again.';
  if (code === 'audio-capture') return 'Coby could not hear the microphone. Check the emulator microphone, then try again.';
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
