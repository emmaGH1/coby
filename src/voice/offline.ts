export type OfflineSpeechService = {
  supportsOnDeviceRecognition: () => boolean;
  getSupportedLocales: (options: Record<string, never>) => Promise<{ installedLocales: string[] }>;
};

// A supported language is not necessarily an installed, usable offline model.
export async function offlineVoiceAvailable(service: OfflineSpeechService, locale = 'en-US', timeoutMs = 2500): Promise<boolean> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    if (!service.supportsOnDeviceRecognition()) return false;
    const languages = await Promise.race([
      service.getSupportedLocales({}),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('Speech service timed out')), timeoutMs); }),
    ]);
    const normalize = (value: string) => value.replace(/_/g, '-').toLowerCase();
    return languages.installedLocales.some((value) => normalize(value) === normalize(locale));
  } catch { return false; }
  finally { if (timeout) clearTimeout(timeout); }
}

