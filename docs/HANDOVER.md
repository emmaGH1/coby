# Handover

## Status

P0 is **in progress**. The earlier implementation proved the core data and integration plumbing but did not meet the product canon for capture prominence, voice trust, or visual quality. See `docs/P0_AUDIT.md` for the screen-by-screen assessment.

The first recovery slice is implemented and release-rendered: Coby now opens on an adaptive brain-dump composer, keeps capture visible above NOW/NEXT, uses the orb as an idle/listening/thinking/settled indicator, and handles Android speech availability, segmented transcription, typed-text preservation, explicit completion, and recoverable errors. Home, orb, icons, theme, and speech helpers are separated from the remaining screen coordinator.

The populated Home passed a 1179×2556 Android release capture and an inline finish review. The review confirmed the capture-first hierarchy and warm paper/ink/violet world, then required 48 dp targets for Plan, reason, and reminder controls. Commit `527a3f9` added the targets and `071a5c3` aligned the mixed status/action row after recapture. Spoken transcription is still unverified with a real voice, and the remaining prototype screens have not inherited the Home system.

## Verified baseline retained

- Fixture and live Gemini demo extraction previously passed on Pixel 6 without inventing an hour for a date-only task or a date for an undated item.
- SQLite persistence, completion recomputation, Plan List/Calendar behavior, focus start/end/complete, and an immediate notification previously passed on Pixel 6.
- RevenueCat Test Store product `coby_plus_monthly` is $4.99/month, attached to `coby_plus`, and a purchase previously unlocked Persistent reminders.
- Deterministic ranking, explanation, clock, parser guardrails, and nudge planning remain covered by unit tests.

## Recovery slice evidence

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: 19/19 passed, including typed-text preservation and actionable voice error copy.
- Android release capture: passed at https://github.com/emmaGH1/coby/actions/runs/36631406071.
- The checked-in `assets/submission/screenshot-home.png` is the reviewed 1179×2556 recovery Home.
- Pixel 6 AVD is connected on Android 16 / API 36 and exposes Google's default recognition service.
- NDK 27.1.12297006, API 36, Build Tools 35, and CMake 3.22.1 are now installed. Microsoft OpenJDK 17 is installed. The Java 25 attempt failed in native configuration and worker startup; the interrupted Java 17 retry left no APK. The successful CI development APK (run 36631379645) was installed with adb. Metro is running on port 8082 in CI mode after a OneDrive watcher timeout. After reboot and restarting Metro with CI=true and NODE_OPTIONS=--dns-result-order=ipv4first, the current app bundled and loaded successfully on Pixel 6. The empty Home was captured. A status-bar inset correction is implemented and awaits recapture. Real spoken transcription is awaiting a human microphone check.

## Known P0 gaps

- Spoken multi-clause transcription, stop/retry, and denied-permission flows need real Android verification.
- Receipt now supports title, kind, local date/time, duration, and explicit clarification review. Typecheck, lint, and 24 tests pass; Android interaction and visual review remain pending.
- Plan, Focus, paywall, and Lab still use the prototype visual system.
- Scheduled nudge timing/cancellation/frequency and RevenueCat restore remain unverified.
- Empty-state Home and keyboard interaction need a local Pixel 6 pass.
- No final demo video has been recorded.

## Environment note

For local Android commands, use Microsoft OpenJDK 17 at `C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot` and the SDK at `C:\Users\Emma0\AppData\Local\Android\Sdk`. NDK `27.1.12297006` is installed. The previous empty directory was moved to `C:\Users\Emma0\AppData\Local\Android\Sdk\ndk\27.1.12297006.incomplete-20260929` before Gradle attempted a clean reinstall.

## NEXT ACTION

Verify the current Home and Receipt on Android, including a real spoken multi-clause dump and corrected receipt persistence, then extend the visual system to Plan and Focus.
