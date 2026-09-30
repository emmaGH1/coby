# P0 execution audit

Date: 2026-09-29

This audit compares the shipped code with `PRODUCT.md`, `IMPLEMENTATION_PLAN.md`, `DESIGN_SYSTEM.md`, and the intended relief loop. A data path counts as working only when its behavior is verified. A screen counts as complete only when its hierarchy, copy, interaction, and Android render express the product canon.

## Executive finding

The previous build was a functional prototype, not completed P0. It proved parsing, persistence, deterministic ranking, Plan, Focus, notifications, and RevenueCat wiring. It did not make the brain dump the core interaction, did not prove spoken transcription, and did not reach the promised visual quality. Its Home screen read as a conventional task screen with a decorative orb and a capture button added at the bottom.

P0 is now **in progress**. The first recovery slice replaces the old Arrival/Home/Capture split with an adaptive Home composer, adds explicit voice states and service checks, preserves typed text during dictation, and gives the orb functional states. This slice passes typecheck, lint, and unit tests. Its populated Home state also passed a 1179×2556 Android release render and an Android-specific finish review. Spoken transcription still requires hands-on device verification.

## Product gap matrix

| P0 area | Previous state | Current state | Required to close |
| --- | --- | --- | --- |
| Arrival | Branded gate delayed the first dump behind “Come in.” | Empty Home now leads with the brand promise and expanded dump composer. | Verify the empty first-run state and keyboard behavior on the local Pixel 6. |
| Brain dump | Text field and mic lived on a secondary screen behind a bottom CTA. | Adaptive composer is always present on Home; expanded when clear, compact when Coby holds items. | Visual review passed for the populated state; verify text entry, receipt, and save on the local Pixel 6. |
| Voice | Permission request and generic fallback only; spoken result never verified. | Checks Android recognizer availability and services, exposes listening/Done states, appends partial/final segments, preserves pre-typed words, and gives recoverable errors. | Speak a multi-clause dump on Android and confirm live/final transcript, stop, retry, denial, and typed fallback. |
| Orb | Static concentric circles used as decoration. | Animated idle, listening, thinking, and settled states with reduced-motion support. | Verify motion and accessibility on Android. |
| Understand | Fixture and live Gemini extraction passed the demo sentence. | Logic unchanged and still narrow by design. | Test network failure and ambiguous clarification behavior. |
| Receipt | Shows extracted items and allows title edits only. | Expandable correction for kind, date/time, and duration plus explicit clarification review is implemented; rule tests pass. | Verify corrected receipt save and visual hierarchy on Android. |
| Hold | SQLite persistence and completion survived restart. | Passed behavior; unchanged. | Regression check after the redesigned capture flow. |
| Home | Correct one NOW and up to two NEXT, but generic hierarchy and capture was buried. | Capture leads; NOW and NEXT follow with quieter controls and a persistent Plan path. | Populated Android render passed; verify the empty state and keyboard interaction locally. |
| Plan | List/day behavior passed. Visual treatment remains from prototype. | Behavior passed; visual system is inconsistent with the new Home. | Redesign after capture/voice verification while preserving inspectability. |
| Focus | Start, end, and complete passed. Screen remains visually basic. | Behavior passed; visual system is inconsistent with the new Home. | Redesign after capture/voice verification. |
| Rank/explanation | Deterministic rules and explanations covered by unit tests. | Passed. | Keep regression coverage. |
| Nudges | Immediate local notification passed. Future timing, cancellation, and caps were not exercised on device. | Partial. | Verify reschedule, completion cancellation, and Gentle/Persistent frequency on Android. |
| Commitment/billing | $4.99 Test Store purchase unlocked `coby_plus`; restore untested. | Partial. | Verify restore and re-check the gate after UI changes. |
| Visual system | Broad colors matched the brief, but typography, layout, motion, and component craft did not. | Home now uses Manrope, revised warm-paper tokens, authored icon geometry, functional orb states, and a clearer hierarchy. | Home passed the finish review after Android touch targets were raised to 48 dp; extend this system to Receipt, Plan, Focus, Lab, and paywall. |
| Architecture | Most UI and orchestration lived in one large `App.tsx`. | Home, orb, icons, theme, and speech helpers are extracted. | Continue moving remaining screens into thin presentational components as they are redesigned. |
| Demo/submission | Deterministic seed exists; old screenshot represents the rejected UI; no final demo recorded. | Validated Home screenshot now represents the recovery build. | Record the sub-two-minute demo only after all P0 rows pass. |

## Recovery order

1. Verify the new adaptive composer with real text and spoken transcription on the local Pixel 6.
2. Complete Receipt correction for all extracted facts and clarification states.
3. Apply the visual system to Plan and Focus without expanding scope.
4. Verify scheduled nudge lifecycle and RevenueCat restore.
5. Run the full P0 matrix, freeze features, then replace the screenshot and record the demo.

## Current blockers

- The NDK, API 36, Build Tools 35, CMake, and Java 17 are installed. The local Java 17 build was interrupted before producing an APK. The prior empty package directory was moved to `27.1.12297006.incomplete-20260929`; Gradle attempted a clean reinstall and reported the connection reset.
- Spoken transcription cannot be claimed until a real voice reaches the emulator/device recognizer.
- The populated Home has passed release rendering and visual review; the empty state and keyboard interaction still need local Pixel 6 verification.

## September 30 correction from the user

The prior Home layout is rejected despite earlier internal visual review. The new reference requires central orb presence, animated recording feedback, and bottom capture with obligations above it. These requirements are implemented in the new Home. Empty Android rendering is verified; populated/keyboard interaction verification is in progress. Voice failed for the user; the emulator host microphone was subsequently found disabled and enabled through its SDK API. Real spoken transcription is still an open acceptance gate.

The September 30 fixture text loop has now passed on the current Android Home: bottom input → undated receipt → acceptance/local save → NOW above dock → Done → clear Home. Empty and one-item returning layouts are verified. Live voice and software-keyboard behavior remain open gates.
