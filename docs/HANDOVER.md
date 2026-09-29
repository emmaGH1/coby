# Handover

## Status

P0 is **in progress**. The earlier implementation proved the core data and integration plumbing but did not meet the product canon for capture prominence, voice trust, or visual quality. See `docs/P0_AUDIT.md` for the screen-by-screen assessment.

The first recovery slice is implemented: Coby now opens on an adaptive brain-dump composer, keeps capture visible above NOW/NEXT, uses the orb as an idle/listening/thinking/settled indicator, and handles Android speech availability, segmented transcription, typed-text preservation, explicit completion, and recoverable errors. Home, orb, icons, theme, and speech helpers are separated from the remaining screen coordinator.

This slice passes TypeScript, lint, and 19 unit tests. Android render and spoken transcription are not yet verified. Local native compilation is blocked while Gradle downloads NDK `27.1.12297006`; the clean reinstall began but failed with a connection reset.

## Verified baseline retained

- Fixture and live Gemini demo extraction previously passed on Pixel 6 without inventing an hour for a date-only task or a date for an undated item.
- SQLite persistence, completion recomputation, Plan List/Calendar behavior, focus start/end/complete, and an immediate notification previously passed on Pixel 6.
- RevenueCat Test Store product `coby_plus_monthly` is $4.99/month, attached to `coby_plus`, and a purchase previously unlocked Persistent reminders.
- Deterministic ranking, explanation, clock, parser guardrails, and nudge planning remain covered by unit tests.

## Recovery slice evidence

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: 19/19 passed, including typed-text preservation and actionable voice error copy.
- Pixel 6 AVD is connected on Android 16 / API 36.
- Android default recognition service resolves to Google TTS recognition, and Google speech packages are installed.
- Local Gradle reached automatic NDK installation after Java and Android SDK paths were supplied. The NDK download ended with `java.net.SocketException: Connection reset`, so no current APK or screenshot was produced.

## Known P0 gaps

- Spoken multi-clause transcription, stop/retry, and denied-permission flows need real Android verification.
- Receipt still edits titles only; date/time, duration, kind, and clarification correction remain.
- Plan, Focus, paywall, and Lab still use the prototype visual system.
- Scheduled nudge timing/cancellation/frequency and RevenueCat restore remain unverified.
- The checked-in submission screenshot shows the rejected prototype Home and must be replaced after visual approval.

## Environment note

For local Android commands in a fresh PowerShell session, provide Android Studio's bundled Java and SDK paths. NDK `27.1.12297006` still needs a complete install. The previous empty directory was moved to `C:\Users\Emma0\AppData\Local\Android\Sdk\ndk\27.1.12297006.incomplete-20260929` before Gradle attempted a clean reinstall.

## NEXT ACTION

Complete NDK `27.1.12297006`, build the recovery slice on the Pixel 6, and verify the empty and populated Home composer plus a real spoken multi-clause dump before redesigning Receipt.
