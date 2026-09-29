# P0 execution audit

Date: 2026-09-29

This audit compares the shipped code with `PRODUCT.md`, `IMPLEMENTATION_PLAN.md`, `DESIGN_SYSTEM.md`, and the intended relief loop. A data path counts as working only when its behavior is verified. A screen counts as complete only when its hierarchy, copy, interaction, and Android render express the product canon.

## Executive finding

The previous build was a functional prototype, not completed P0. It proved parsing, persistence, deterministic ranking, Plan, Focus, notifications, and RevenueCat wiring. It did not make the brain dump the core interaction, did not prove spoken transcription, and did not reach the promised visual quality. Its Home screen read as a conventional task screen with a decorative orb and a capture button added at the bottom.

P0 is now **in progress**. The first recovery slice replaces the old Arrival/Home/Capture split with an adaptive Home composer, adds explicit voice states and service checks, preserves typed text during dictation, and gives the orb functional states. This slice has passed typecheck, lint, and unit tests; its Android render and spoken transcription still require device verification.

## Product gap matrix

| P0 area | Previous state | Current state | Required to close |
| --- | --- | --- | --- |
| Arrival | Branded gate delayed the first dump behind “Come in.” | Empty Home now leads with the brand promise and expanded dump composer. | Verify first-run Android render and keyboard behavior. |
| Brain dump | Text field and mic lived on a secondary screen behind a bottom CTA. | Adaptive composer is always present on Home; expanded when clear, compact when Coby holds items. | Android visual review and end-to-end fixture save. |
| Voice | Permission request and generic fallback only; spoken result never verified. | Checks Android recognizer availability and services, exposes listening/Done states, appends partial/final segments, preserves pre-typed words, and gives recoverable errors. | Speak a multi-clause dump on Android and confirm live/final transcript, stop, retry, denial, and typed fallback. |
| Orb | Static concentric circles used as decoration. | Animated idle, listening, thinking, and settled states with reduced-motion support. | Verify motion and accessibility on Android. |
| Understand | Fixture and live Gemini extraction passed the demo sentence. | Logic unchanged and still narrow by design. | Test network failure and ambiguous clarification behavior. |
| Receipt | Shows extracted items and allows title edits only. | Visual behavior unchanged in this slice. | Allow correction of kind, date/time, and duration without inventing values; surface clarification questions. |
| Hold | SQLite persistence and completion survived restart. | Passed behavior; unchanged. | Regression check after the redesigned capture flow. |
| Home | Correct one NOW and up to two NEXT, but generic hierarchy and capture was buried. | Capture leads; NOW and NEXT follow with quieter controls and a persistent Plan path. | Android screenshot review across empty and populated states. |
| Plan | List/day behavior passed. Visual treatment remains from prototype. | Behavior passed; visual system is inconsistent with the new Home. | Redesign after capture/voice verification while preserving inspectability. |
| Focus | Start, end, and complete passed. Screen remains visually basic. | Behavior passed; visual system is inconsistent with the new Home. | Redesign after capture/voice verification. |
| Rank/explanation | Deterministic rules and explanations covered by unit tests. | Passed. | Keep regression coverage. |
| Nudges | Immediate local notification passed. Future timing, cancellation, and caps were not exercised on device. | Partial. | Verify reschedule, completion cancellation, and Gentle/Persistent frequency on Android. |
| Commitment/billing | $4.99 Test Store purchase unlocked `coby_plus`; restore untested. | Partial. | Verify restore and re-check the gate after UI changes. |
| Visual system | Broad colors matched the brief, but typography, layout, motion, and component craft did not. | Home now uses Manrope, revised warm-paper tokens, authored icon geometry, functional orb states, and a clearer hierarchy. | Render review; then extend the approved system to Receipt, Plan, Focus, Lab, and paywall. |
| Architecture | Most UI and orchestration lived in one large `App.tsx`. | Home, orb, icons, theme, and speech helpers are extracted. | Continue moving remaining screens into thin presentational components as they are redesigned. |
| Demo/submission | Deterministic seed exists; old screenshot represents the rejected UI; no final demo recorded. | Old screenshot is historical evidence only. | Capture a new validated screenshot and record the sub-two-minute demo after P0 passes. |

## Recovery order

1. Render and verify the new adaptive composer and spoken transcription on Pixel 6.
2. Complete Receipt correction for all extracted facts and clarification states.
3. Apply the visual system to Plan and Focus without expanding scope.
4. Verify scheduled nudge lifecycle and RevenueCat restore.
5. Run the full P0 matrix, freeze features, then replace the screenshot and record the demo.

## Current blockers

- Local Android compilation reaches the SDK but the NDK `27.1.12297006` download resets before completion. The prior empty package directory was moved to `27.1.12297006.incomplete-20260929`; Gradle attempted a clean reinstall and reported the connection reset.
- Spoken transcription cannot be claimed until a real voice reaches the emulator/device recognizer.
- The new Home has not yet produced an Android screenshot, so visual quality remains unapproved.
