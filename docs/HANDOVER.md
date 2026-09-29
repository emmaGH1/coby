# Handover

## Status

Core P0 flows are implemented. The GitHub Android debug build passed and the hosted release app passed Android emulator capture; the validated 1179×2556 screenshot is included in the repository and task outputs.

Local device verification passes on a Pixel 6 AVD running Android 16 / API 36 with Google APIs and x86_64. The CI-built debug APK opened through the local loopback-only Metro connection. Fixture and Gemini text capture, SQLite persistence across app restart, NOW recomputation after completion, Plan List/Calendar, focus start/end, and an immediate local nudge were exercised. Test items and the active test notification were cleared afterward.

The base app/screenshot commit is db0fc3f, before the documentation checkpoints. The local Gradle build still needs the Android NDK package: its SDK download stalled at 0 bytes, so emulator runs used the CI-built APK.

## Completed

- Product canon, implementation plan, design system, guardrails, test matrix, demo plan, decisions, handover, and environment template.
- Expo TypeScript app with local SQLite capture, receipt, Home, completion, Plan List/Calendar, and focus.
- Deterministic prioritization, NOW/NEXT limits, clock abstraction, Gentle/Persistent nudge rules, local notification scheduler, and Coby Lab.
- Voice capture with text fallback, fixture parser, Gemini extraction adapter, RevenueCat Plus paywall/purchase/restore adapter.
- Date-only deadlines stay separate from exact times; missing dates and durations stay null.
- Coby app icon, README, MIT license, GitHub Android build and screenshot workflows, and the verified Home screenshot asset.

## Evidence

- npm run typecheck, npm run lint, and npm test (11 tests): passed.
- Fixture and live Gemini extraction on the Pixel 6: passed. Each sample produced three items; the date-only assignment had no invented hour, and “buy data” stayed undated.
- Saved items and completion state survived force-stop and app restart after reconnecting the development build.
- Completing the NOW call surfaced the assignment; Home showed one NOW and at most two NEXT.
- Plan List showed active items. Calendar showed the assignment on Sep 30, 2026; undated items remained in List.
- Focus showed one item and returned to Home after End focus. Completing from the focus screen was not tested.
- Coby Lab’s immediate nudge appeared in Android notifications as “Call Daniel” / “This is a good time to start.” Scheduled future timing, cancellation, and frequency limits remain unverified.
- Android granted microphone permission and started speech recognition; with no audio input, recognition returned no speech and Coby showed its text fallback. Spoken transcription remains unverified.
- RevenueCat’s paywall loaded the monthly Test Store product at $9.99. The user selected $4.99/month. Test Store product prices are set at product creation; a different price requires a replacement product and an offering update. See [RevenueCat Test Store documentation](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store).
- Coby Lab cleared the test items. RevenueCat diagnostics reported the monthly Test Store package ready and Plus inactive. Purchase, restore, and coby_plus entitlement mapping were not verified.
- Android JavaScript bundle export and native prebuild: passed.
- [GitHub Android debug build](https://github.com/emmaGH1/coby/actions/runs/36581594892): passed.
- [Latest Android screenshot run](https://github.com/emmaGH1/coby/actions/runs/36586728480): release compile, emulator capture, and 1179×2556 PNG validation passed. Visual review confirms the capture and Plan actions fit on the first screen.
- Local Gradle compilation did not complete because the Android NDK download remained at 0 bytes; this was an SDK download issue, not a source compile failure.

## Human setup

The RevenueCat dashboard is at its sign-in page in the Codex browser. Sign in there, then create a monthly Test Store product priced at $4.99 and attach it to the current default offering’s monthly package. Confirm the product unlocks coby_plus. RevenueCat does not allow changing a saved Test Store product’s price in place.

For a local Gradle build, install NDK 27.1.12297006 through Android Studio SDK Manager and rerun it.

## NEXT ACTION

After dashboard sign-in, replace the current $9.99 Test Store product with a $4.99 monthly product, confirm its coby_plus mapping, then verify the simulated purchase/restore and free-versus-Plus gate.
