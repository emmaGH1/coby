# Handover

## Status

Core P0 flows are implemented. The GitHub Android debug build passed and the hosted release app passed Android emulator capture; the validated 1179×2556 screenshot is included in the repository and task outputs.

Local device verification passes on a Pixel 6 AVD running Android 16 / API 36 with Google APIs and x86_64. The CI-built debug APK opened through the local loopback-only Metro connection. Fixture and Gemini text capture, SQLite persistence across app restart, NOW recomputation after completion, Plan List/Calendar, focus start/end, and an immediate local nudge were exercised. Test items and the active test notification were cleared afterward.

The base app/screenshot commit is db0fc3f, before the documentation checkpoints. The local Gradle build still needs a complete NDK 27.1.12297006 install: the SDK folder exists but is missing source.properties (CXX1101), so emulator runs used the CI-built APK.

## Completed

- Product canon, implementation plan, design system, guardrails, test matrix, demo plan, decisions, handover, and environment template.
- Expo TypeScript app with local SQLite capture, receipt, Home, completion, Plan List/Calendar, and focus.
- Deterministic prioritization, NOW/NEXT limits, clock abstraction, Gentle/Persistent nudge rules, local notification scheduler, and Coby Lab.
- Voice capture with text fallback, fixture parser, Gemini extraction adapter, RevenueCat Plus paywall/purchase/restore adapter.
- Date-only deadlines stay separate from exact times; missing dates and durations stay null.
- Coby app icon, README, MIT license, GitHub Android build and screenshot workflows, and the verified Home screenshot asset.

## Evidence

- npm run typecheck, npm run lint, and npm test (17 tests): passed. ESLint skips the generated Android prebuild tree.
- Fixture and live Gemini extraction on the Pixel 6: passed. Each sample produced three items; the date-only assignment had no invented hour, and “buy data” stayed undated.
- Saved items and completion state survived force-stop and app restart after reconnecting the development build.
- Completing the NOW call surfaced the assignment; Home showed one NOW and at most two NEXT.
- Plan List showed active items. Calendar showed the assignment on Sep 30, 2026; undated items remained in List.
- Focus showed one item; End focus returned to Home, and Complete persisted the call as done and recomputed NOW to the assignment.
- Coby Lab’s immediate nudge appeared in Android notifications as “Call Daniel” / “This is a good time to start.” Scheduled future timing, cancellation, and frequency limits remain unverified.
- Android granted microphone permission and started speech recognition; with no audio input, recognition returned no speech and Coby showed its text fallback. Spoken transcription remains unverified.
- RevenueCat Test Store: product coby_plus_monthly is $4.99/month and attached to entitlement coby_plus. The default offering monthly package now uses that product; Yearly and Lifetime packages stayed unchanged. A valid Test Store purchase unlocked coby_plus and the app returned to Home with Persistent reminders enabled. Coby Lab confirmed Plus active. Restore remains untested. See [RevenueCat Test Store documentation](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store).
- Coby Lab cleared the seeded tasks and local reminders after verification. The RevenueCat Test Store sandbox customer remains Plus active from the simulated purchase.
- Android JavaScript bundle export and native prebuild: passed.
- [GitHub Android debug build](https://github.com/emmaGH1/coby/actions/runs/36581594892): passed.
- [Latest Android screenshot run](https://github.com/emmaGH1/coby/actions/runs/36586728480): release compile, emulator capture, and 1179×2556 PNG validation passed. Visual review confirms the capture and Plan actions fit on the first screen.
- Local Gradle compilation did not complete because the Android NDK download remained at 0 bytes; this was an SDK download issue, not a source compile failure.

## Human setup

RevenueCat configuration is complete: the $4.99 monthly product coby_plus_monthly is attached to coby_plus and the default offering. The Test Store purchase and Persistent reminder gate passed. Restore remains to be verified.

For a local Gradle build, install or repair NDK 27.1.12297006 through Android Studio SDK Manager. The existing directory is incomplete: source.properties is missing and Gradle reports CXX1101.

## NEXT ACTION

Install NDK 27.1.12297006 through Android Studio SDK Manager or sdkmanager, then rerun the local Gradle debug build.
