# Handover

## Status

Core P0 flows are implemented. The GitHub Android debug build and first hosted emulator screenshot run passed. The capture script verified a 1179×2556 PNG. Visual review showed the main NOW/NEXT content but placed the primary capture action below the first screen, so Home spacing has been tightened; TypeScript passes and the revised screenshot is awaiting recapture.

The local machine has Android Studio and the Android SDK, but no emulator or phone has appeared in `adb devices` yet. Native device behavior is still unverified locally. RevenueCat entitlement and purchase behavior also remain unverified.

`main` is published at commit `7b73f2a`; the latest handover and layout changes are committed locally and awaiting push after a transient GitHub server error.

## Completed

- Product canon, implementation plan, design system, guardrails, test matrix, demo plan, decisions, handover, and environment template.
- Expo TypeScript app with local SQLite capture, receipt, Home, completion, Plan List/Calendar, and focus.
- Deterministic prioritization, NOW/NEXT limits, clock abstraction, Gentle/Persistent nudge rules, local notification scheduler, and Coby Lab.
- Voice capture with text fallback, fixture parser, Gemini extraction adapter, RevenueCat Plus paywall/purchase/restore adapter.
- Date-only deadlines stay separate from exact times; missing dates and durations stay null.
- Coby app icon, README, MIT license, GitHub Android build, and emulator screenshot workflows.

## Evidence

- `npm run typecheck`, `npm run lint`, and `npm test` (11 tests): passed.
- Live Gemini sample extraction: passed; the date-only item had no invented hour.
- Android JavaScript bundle export and native prebuild: passed.
- [GitHub Android debug build](https://github.com/emmaGH1/coby/actions/runs/36581594892): passed.
- [First Android screenshot run](https://github.com/emmaGH1/coby/actions/runs/36584453422): release compile, emulator capture, and 1179×2556 PNG validation passed. After visual review, Home spacing was tightened; recapture is pending.
- Local `adb devices`: no emulator or phone detected at last check.
- RevenueCat monthly Test Store package is visible; `coby_plus` entitlement and a purchase have not been verified.

## Human setup

- Start a Pixel 6 Android 16 / API 36 virtual device with Google APIs and x86_64 for local runtime verification.
- In RevenueCat, attach the monthly Test Store product to the `coby_plus` entitlement and default offering, then verify purchase and restore in a development build.

## NEXT ACTION

Start the Pixel 6 API 36 emulator and run Coby's development build. Verify capture through save, persistence after restart, speech, local notifications, and the Coby Plus gate; record device evidence and fix any native failures.
