# Handover

## Status

Core P0 flows are implemented. The GitHub Android debug build passed and the hosted release app passed Android emulator capture; the validated 1179×2556 screenshot is included in the repository and task outputs.

Local device verification now passes on a Pixel 6 AVD running Android 16 / API 36 with Google APIs and x86_64. The CI-built debug APK opened through the local loopback-only Metro connection. Text capture, fixture and configured Gemini extraction, SQLite persistence across app restart, NOW recomputation after completion, and Plan List/Calendar were exercised. Sample data was cleared after testing.

The base app/screenshot commit is db0fc3f, before this documentation checkpoint. The local Gradle build still needs the Android NDK package: its SDK download stalled at 0 bytes, so the emulator run used the CI-built APK.

## Completed

- Product canon, implementation plan, design system, guardrails, test matrix, demo plan, decisions, handover, and environment template.
- Expo TypeScript app with local SQLite capture, receipt, Home, completion, Plan List/Calendar, and focus.
- Deterministic prioritization, NOW/NEXT limits, clock abstraction, Gentle/Persistent nudge rules, local notification scheduler, and Coby Lab.
- Voice capture with text fallback, fixture parser, Gemini extraction adapter, RevenueCat Plus paywall/purchase/restore adapter.
- Date-only deadlines stay separate from exact times; missing dates and durations stay null.
- Coby app icon, README, MIT license, GitHub Android build and screenshot workflows, and the verified Home screenshot asset.

## Evidence

- npm run typecheck, npm run lint, and npm test (11 tests): passed.
- Live Gemini extraction on the Pixel 6: passed. The sample produced three items; the date-only assignment had no invented hour, and “buy data” stayed undated.
- Fixture parser extraction on the Pixel 6: passed with the same three-item sample.
- Saved items and completion state survived force-stop and app restart after reconnecting the development build.
- Completing the NOW call surfaced the assignment; Home showed one NOW and at most two NEXT.
- Plan List showed active items. Calendar showed the assignment on Sep 30, 2026; undated items remained in List.
- Coby Lab switched to configured Gemini and cleared the test items. RevenueCat diagnostics reported the monthly Test Store package ready and Plus inactive. Purchase and restore were not performed.
- Android JavaScript bundle export and native prebuild: passed.
- [GitHub Android debug build](https://github.com/emmaGH1/coby/actions/runs/36581594892): passed.
- [Latest Android screenshot run](https://github.com/emmaGH1/coby/actions/runs/36586728480): release compile, emulator capture, and 1179×2556 PNG validation passed. Visual review confirms the capture and Plan actions fit on the first screen.
- Local Gradle compilation did not complete because the Android NDK download remained at 0 bytes; this was an SDK download issue, not a source compile failure.

## Human setup

No additional Android Studio or emulator setup is needed for the verified Pixel 6 path. If a local Gradle build is needed, install NDK 27.1.12297006 through Android Studio SDK Manager and rerun it.

RevenueCat’s monthly Test Store package is visible. Verify the simulated purchase, restore, and coby_plus entitlement gate before submission.

## NEXT ACTION

Finish Android checks for speech permission/transcription, deadline notifications, and the RevenueCat Test Store purchase/restore and free-versus-Plus gate; then rerun the release and demo checks.
