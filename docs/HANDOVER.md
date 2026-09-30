# Handover

## Status

P0 remains **in progress**. The user rejected the earlier capture-above-tasks layout on September 30 and provided a central-orb reference with bottom controls. Their correction supersedes the earlier internal Home visual review.

## Current checkpoint

Home now has a large central pearlescent violet orb, quiet brand copy, a smaller orb for returning users, one NOW and at most two NEXT above a fixed bottom capture dock. Speak/Done and editable text remain directly visible. The orb breathes and gently turns by state; native microphone-volume events drive its recording response. Reduced-motion preferences disable motion. This is P0 recovery requested by the user, not new P1 scope.

A voice attempt with no recognized words now ends with an explicit recovery message. Existing typed text and interim/final transcript handling remain intact. **The user's live voice attempt failed.** The emulator's host microphone forwarding was found off even though its audio hardware was enabled. It has been enabled and re-read as on through the installed SDK microphone-state RPC. Actual spoken transcription is still unverified after that correction; do not claim voice is fixed.

The transparent orb was generated for Coby and stored in assets/coby-orb.png. No new native dependency is needed. The September 30 empty Home rendered on the connected Pixel 6 Android 16/API 36 development build, with correct status-bar inset. The development-client gear overlay is not production UI. The previous submission screenshot is stale and must be replaced after final P0 acceptance.

## Verified baseline retained

- Fixture and live Gemini sample extraction previously passed on Pixel 6 with unknown timing preserved.
- SQLite persistence, completion recomputation, Plan List/Calendar, Focus start/end/complete, and immediate local notification previously passed.
- RevenueCat Test Store product coby_plus_monthly is $4.99/month and mapped to coby_plus. Purchase previously unlocked Persistent; restore remains pending.
- Receipt correction covers title, kind, date/time, duration, and explicit review of ambiguity. Unit verification passed; current device interaction is pending.
- Current typecheck, lint, and all 24 tests passed after Home/orb/speech changes.
- SDK microphone-state request returned off; enabling returned success; a follow-up read returned on.

## Known P0 gaps

- Real multi-clause voice transcription, stop/retry, permission denial, and actual audio-reactive motion need verification.
- Text entry, fixture receipt acceptance, local save-to-NOW, and completion passed on the current Home. Software-keyboard resize and full receipt corrections remain pending.
- Plan, Focus, paywall, and Lab still use the older visual system.
- Future nudge timing/rescheduling/cancellation and RevenueCat restore remain pending.
- No final demo video recorded; screenshot and submission polish follow the P0 acceptance matrix.

## Local environment

Repository: C:\Users\Emma0\OneDrive\Documents\GitHub\coby. Pixel 6 AVD is connected. Use Microsoft OpenJDK 17 at C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot and SDK C:\Users\Emma0\AppData\Local\Android\Sdk. NDK 27.1.12297006 is installed. The installed development APK came from successful CI run 36631379645.

Metro runs locally on port 8082 with CI=true and NODE_OPTIONS=--dns-result-order=ipv4first; adb reverse routes tcp:8082. CI mode avoids the OneDrive watcher failure, but edits require restarting Metro. Keep the server localhost-only. Do not print raw Expo JSON logs or .env values: these may contain credentials.

Use `node scripts/emulator-microphone.cjs` to inspect host forwarding, or add `--enable` to enable and verify it. It reads the local running emulator token only in memory. This is emulator configuration, not an app speech guarantee. The user subsequently retried Speak and reported the network-error message.

## Latest Android interaction evidence

After dismissing Android/Gboard stylus onboarding, the bottom field accepted the synthetic sentence "Remember to water the plants". The fixture parser returned one intact item with no date; receipt acceptance saved it and Home displayed it as NOW above the dock. Done removed it and returned Home to the large-orb empty state. Empty and populated Home were inspected inline on Pixel 6; subjective approval remains for the user. No real personal dump was used.

Metro reported emulator DNS failures resolving api.revenuecat.com during this session. Earlier successful billing checks remain historical; current online services are not verified.

## Speech network recovery checkpoint

The user reported the network error after host microphone forwarding was enabled. Android now reports VALIDATED internet connectivity, DNS resolved google.com, no HTTP proxy is configured, and host forwarding remained on. This does not prove every speech endpoint is reachable. Installed recognizers are Google Speech Recognition/Synthesis (default com.google.android.tts) and Android System Intelligence (com.google.android.as).

Coby now checks the actual installed offline English locale before choosing requiresOnDeviceRecognition. A supported locale alone never counts as installed. The native query is bounded and failures keep online voice available. On a network error, Home offers offline English setup. Setup has separate state, keeps text/task use available, and bounds waiting; readiness is rechecked before any success message. Lab exposes check/setup controls.

The current emulator did not confirm a usable offline English model. Its download request was rejected with native client error 5, so voice is still NOT passed. The download failure was captured from the ExpoSpeechService native error log without user audio or keys. A reboot/retry is in progress. Typecheck, lint, and all 27 tests passed, including unavailable/unsupported/installed language and query failure/timeout cases.

## NEXT ACTION

Resolve native Android speech-service rejection and verify real multi-clause transcription, stop/retry, and permission fallback.
