# Handover

## Status

P0 remains **in progress**. The user rejected the earlier capture-above-tasks layout on September 30 and provided a central-orb reference with bottom controls. Their correction supersedes the earlier internal Home visual review.

## Current checkpoint

Home now has a large central pearlescent violet orb, quiet brand copy, a smaller orb for returning users, one NOW and at most two NEXT above a fixed bottom capture dock. Speak/Done and editable text remain directly visible. The orb breathes and gently turns by state; native microphone-volume events drive its recording response. Reduced-motion preferences disable motion. This is P0 recovery requested by the user, not new P1 scope.

A voice attempt with no recognized words now ends with an explicit recovery message. Existing typed text and interim/final transcript handling remain intact. **The user's live voice attempt failed.** The emulator's host microphone forwarding was found off even though its audio hardware was enabled. It has been enabled and re-read as on through the installed SDK microphone-state RPC. That emulator attempt remained unverified. Live two-clause transcription subsequently passed on a physical OnePlus A6010 with the reviewed voice changes; see the voice-only checkpoint below.

The transparent orb was generated for Coby and stored in assets/coby-orb.png. No new native dependency is needed. The September 30 empty Home rendered on the connected Pixel 6 Android 16/API 36 development build, with correct status-bar inset. The development-client gear overlay is not production UI. The previous submission screenshot is stale and must be replaced after final P0 acceptance.

## Verified baseline retained

- Fixture and live Gemini sample extraction previously passed on Pixel 6 with unknown timing preserved.
- SQLite persistence, completion recomputation, Plan List/Calendar, Focus start/end/complete, and immediate local notification previously passed.
- RevenueCat Test Store product coby_plus_monthly is $4.99/month and mapped to coby_plus. Purchase previously unlocked Persistent; restore remains pending.
- Receipt correction covers title, kind, date/time, duration, and explicit review of ambiguity. Unit verification passed; current device interaction is pending.
- Current typecheck, lint, and all 34 tests pass after the voice-only review.
- SDK microphone-state request returned off; enabling returned success; a follow-up read returned on.

## Known P0 gaps

- Live two-clause transcription, manual stop/retry preserving prior words, and denied-permission text fallback passed on the physical phone. Actual audio-reactive motion and offline/emulator speech remain unverified.
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

The current emulator did not confirm a usable offline English model. Its download request was rejected with native client error 5, so voice is still NOT passed. The download failure was captured from the ExpoSpeechService native error log without user audio or keys. A data-preserving cold boot restored Android app services, but System UI and Pixel Launcher repeatedly became unresponsive. Device disk has 8.2 GB free and hardware acceleration reports usable; the OS stall cause is not established. This session cannot provide a reliable voice acceptance result. Typecheck, lint, and all 27 tests passed, including unavailable/unsupported/installed language and query failure/timeout cases.

## Standard microphone compatibility checkpoint

Online recognition now uses the standard native microphone session. The installed Android module implements continuous mode with a custom audio recorder and segmented audio-source intent on Android 13+, which may be incompatible with the default online service. Continuous mode is enabled only for a confirmed installed offline model. This is a compatibility correction, not a proven root cause. Current source bundled successfully; typecheck, lint, and all 27 tests passed. Spoken transcription remains unverified because the emulator launcher continues to show ANR dialogs.

## Voice-only review and physical-device check

Scope is voice only. VoiceSession now keeps capture locked through preparation/start/stop, preserves partial words when final results are empty or the engine fails, ignores inactive/preparation end events, and allows retry after native end. App has bounded start/stop recovery and cancels capture when backgrounded or leaving Home. The mic shows Starting/Finishing during transitions; text/send cannot race a pending final result. Native error codes distinguish an uninstalled language from server/network failure. Lab displays engine/mode/error metadata without audio or transcript logging. No recording files are persisted.

The emulator had sustained high load, CPU saturation, and recurring launcher/app ANRs. Testing moved to the user's connected OnePlus A6010, Android 11/API 30, arm64, default Google app recognition service. The development APK installed and current bundle loaded over localhost USB reverse. The user confirmed both clauses of the requested synthetic phrase appeared correctly. The user also confirmed retry appends new words while preserving the previous capture, with manual Done. Native permission denial was exercised on the phone: the expected access-off message appeared and the field accepted typed text. Microphone access was restored after testing. Typecheck, lint, all 34 tests, and diff checks pass.

## Natural-pause voice correction

The user reported that the first voice checkpoint still stopped after about two seconds of initial silence and cut a longer utterance after 3–5 seconds. The short-phrase pass did not establish a usable brain-dump session. Coby now distinguishes a user dump from individual recognizer cycles: normal native end and no-speech/speech-timeout resume after release, preserving final and partial words. Done stops the whole dump, including during a pending restart. Fatal errors and background/navigation cancel restart. Older Android uses its legacy continuous silence hints; Android 13+ online capture retains the standard microphone path. Android receives a 20-second minimum and 15-second silence request, but providers can ignore these hints, so session continuation is still required.

Typecheck, lint, and all 38 tests pass. Four new scenarios cover initial silence across multiple cycles, clause/partial retention across boundaries, Done in a gap or silence, and fatal/background cancellation. The user confirmed the physical phone waits through 7 seconds of initial silence and captures all three errands over about 30 seconds with 3–4 second pauses, followed by Done. Leaving and returning to Coby showed Speak with no resumed capture. Startup now also checks foreground state after asynchronous preparation. Typecheck, lint, and all 38 tests passed again after that guard. Offline/emulator speech remains unverified.

## NEXT ACTION

Verify a longer multi-minute voice dump on the physical phone and check for dropped words across provider boundaries; keep offline/emulator acceptance separate.
