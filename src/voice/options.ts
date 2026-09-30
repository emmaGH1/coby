// Match the native library's legacy continuous window. Modern online recognition
// uses the standard microphone path, since segmented audio requires provider support.
export function androidVoiceOptions(apiLevel: number, offlineReady: boolean) {
  const legacy = apiLevel < 33;
  return {
    continuous: offlineReady || legacy,
    androidIntentOptions: {
      EXTRA_LANGUAGE_MODEL: 'free_form' as const,
      EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: legacy ? 600000 : 20000,
      EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: legacy ? 600000 : 15000,
      EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: legacy ? 600000 : 15000,
    },
  };
}
