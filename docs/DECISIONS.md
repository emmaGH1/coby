# Decision log

## October 1 — Hackathon master demo video (Zero-slop, physical device capture, HyperFrames)

Authored and rendered a 95.0-second 60fps 1080p master hackathon demo video (`coby_hackathon_demo.mp4`) adhering strictly to Coby's product canon, guardrails, and anti-sloppification directives:
- **Zero simulated UI mockups:** Every frame of app footage is an authentic 1080x2340 screen recording from the physical OnePlus A6010 Android device driven by automated, reproducible ADB interactions.
- **Strict guardrails:** Completely zero medical treatment or diagnostic claims; the narrative problem is framed around cognitive overwhelm, executive fatigue, and overloaded minds.
- **Audio architecture:** Kokoro-82M TTS with young founder voice (`am_adam`) across 8 acts, backed by a custom synthesized warm neo-soul Rhodes electric piano chord bed (`bgm_lofi.wav`) at -18dB ducked level.
- **Composition contract:** Built with HyperFrames and GSAP 3.14. 0 errors, 0 warnings across lint, runtime, layout, and 71/71 WCAG AA contrast checks. Visual layout features the OnePlus chassis in Studio Calm Canvas (`#F4F3F0`) with Manrope typography and synchronized proof callouts.

## October 1 — Silence feedback follows captured words

Native nomatch/no-speech/speech-timeout can arrive during finalization after a successful transcript. Use recognized-word state from the whole VoiceSession attempt to suppress the false empty-dump warning. Preserve that state across native cycles and reset it when a new user attempt begins; typed base text does not count as new voice input. Keep recognition timing/transcript merging unchanged. Genuine empty attempts and service/network failures retain their recovery feedback.

## October 1 — Preserve Plan view on editor return

Physical checks found that opening Earlier, switching to Held list and editing a task restored Earlier on return because App retained the original entry view. Report List/Calendar/Completed/Earlier changes to App and use the latest selection when remounting Plan. This is navigation state only; no saved task changes. Native date/time, receipt review recovery and task preservation passed on OnePlus; final multi-item/capture/subjective acceptance remains with the user.

## October 1 — Readability, receipt recovery and earlier tasks

The user rejected prior-day obligations dominating a new day's NOW/NEXT. Derive Earlier from local calendar days through Clock; preserve saved status and deadlines. Rank remaining Home items while Earlier offers reschedule/completion/deletion. Same-day overdue work retains its deterministic priority. Refresh each minute/on foreground; Home edits return Home.

Replace Unicode gear/handmade pencil with explicitly loaded Ionicons and labelled Home/Plan icons. Raise 10–13-point secondary controls to 14, Plan titles/main actions to 16, edit/delete targets to 48×48.

Use Expo-compatible @react-native-community/datetimepicker 9.1.0 (https://docs.expo.dev/versions/latest/sdk/date-time-picker/), native dialogs and manual fallback. Selection changes only its field, dismissal nothing; choosing a time never infers today's date. Receipt review uses a checkbox, per-item errors, bottom summary and first-error scrolling. The dependency requires rebuilding Android before loading the new bundle into the phone.

## September 30 — Active entitlement and safe acceptance

Show active Plus explicitly and disable its purchase button while active. A successful Test Store purchase must not leave the app inviting another purchase. Restore and Persistent scheduling passed on the physical OnePlus; distinguish two scheduled native reminders from actual cadence delivery. Delete acceptance used only Coby nudge test with aggregate non-test payload digest comparison; never clear the user's real list to satisfy a test gate.

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

## Native speech network recovery

Do not infer that the user's whole internet connection is off from a speech network error. Coby now names the speech-service connection failure and exposes a recovery action. Prefer native on-device recognition only after the device reports en-US installed; otherwise preserve online recognition and typed words. English setup uses the module's native model-download API, confirms installed status afterward, and keeps the rest of the app usable while it waits. The native model lookup and download wait are bounded. No LLM transcription provider was introduced.

The installed expo-speech-recognition source documents getSupportedLocales/installedLocales and androidTriggerOfflineModelDownload; Android defines native client error 5 separately from network errors: https://developer.android.com/reference/android/speech/SpeechRecognizer. The current emulator rejected the model request with client error 5; this is a remaining device/service failure, not a passed voice feature.

## 2026-09-30 — Native online microphone path

Use standard single-session capture for online recognition. Installed ExpoSpeechService.kt sends continuous Android capture through a custom recorder with EXTRA_AUDIO_SOURCE and EXTRA_SEGMENTED_SESSION; reserve that mode for confirmed offline recognition. Preserve typed and captured text across pauses and retry. This addresses a concrete compatibility risk but the root cause remains unproven until spoken testing succeeds.

## 2026-09-30 — Voice-only lifecycle repair

Keep a voice session active until native end, with visible preparation/finalization states. A failed or empty final result must retain the latest partial transcript. Bound native startup at 12 seconds and finalization at 6 seconds; abort releases a stalled session. Cancel on background/navigation and ignore inactive events. Tests cover overlap, stop/final result ordering, interim retention, retry, cancellation, and stale end during preparation. Read native numeric error codes for truthful language/server recovery; Lab stores metadata only.

Use the user's physical OnePlus A6010 for spoken acceptance because the Pixel 6 emulator saturates CPU and its launcher becomes unresponsive. Live two-clause capture passed by user confirmation on Android 11/API 30 with the default Google app service. This does not establish the emulator's engine works.

Physical acceptance also passed manual stop/retry with prior words preserved, and actual OS microphone denial with usable text fallback. Permission was restored after the denial test. Voice-only changes are ready for the verified online path; longer pauses/background behavior and offline engine support remain separate acceptance limits.

## 2026-09-30 — User-controlled voice dump lifetime

A native speech recognition boundary is not the end of a Coby dump. Keep a user session open until Done, fatal error, or leaving/backgrounding the app. Restart after a normal end or silence timeout only after native release, with a short delay to avoid busy errors. Preserve partial and final words at each boundary. Done during a restart gap cancels the scheduled start. Network, permission, client, and busy errors do not cause automatic retry loops.

Request longer silence windows, but do not rely on those extras: Android documents that recognizer implementations may ignore them (https://developer.android.com/reference/android/speech/RecognizerIntent). Enable the library's legacy continuous hints on Android below API 33; keep the Android 13+ online path free of custom segmented audio pipes. This correction remains inside voice capture P0.

The user confirmed the 7-second initial wait and ~30-second paused dump captured all three errands. Foreground checks apply both before initial native start and before a scheduled restart. Leaving and returning showed the mic idle. Multi-minute/provider and offline/emulator acceptance are not established by this test.

## 2026-09-30 — Correct saved details and recover from accidental Focus

The user cannot correct a confirmed task's time or leave accidental Focus. Basic manual saved-item corrections are P0 trust work under this explicit request; natural-language correction remains P1. Reuse the receipt form and validation rather than add a task-management subsystem. A correction keeps the item's ID, capture source, creation time, status and commitment; SQLite replacement updates the held item and notification synchronization cancels old reminders before scheduling revised ones. Notification failure is reported independently after save success.

Focus retains the originating Home/Plan and prior held status. Visible Back, End focus and Android Back leave without completion. React state holds the navigation context because it also drives the visible return label. Screen changes reset scroll so a previously scrolled Plan cannot hide Focus's exit. Cancel/Android Back in the editor discards its unsaved draft.

## 2026-09-30 — Renewed voice cutoff: settings and boundary diagnostics

The user's longer real use invalidates a reliability conclusion from the prior short acceptance. No voice behavior was modified by the saved-edit/Focus patch. Native source confirms Coby's intent extras override the legacy library's 600000ms continuous window; restore that window below API 33, preserving the standard modern online path. Android providers may ignore silence extras (https://developer.android.com/reference/android/speech/RecognizerIntent), so this is a candidate correction, not an established cause/fix. Restart on the next event-loop turn after native end, which is emitted after recognizer destruction; do not insert an additional 350ms listening gap. Ignore duplicate end and late results while awaiting the next start. Development timing traces include event/phase/elapsed milliseconds only. Protect the user's unsaved text by waiting for readiness before reloading. Live minute-long acceptance remains required.

## 2026-09-30 — Capture usability and deletion

The user reports the keyboard obscures the composer, voice still appears to cut/reset, and held tasks cannot be deleted. Enable Android KeyboardAvoidingView height behavior for the bottom dock; declare resize mode explicitly (the existing native manifest already uses adjustResize). Keep the scrollable Home content above the dock; no composer relocation or new keyboard dependency.

On the failed live voice attempt, timing metadata shows one native start, repeated speech-end callbacks, and no native end until manual Done at about 36 seconds. Sanitized native partial-result metadata shows resets from longer utterances to short new partials inside that same microphone session. Therefore native-cycle continuation alone cannot preserve a long dump: retain the previous partial when the next speech-start follows speech-end, while allowing delayed corrections before that boundary. Handle cumulative results without duplicating their committed prefix, preserve typed text, and retain intentional repeated utterances. Tests use synthetic words only. Speech timing traces also include speech-start now. Physical acceptance of this correction remains necessary.

Place Delete item in the on-demand saved editor. The app asks Keep it/Delete to prevent accidental irreversible local removal. Cancel this item's scheduled notifications first; only then delete its SQLite row by ID and remove it from ranking/Plan. If cancellation or deletion fails, retain the item and report the failure. Do not archive or silently retain a deleted task. No real user task should be deleted by agent testing.

## 2026-09-30 — Clear list and P0/P1 clarification

The user explicitly confirmed both latest physical checks pass: typing stays visible with the keyboard open, and the minute-long voice dump works. Preserve that bounded acceptance rather than treating it as every-device/offline reliability.

Bulk clearing is P0 user-requested held-item control, not P1. Expose Clear list only in Plan List, with the count and confirmation that all calendar days are included. Snapshot the open items, cancel each exact ID's notifications, then delete those IDs in one SQLite transaction. Keep completed/archived history because it is outside the held list. Cancellation/storage failure leaves items held and warns that some reminders may have stopped; no partial row deletion is intended. Never clear the user's actual list to test the feature without their explicit in-app choice.

Nudges and the cohesive companion feel remain required P0. The scheduler exists but its full physical acceptance is incomplete. New captured items currently have no commitment and must have Gentle/Persistent chosen, so proactive support is not automatic on save. docs/STATUS.md distinguishes built code, observed behavior and remaining checks. Basic reactive orb states and usable action feedback are P0; richer motion/haptics, dark mode, Locked/rescue code and natural-language corrections remain P1.


## 2026-09-30 — Visible proactive support and final UI direction

Nudges remain mandatory P0. Add direct 15/30/60-minute reminder postponement and a fixed-language check-in opened by notification tap. A reminder delay never changes the user deadline. Persist one requested reminder time, cancel older schedules, and ignore completed/deleted/disabled items and duplicate native responses. Use a new high-importance Android channel because existing channel importance cannot reliably be upgraded in place. Actions bring Coby to the foreground for dependable P0 processing after cold start; no headless background service is promised. Keep default system notification alert behaviour P0; custom sound design remains P1.

An item enabled too late for its original reminder points gets one future reminder within a minute (or halfway to a closer deadline), with truthful wording that does not promise on-time completion. This is notification policy, not an invented task duration.

Use the user-approved Soft Fold asset with restrained native volume response. Home name left/Settings right and arrival companion above coby/Unload your mind supersede earlier header and carry-less loading copy. Seven-day weeks with previous/next week inspection satisfy P0; no month grid. Completed task history and restoration are safe P0 inspection. Defer custom reminder time until quick delays are verified; do not add journal/streak loops before submission.

## September 30 — Android default notification sound

Omit the channel sound property. In the installed Expo Android implementation any non-null sound string is checked as a bundled raw resource; omission uses the system default. Physical channel and delivered notification resolve to Android's default sound with HIGH importance. No custom sound asset or native rebuild is required.

## September 30 — Extension and truthful feedback

Devpost confirms October 1 noon PDT / 20:00 Lagos; retain P0 scope and reserve submission time. Switching commitment invalidates the previous postponement confirmation, so clear it. Consume stale finished/deleted-item notification responses to avoid replay on launch. Notification-access success belongs in neutral status text. Use Manrope/theme tokens on Focus, Settings and Plus to match the approved Home/Plan direction.

## October 1 — Safe P0 closure

After actual wall-clock Persistent delivery passes, use a quick isolated mode to test notification actions through the production App component and native response handler. Generate synthetic notifications only inside the separate package; validate persisted deadlines/reminder count after cold restart. Missing Gemini configuration tests the real recovery path without sending data or changing the private development key.

Native dialog labels may be uppercase. Match their accessible text case-insensitively. Reuse a compiled fixture artifact for subsequent script-only iterations only after comparing all runtime source/config/package/asset paths against its recorded build SHA. Retain failure artifacts; do not change application behavior to satisfy an automation selector.

Native UI acceptance uses a fresh CI emulator and refuses physical devices. It verifies visible transition results rather than trusting timed coordinate taps. Keep failure screenshots/XML synthetic and separate from the user's phone. Fresh screenshot evidence supersedes the old screenshot; do not claim NEXT is visible without scrolling.

User approved automatic free Gentle reminders for newly confirmed future exact-time items. Receipt discloses this and Plan retains mode controls. Notification failure follows successful local holding with truthful recovery copy. No existing modes are changed. Failed extraction offers explicit manual retention as one intact item with null timing; it does not call the fixture's sample extraction or pretend that AI worked offline.

Use the approved circular C vector for exact brand exports and Expo's native splash plugin. Reliability QA runs under a separate Android application ID and a CI-only entry; it must refuse the real package before any clearing. Persistent delivery uses real wall-clock deadlines rather than accelerated mock alarms. Public fixture artifacts contain no development keys and must be labelled as fixture demonstrations, not live AI/billing builds. The Next Gen source/device-demo route remains available without a store release. A publicly distributed live-AI APK requires a secured endpoint.

Bound Gemini extraction to 20 seconds, abort and retain the existing editable words/retry path. Reject the other agent's rendered demo for submission until incorrect technology/event claims and existing private task footage are replaced; technical render gates alone are insufficient.

- October 1 acceptance evidence: require exact retained input and a visible third receipt card before claiming the multi-item offscreen recovery gate. Native run 36831455328 meets those conditions. Installation delays are test infrastructure failures unless an app action was reached.

- Notification UI acceptance must expand the Coby notification group/card by its synthetic title, not the first expand control in Android's shade. Reuse only the unchanged compiled QA runtime; require quick mode and runtime diff validation.
