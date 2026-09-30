# Decision log

## 2026-09-29 — Product and first slice

- **Android-first Expo + TypeScript:** matches the agreed implementation direction and permits a fast local build. Native integrations will use a development build.
- **Fixture parser first:** complete and verify the local relief loop before adding a network dependency. Gemini remains a narrow adapter for extraction.
- **SQLite as source of truth:** items must survive restart, while ranking and Home are derived from stored items plus an injected Clock.
- **One NOW, up to two NEXT:** preserves the calm default. Plan provides the complete view.
- **RevenueCat Test Store:** required integration without a platform store listing; actual purchase behavior must be verified on Android before claiming completion.
- **Local repository initialization:** the user-specified folder was empty. GitHub remote was provided but network access is currently unavailable from the environment.
- **Offline fixture is deliberately narrow:** it recognizes one published demo sentence. All other text becomes one unchanged item with null timing rather than a fake interpretation.
- **No Android claim from a bundle:** Expo's Android export proves bundling only. SQLite persistence still needs an emulator or device run.

- **Plan uses a seven-day strip:** List keeps every active item visible; Calendar is a light inspection view, not a full calendar replacement.
- **Focus persists active state:** start and end update SQLite; completion closes focus and recomputes Home.

- **Nudges are local and bounded:** Gentle schedules one comfortable-start reminder; Persistent at most two. Unknown deadlines and completed items schedule none.
- **Coby Lab is development-only:** seed/clear data, advance a DemoClock, trigger a local nudge, and inspect integration state without real-time waiting.

- **Date and time precision are separate:** a date-only phrase sets dueDate without an invented dueAt. Timed nudges require an exact user-stated clock time.
- **Gemini model updated from live evidence:** the older Flash Lite model returned 404 for this key; Gemini 3.5 Flash Lite passed a real anchored extraction smoke test.
- **Test Store key is development-only:** the app skips Test Store configuration in release builds because RevenueCat intentionally rejects Test Store keys there.
- **Coby orb icon is drawn programmatically:** warm ivory and one violet sphere match the design system and replace Expo placeholder assets.

- **Conservative time parsing:** exact deadlines require an explicit clock expression. Ambiguous ‘at 8’ and generic ‘on’ cannot authorize an invented timestamp.
- **Completion persists before notification cleanup:** a scheduler failure can warn the user but cannot turn a saved completion back into an apparent failure.

## 2026-09-29 — Android test baseline

- **Use Android 16 / API 36 as the primary emulator target:** Expo SDK 57 compiles and targets API 36, and the GitHub Android workflows use API 36. Android 17 / API 37 is still labeled preview in the installed Android Studio device dialog, so it is not the baseline for this submission test.
- **Pixel 6, Google APIs, x86_64:** a practical phone-sized local emulator profile for layout and runtime checks. Submission screenshot resolution is set separately by the capture script.


## 2026-09-29 — RevenueCat test gate

- **Keep the default offering identifier and package layout:** replace only its Monthly product with coby_plus_monthly at $4.99/month, attach it to coby_plus, and leave Yearly and Lifetime unchanged. The existing Test Store product already had the selected price, so no duplicate was created.
- **Sandbox purchase verification:** a valid Test Store transaction is development-only; it unlocked Persistent reminders in Coby and appeared active in the RevenueCat state diagnostic. Restore still needs a separate check.


## 2026-09-29 — Deterministic behavior checks

- **Lint targets maintained TypeScript:** run ESLint against `App.tsx`, `index.ts`, `src`, and `tests` so Expo caches and generated Android output cannot slow or distort the quality gate.

## 2026-09-29 — P0 product recovery

- **Reclassify the existing app as a functional prototype:** working plumbing is not completed P0 when the capture hierarchy, voice trust, receipt correction, and visual system diverge from product canon.
- **Merge Arrival, Home, and Capture around an adaptive composer:** an expanded composer carries the empty state; a compact composer remains visible above NOW when items exist. Capture no longer hides behind a bottom CTA.
- **Use the orb as state, not decoration:** idle, listening, thinking, and settled variants communicate what Coby is doing, with reduced-motion support.
- **Tap-to-speak with explicit Done:** preserve text typed before dictation, accumulate Android's segmented final results, display interim words, and map recognizer failures to specific recovery copy.
- **Android-first is now explicit product canon:** P0 quality and verification target the Pixel 6 phone class and API 36 before adding iPhone-specific scope.
- **Old submission screenshot is stale:** it remains historical evidence until a verified screenshot of the recovered interface replaces it.
- **NDK repair is an environment blocker:** the empty `27.1.12297006` folder was moved aside; Gradle's clean reinstall reached the download and failed with a connection reset.

- **Release demo state requires an explicit flag:** Coby Lab stays development-only. `EXPO_PUBLIC_COBY_DEMO_MODE=true` auto-seeds the fixture on a clean release install for deterministic CI capture and demo rehearsal.

## 2026-09-29 — Home finish review

- **Treat Android capture as product evidence:** the release screenshot must come from an API 36 emulator at the required 1179×2556 size; a browser or JavaScript bundle is not visual proof.
- **Keep secondary actions touchable:** Plan, explanation, and reminder actions meet the 48 dp Android touch-target floor even when their visual treatment stays quiet.
- **Approve Home as the visual reference, not P0 as a whole:** Receipt, Plan, Focus, paywall, and Lab must inherit the system, while speech and remaining integration checks stay open.

## 2026-09-30 — Local Android recovery

- Use Microsoft OpenJDK 17 for local Gradle, matching CI; Android Studio's Java 25 caused native configuration failures.
- Install the successful CI development APK for runtime verification while avoiding another full local native compile. Metro still serves the current local app code.

## 2026-09-30 — Correctable receipt

- Receipt details expand on demand so title, kind, date/time, and duration can be corrected without crowding the initial confirmation.
- Blank fields stay null; invalid dates, time without a date, nonpositive durations, and unchecked ambiguity cannot be saved. Original source words remain preserved.
- Five receipt tests cover nulls, invalid dates, local time round trips, clearing dates, and explicit ambiguity review.

- Keep Metro on localhost with IPv4 preferred for ADB reverse. CI=true avoids the OneDrive watch timeout. LAN mode was rejected by automatic approval review because it could expose development keys.
- Apply the Android status-bar inset to the root after the local empty-state capture exposed a wordmark overlap.

## 2026-09-30 — Centered companion and bottom capture

The user rejected the earlier Home and supplied an orb-led reference. Home now centers a pearlescent violet sphere, places NOW/NEXT above a fixed bottom text/voice dock, and keeps Plan inspectable. This explicit user correction supersedes the older layout rule. Functional recording-state motion is within P0; no P1 modes or features were added. The sphere was generated for Coby and is a transparent local asset, with native transform animation and reduced-motion support.

Speech volumechange events drive the sphere's recording response. Ending a recognition attempt with no transcript now gives an explicit no-words recovery message, rather than silently returning to idle.

The emulator's hw.audioInput was enabled but its gRPC MicrophoneState.realAudioEnabled was false. Using the installed SDK emulator_controller.proto API, scripts/emulator-microphone.cjs --enable changed and re-read it as true. This confirms host microphone forwarding configuration; it does not prove spoken transcription. The script uses the running emulator's local token in memory and never prints or commits it.
