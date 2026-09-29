# Handover

## Status

Core P0 flows are implemented. The Android debug build passed in GitHub Actions, and the release build for the real-device screenshot workflow compiled successfully. The hosted emulator is now running the capture step. The local machine has Android Studio and the Android SDK, but `adb` currently reports no running emulator or attached phone, so native behavior is not yet verified on this PC. RevenueCat entitlement and purchase behavior also remain unverified.

`main` is published at commit `7b73f2a`.

## Completed

- Product canon, implementation plan, design system, guardrails, test matrix, demo plan, decisions, handover, and environment template.
- Expo TypeScript app with local SQLite capture, receipt, Home, completion, Plan List/Calendar, and focus.
- Deterministic prioritization, NOW/NEXT limits, clock abstraction, Gentle/Persistent nudge rules, local notification scheduler, and Coby Lab.
- Voice capture with text fallback, fixture parser, Gemini extraction adapter, RevenueCat Plus paywall/purchase/restore adapter.
- Date-only deadlines remain separate from exact times; missing dates and durations stay null.
- Coby app icon, README, MIT license, GitHub Android build workflow, and emulator screenshot capture workflow.

## Evidence

- `npm run typecheck`, `npm run lint`, and `npm test` (11 tests): passed.
- Live Gemini sample extraction: passed; date-only item had no invented hour.
- Android JavaScript bundle export and native prebuild: passed.
- [GitHub Android debug build](https://github.com/emmaGH1/coby/actions/runs/36581594892): passed.
- [Android screenshot capture workflow](https://github.com/emmaGH1/coby/actions/runs/36584453422): release APK compile passed; emulator capture is in progress.
- Local `adb devices`: no emulator or phone currently connected.
- RevenueCat Test Store monthly package is visible; `coby_plus` entitlement and a purchase have not been verified.

## Human setup

- Start a Pixel 6 Android 16 / API 36 virtual device with Google APIs and x86_64 for local runtime verification.
- In RevenueCat, attach the monthly Test Store product to the `coby_plus` entitlement and default offering, then verify purchase and restore in a development build.

## NEXT ACTION

Start the Pixel 6 API 36 emulator and run the development build. Verify capture through save, persistence after restart, speech, local notifications, and the Coby Plus gate; record device evidence and fix any native failures.
