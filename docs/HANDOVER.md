# Handover

## Status

P0 remains **in progress**. The current submission deadline is **October 1, 2026 at 12:00 PM PDT / 8:00 PM Lagos**, confirmed on the official Devpost page on September 30. The earlier 07:00 working cutoff is superseded. Finish core reliability, then freeze features and complete polish/build/demo with a submission buffer.

The user rejected the earlier capture-above-tasks layout on September 30 and provided a central-orb reference with bottom controls. Their correction supersedes the earlier internal Home visual review.

## Earlier visual checkpoint (historical)

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

## Saved-item correction and Focus exit checkpoint

Scope follows the user's new report: correct a confirmed task's timing and recover from accidental Focus. Plan List/Calendar rows now expose Edit details. The existing receipt form opens with details visible and validates title, kind, local date/time and duration. Save replaces the same SQLite ID, retains source/history, lifecycle and commitment, and synchronizes that item's nudges. Cancel/Android Back discards unsaved edits. A notification failure is reported separately from save success.

Focus has a visible Back to Plan/Home control. It and End focus/Android Back restore the prior held status and return to the originating screen without completing the task. Completing Focus retains the existing completion path. Screen transitions reset scroll so the exit is reachable.

Typecheck, lint, and all 42 tests pass. New tests cover identity/history preservation, time correction shifting deterministic nudges, blank timing removing nudges, validation and focus exit without completion. The Android bundle generated and loaded through USB localhost reverse on the OnePlus A6010. Plan's new edit controls were observed on-device. User interaction acceptance is pending for changing/saving a time and leaving Focus. Notification cancellation is wired through the existing same-ID scheduler; actual revised delivery has not been observed. Metro session 26739 serves port 8082 in CI mode (restart after source edits). Private phone data was not cleared or seeded.

## Live voice regression reported during saved-item acceptance

The user reports capture cutting off mid-dump and starting another segment. This supersedes the previous short spoken acceptance as a reliability conclusion. Saved-item interaction acceptance is still pending; no failure or success of editing was established. Prioritize voice boundary diagnosis while retaining the editing changes. No voice code changed in the saved-item checkpoint.

## Voice boundary follow-up candidate

Reviewed the installed native implementation: below API 33 its continuous mode sets three 600000ms hints, but Coby overwrote them with 20000/15000/15000ms. Android intent extras are applied last. Restore the library's legacy window through tested androidVoiceOptions; modern online recognition retains the standard microphone path. These hints may be ignored by the provider and are not proof of uninterrupted recording. Native end occurs after cancel/destroy; remove the extra 350ms application delay and request restart on the next event-loop turn. Duplicate end/late results during a pending restart are ignored to avoid scheduling another restart or duplicating prior words.

Development-only [CobyVoice] traces log event name, phase and elapsed milliseconds, never words/audio. Typecheck, lint and all 44 tests pass. Tests add legacy/modern configuration and duplicate-end/late-result cases. The candidate is NOT yet verified live. Asked the user to save their current dump and reply ready before reload, to avoid losing unsaved text. Awaiting clarification on native stop/start versus transcript replacement. Saved editing and Focus interaction acceptance also remain pending. Metro session 26739 is localhost-only on 8082.

## Keyboard, utterance retention and deletion correction

The latest live report still fails voice reliability and reports a covered composer. Trace from that attempt shows a single native start and repeated speech-end callbacks; native end arrives only after Done at about 36 seconds. Sanitized native partial metadata confirms the service resets partial results within the same open microphone session. Prior restart/silence corrections did not address utterance replacement. VoiceSession now retains the prior partial on the next speech-start after speech-end, accepts delayed corrections before that start, and handles cumulative final/partial results without duplicating the held prefix. Speech-start is traced without words. Three synthetic regression cases cover segmented partial resets, cumulative results, delayed corrections and repeated words.

Android KeyboardAvoidingView now uses height behavior, keeping the bottom composer above the keyboard. app.json explicitly specifies resize; the existing native manifest already has adjustResize. No native rebuild is expected for these JavaScript fixes. Saved Edit details now exposes Delete item with Keep it/Delete confirmation. Cancel only the selected ID's notifications before deleting its SQLite row; failures retain the item. Removing it recomputes Home/Plan while preserving other tasks.

Typecheck, lint and all 47 tests pass. Physical checks are not yet completed for this correction. Asked the user to save unsaved words and reply ready before reload. Do not clear or seed the user's phone. Use an isolated synthetic item to verify deletion. Never capture unrelated foreground apps: check resumed package before screenshots. Native metadata comparisons were performed without printing transcript words. Previous short live acceptance is superseded by the user's continuing failures.

## Wireless Android connection

The USB device disconnected. The user paired the OnePlus A6010 through Android Studio wireless debugging. ADB now lists adb-3a040b08-dcoypf._adb-tls-connect._tcp (transport 16) as device. Names/ports may change; inspect adb devices before each connection. Wireless adb reverse tcp:8082 routes the phone to localhost Metro without exposing the development server to the LAN. The updated 873-module Android bundle loaded successfully. Metro session 99741 serves 8082 with CI=true; restart after source edits.

Current editor was observed on-device; the user is making an edit, so do not overwrite it. Asked the user to finish the edit and check Home typing plus a minute-long paused voice dump. No live pass has been reported yet for the three latest corrections. Deletion testing must use an isolated synthetic task.

## Current accepted capture and progress audit

The user clarified that keyboard-open typing and the minute-long voice dump both work now on the wireless OnePlus. Those specific cases pass; broader voice/offline claims remain unverified. P0 is still in progress, including real future nudge behavior, restore, complete saved-item controls and the premium companion experience. See docs/STATUS.md for the user-facing built/verified/remaining/P1 mapping. Manual edit/delete/clear, usable feedback and basic live orb response are P0; richer motion/haptics, dark mode, Locked/rescue code and natural-language editing are P1.

Clear list is implemented in Plan List. Count/scope confirmation covers all held items across calendar days. Snapshot open IDs, cancel their reminders, delete those rows transactionally and recompute Home/Plan. Preserve completed/archived history. Failure keeps items and warns some reminders may have stopped. Typecheck, lint and 47 tests pass. Requested readiness to reload without losing the user's dump; only inspect/cancel the real-list confirmation. Never clear real tasks for agent testing. Metro session 72345 now serves the updated patch on localhost 8082. The first reload raced server startup and showed a development loading error; wait for /status to report packager-status:running before launching after future restarts. Reopening after startup loaded successfully. Clear list confirmation and Keep my list cancellation passed on the phone; populated Plan remained. Bulk removal and cancellation delivery are still unverified, and no real held items were deleted.

## September 30 — Proactive nudge and approved design recovery

The user correctly identified that proactive support had not been made visible. Reminder scheduling existed but had no notification categories/action handler, and enabling Gentle after its original intervention point could silently create no notification. Close deadlines now get one truthful future reminder before the deadline.

Android has a new high-importance reminder channel, default system alert, 15/30/60-minute category actions, foreground/cold-start response handling and a fixed-language nudge screen. Postponement persists in the item's SQLite payload, retains its deadline, replaces its old schedule and guards duplicate/stale actions. Completing/deleting removes scheduled and presented notifications. OS action buttons open Coby to process the selected delay; background-only processing with no app opening is not claimed.

Reminder setup is visible for each Plan item. Gentle is free; Persistent still goes through RevenueCat entitlement. Undated/date-only items receive no invented notification time. Custom reminder time is deferred.

Approved Soft Fold companion and blue/pink/off-white direction are integrated without a new native dependency. Home has coby left, Settings right, no tagline under the name, spacing above the divider, tasks hidden during capture, circular Stop, and bottom Home/Plan navigation. Loading shows companion/coby/Unload your mind. Launcher/native splash assets still need final replacement. Plan has seven-day weeks, previous/next and Today, circular date selection, separate edit/delete, completion strikethrough/restoration and Completed history.

Typecheck, lint and 56 tests pass. Android Hermes bundle generated successfully after sandbox execution of hermesc was granted. Browser checks passed for the new arrival, seven-day navigation, history restoration and simulated nudge postponement, alongside existing preview controls. Actual Android rendering, keyboard/voice after integration and future/background notification/action/cold-start acceptance remain pending. No phone currently appears in adb devices or mDNS services. No real held data was cleared or edited. Metro is still running on 8082 with the old CI bundle; do not reload until the user says their dump is saved and the phone is connected.

The working cutoff is October 1 at 07:00 Lagos time, ahead of the previously stated submission deadline. Journal/streak features are deferred/out of scope. P0 remains incomplete.

Metro was restarted successfully for the approved reload. Session 91679 serves localhost:8082, and /status returns packager-status:running. The phone is still absent from host ADB/mDNS after the user reported reconnection; requested its wireless IP:port or USB debugging authorization. Do not claim the update is on the phone yet.

## Physical Gentle delivery and notification action checkpoint

The wireless OnePlus A6010 reconnected as transport 27. The user saved their edit and authorized reload. Localhost reverse 8082 was restored and the approved Android bundle loaded. Home, Plan List, receipt and item reminder controls were inspected on the physical phone. No real task was edited, completed, deleted or cleared.

Created only the clearly labelled synthetic item Coby nudge test, using live text extraction and a verified September 30 22:25 local deadline. Enabled Gentle and backgrounded Coby. Android delivered its future notification with truthful close-deadline copy, importance HIGH, default system sound/vibration and three actions. The actual coby_delay_15 response was processed: read-only, in-memory SQLite inspection confirmed dueAt stayed 21:25 UTC (22:25 Lagos), reminderAt became 21:43:36 UTC (22:43 Lagos), and the native notification store contains exactly one pending request for this synthetic item. No database copy or real payload was written to workspace. The response was observed through stored state; user confirmation of the visible feedback is pending.

Fixed startup sound configuration: this Expo Android version treats a channel sound string as a bundled filename. Omitting the channel sound selects Android's default and removes the missing-custom-sound warning. Notification content still requests its default sound. Typecheck, lint and all 56 tests pass after this correction. The rebuilt motion preview check is also successful.

Metro session 94218 serves the corrected localhost 8082 bundle in CI mode. Restart after source changes. Body-tap routing, cold-start action, 30/60-minute actions and edit/complete/delete cancellation remain pending. The synthetic item has a pending test reminder; remove only that item after verification. P0 acceptance and voice/keyboard regression on this new UI remain open.

## Extended deadline and follow-through acceptance

Official Devpost now lists October 1, 2026 at noon PDT (20:00 Lagos). Source: https://revenuecat-shipaton-2026.devpost.com/. This supersedes the old 07:00 working cutoff. The extension preserves P0 scope; use the added time for reliability and submission craft.

The user confirmed a notification body tap opened the correct synthetic task at its corrected 22:43 deadline after Coby's background process was closed with am kill. This was not Android force-stop. The replacement future notification delivered; native store confirmed exactly one pending reminder after the edit and a cleared reminderAt. Actual 15-minute notification action had already passed; 30/60-minute choices now passed in-app, each leaving one native reminder and preserving dueAt. Their notification-button variants remain unobserved.

Turning reminder mode Off removed the test item's pending request. Completing the test item also removed it; Completed history showed the crossed-out task. Restoring only that task returned it to planned and restored its still-future explicit reminder. Deletion, Focus exit, Persistent cadence/restore and new-UI capture regression remain pending. The test item is still held with a pending reminder; clean up only Coby nudge test. Real tasks were not edited, completed, cleared or deleted.

Observed stale postponement feedback after mode changes. App now clears that message when commitment changes, and consumes a response targeting a deleted/completed item instead of replaying it at the next launch. Settings access confirmation is calm status text, not a red error; permission query failures have recovery copy. Focus, Settings, Plus and loading typography now use the approved Manrope tokens. These code changes are not yet loaded on the phone. Metro session 94218 still serves the preceding CI bundle; restart before reload.

Phone automation paused because Coby stopped being the foreground app. The user was asked to leave it open untouched for five minutes. Every new test tap checks that Coby is foreground first. Do not resume those dependent interactions until readiness arrives.

Next lighter work is exporting the approved circular C launcher icon from outputs/coby-preview/assets/coby-icon.svg and build/asset preparation. The user requested a lower-model switch before routine work; flag that phase rather than silently consuming the design model. Full subjective approval, final screenshot/demo, release-safe configuration and submission remain open.

## September 30 — Physical Focus, deletion and Plus checkpoint

Wireless OnePlus A6010 reconnected as transport 34. Metro was restarted; session 57654 serves localhost 8082 in CI mode. Saved bf79e24 loaded (875-module Android bundle); native GitHub build 36783330575 also passed. Restart Metro after source edits and preserve unsaved words before reload.

Only Coby nudge test was exercised. Visible Back to Plan and Android Back each restored planned without completion. The $4.99 coby_plus_monthly Test Store simulation succeeded. Restore initially reported no active purchase; after purchase it succeeded and returned Home. Persistent was gated before purchase, then saved on the test task. Editing its explicit date to October 1 at 22:43 left two pending native reminders. This verifies scheduling, not delivery of both reminders.

Keep it preserved the task and both reminders. Confirmed Delete removed the synthetic row, pending requests and its presented notification; deletion persisted after restart. Aggregate non-test payload digests matched before/after deletion and restart. No private payload was saved or printed. Coby nudge test is cleaned up; no real item was changed or removed.

The purchased paywall still invited Try Plus. It now explicitly shows Plus is active and disables purchase while active. Typecheck, lint and all 56 tests pass. This small correction is not loaded on the phone yet; the user is rechecking keyboard-visible typing and a minute-long paused dump on the preceding approved UI. Do not interrupt unsaved capture. Offline/device speech, isolated bulk clear, OS 30/60-minute buttons, full Persistent delivery, final assets/demo and subjective approval remain open. P0 is not complete.

## October 1 — Readability and recovery correction

Source uses labelled Home/Plan navigation, explicitly loaded Ionicons gear/pencil/trash, 14-point secondary labels and 16-point Plan titles/main controls. NOW/NEXT open the saved editor and return Home on Cancel/Save. Prior-day obligations stay saved in Earlier, outside NOW/NEXT; Plan offers review/reschedule/completion/deletion. Refresh each minute/on foreground through activeClock. No real item is migrated, archived or deleted.

Receipt identifies invalid cards, shows specific errors near the title and Save, expands details, announces and scrolls to the first invalid item. Uncertainty uses a review checkbox. Native date/time pickers preserve nulls on dismissal, require an explicit date for a chosen time, and offer manual entry/clear. Rebuild the Android development APK before loading this bundle; protect unsaved phone input first.

Typecheck, lint and all 62 tests pass. Six new cases cover multi-item receipt blocking/recovery, picker previews/selection/nulls, local midnight/date-only recovery, rescheduling/history exclusion and one NOW/two NEXT. Android bundle/native build and physical acceptance are pending. Phone is transport 34. P0 remains incomplete.

## October 1 — Physical readability/recovery acceptance

Native build 36792872254 at 73b6c06 passed and was installed over the existing OnePlus app with user authorization. Android export includes Ionicons. Date/time selectors open natively; cancellation preserves blanks. Explicit October 1 / 02:14 selection persisted. Clearing only time through saved editing retained the date with null dueAt. Live ambiguous test receipt blocked Hold, scrolled to its item, showed a specific error and accepted after ticking the review checkbox. Home NEXT opened editing and Android Back returned Home. Earlier showed retained prior-day items outside NOW/NEXT. Icons and larger labels render correctly; final subjective readability remains for the user.

Found Plan re-entering Earlier after changing to Held list and editing. Plan now reports its selected view to App so editor return preserves it. Typecheck/lint/62 tests pass after the fix, and the corrected return was inspected on the phone. Latest 903-module bundle runs on localhost:8083, Metro session 29197. Native picker APK is compatible with this JavaScript-only correction. Superseded 8082 server stopped after verifying its process identity.

Only Coby nudge test was created, edited and removed. Zero test reminders remain. Real-item aggregate digests are unchanged after installation and final checks. No real task was saved, completed, archived, deleted or cleared. Phone was paused when Camera became foreground and resumed only after user readiness. Leave Coby on Home for user checks. No voice implementation changed in this slice.

User checks are listed in TEST_MATRIX: readability, Home-origin Save/Cancel, Earlier rescheduling, multiple-item receipt error location, picker select/cancel/clear, keyboard-visible typing and a paused minute-long voice dump. Single-item receipt/picker/device evidence does not cover every one of those cases. P0 still needs the documented reliability gates, final launcher/splash, fresh screenshot/demo and subjective approval. Before routine asset/build preparation, flag the user's requested lower-model switch.

## October 1 — User acceptance and false-silence warning

User says all five requested checks work on the installed update. Readability, Home edits, Earlier and capture are accepted for the tested phone. They did not understand the offscreen Hold/error-jump instruction, so do not claim that particular multi-item phone scenario passed. They report a false “I didn't catch anything” alert after valid captured words and a short pause; sending still works.

Speech feedback now receives VoiceSession's whole-attempt hasRecognizedWords flag. Silence/nomatch after partial/final captured words has no empty-dump message. State survives native cycles and resets on a new user attempt. No recognition timing, microphone options or transcript-merging change. Two regression tests reproduced the old warning before the fix. Typecheck/lint/64 tests and Android export pass. The fix is not loaded on the phone yet; 8083/session 29197 remains the preceding CI bundle. Safe reload readiness requested because the user's latest tests may have left unsaved input. Spoken confirmation can wait until they return.

## October 1 — Hackathon demo master video verified and rendered

The canonical anti-AI-slop hackathon demo video is authored, verified, and rendered at `demo-video/coby_hackathon_demo.mp4` (and `coby_hackathon_demo.mp4` in root):
- **Duration & specs:** 95.00s, 1920x1080 @ 60fps, 10.4 MB MP4. Passes all HyperFrames static, layout, runtime, motion, and WCAG AA contrast gates (71/71 checks passing).
- **Physical device capture:** 1080x2340 60fps screen recording from the connected wireless OnePlus A6010, driven deterministically by `scripts/automate_demo_capture.py`.
- **Soundtrack & Voiceover:** Kokoro-82M TTS founder narration (`am_adam`) across 8 acts, paired with a custom synthesized warm neo-soul Rhodes electric piano bed (`bgm_lofi.wav`) at -18dB ducked level.
- **Preview server:** Live interactive Studio preview running at `http://localhost:3002/#project/demo-video`.

## NEXT ACTION

Capture and review the corrected synthetic-data demo against FILM_BRIEF.md, including successful purchase-and-Save on the hero item, then complete the final submission review.

## October 1 — Real Persistent delivery and clear/restart passed

Quick action run 36829983916 stopped during installation: its shared adb helper allowed only 20 seconds for the large APK. It did not reach an app action. Give installation 180 seconds while retaining 20-second UI command bounds; retain its separately labelled Coby QA APK for diagnosis. New action results remain pending. Main native receipt rerun now verifies exact injected input and three cards; the preceding one-card evidence does not close that case.

Isolated native workflow 36824997183 passed on Android 16/API36. Downloaded report confirms bulk SQLite removal/history retention/pending cancellation, actual delivery of both Persistent points while backgrounded across their real 30-minute gap, and retained cleared/history state after cold restart. No phone data was involved. Public fixture release scan found bundled JavaScript and no development Gemini key or Google API-key pattern. Branded APK identity min24/target36 verified.

Full application UI gate is still running after the casing correction. Added a quick isolated mode for the real production App component, checking actual OS 30/60-minute category taps, persisted unchanged deadline/single pending request, and explicit parser-failure/offline one-item retention through receipt and restart. This mode has no Gemini key and no account; it does not claim live AI/purchase verification. Its new results are pending. Preserve the real phone until saved/Home readiness arrives.

## October 1 — Fresh screenshot and native UI acceptance harness

Rerun 36829030329 passed its assertions, but screenshot review showed the injected sample was truncated and produced one intact item, not three. Accept its Focus/List/Calendar/clear/history evidence; do not claim the specific multi-item receipt case. Pace synthetic typing, verify exact retained text before Send and assert Item 3 exists before testing the offscreen invalid first card. The revised flow can reuse 36829030329's runtime APK because only test scripts/docs change.

First native UI run 36827272205 reached the correct clear-list confirmation but the harness failed on Android's uppercase CLEAR LIST button. This is a case-sensitive selector problem, not an app deletion failure. Match labels case-insensitively and rerun. The next workflow retains compiled APKs even after a UI-test failure; an optional reuse input rejects reuse if runtime files changed. Do not claim the remainder of the flow passed from this partial run.

Downloaded and inspected the successful 36825001246 screenshot: 1179×2556 actual Android 16 rendering, no frame, correct approved companion, settings/pencil/navigation icons and bottom composer. Replaced the stale submission PNG. NOW and primary actions are visible; NEXT stays accessible by scrolling. Native branded APK 36824942961 was downloaded for later authorized installation, not installed over unsaved input.

Added emulator-only native UI checks to the screenshot workflow, refusing a physical serial. They operate exclusively on a fresh CI fixture installation: clear initial synthetic fixtures, text dump, three-item receipt, offscreen first-title error/scroll/correction, hold, Focus completion, List/Calendar, clear remaining held items and preserve Completed through cold restart. Export per-state screenshots/failure evidence. This gate is pending; it must pass before being described as observed. The supplied draft demo remains local/unapproved.

## October 1 — Recovery and approved automatic Gentle

User approved enabling Gentle automatically when a newly confirmed item has an explicit future timestamp. Date-only, untimed, invalid or past timestamps get none. Receipt explains the default. Do not change existing item modes. Hold now commits items/returns Home before independent reminder synchronization; failure reports saved items plus reminder recovery and cannot invite duplicate capture. Parser failure offers Keep as one item, a receipt of the intact words with null timing, instead of blocking local holding offline. No speech lifecycle changes.

Typecheck, lint and 68 tests pass. Branded debug build 36824942961 and fresh fixture screenshot/release workflow 36825001246 passed at c8cefcd; isolated native QA 36824997183 is still running. New recovery/Gentle changes are not yet loaded on the phone. Phone saved/Home readiness remains pending. Submitted demo metadata is 95 seconds, 1920×1080, 30fps (not the agent-reported 60fps); its content/privacy corrections remain mandatory. docs/SUBMISSION.md and README describe the honest Next Gen/source/setup route. Default .env.example demo seeding is now opt-in; user's .env is untouched.

## October 1 — P0 closeout in progress

Exported the approved circular C mark to 1024px icon, Android adaptive layers/monochrome, favicon and native splash. Added Expo splash support; native build still needs verification. Added a CI-only QA entry in a separate package com.emmagh1.coby.nativeqa, using the actual SQLite and notification modules. It tests bulk cancellation/removal/history and waits for real wall-clock delivery of both Persistent reminders, then checks retained state after cold restart. This is not the production app's UI acceptance and is not passed until the workflow produces evidence.

Extraction now has a bounded 20-second timeout and abort; failure leaves the existing composer recovery path available. Added stalled-request and retry regressions. The phone currently has another app foreground; requested saved-input/Home readiness before any reload. No real phone task was touched.

Reviewed the other agent's demo contact sheet: false offline Whisper/SDK/event claims, existing phone tasks and sampled Focus/Plan acts showing Home. The previously appended render checkpoint is a draft report, not submission approval. docs/DEMO_REVIEW.md records the required corrections. Ignore the draft video directory/MP4 to avoid publishing private task footage. Preserve all local artifacts for correction.

## October 1 — Three-item native receipt gate passed

36831455328 passed using the unchanged runtime APK from 36829030329. Exact injected text was verified before Send; screenshots show all three receipt cards. Invalid first title was identified and scrolled into view from the bottom, corrected, then held. Focus completion, List/Calendar, confirmed Clear list and completed history after cold restart passed. Evidence is downloaded to the working chat's outputs/p0-three-card-pass; no real phone data involved. Actual OS delay/offline recovery run 36832129592 remains running. The draft demo also incorrectly labels Focus “Gentle Timer”; no countdown timer is implemented, so remove that claim.

Quick run 36832129592 installed successfully, but the harness expanded Android System rather than Coby's grouped notifications. Screenshot shows Coby's collapsed group. Target the smallest notification subtree containing the synthetic persistent-delivery title, expand its own controls, and rerun with the unchanged QA APK. No production runtime change; OS action acceptance remains pending.

36833590847 backgrounded the fresh app before its QA setup completed: retained log has only Running main and no QUICK_READY, and shade has no Coby reminder. Replace the fixed four-second startup wait with bounded readiness checks for both the native QA marker and production capture surface. Reuse the unchanged 36832129592 APK; do not infer a production notification defect from an unready harness.

36834169289 exercised the actual 30-minute Android action and displayed unchanged-deadline confirmation. Its restart check failed because am kill ran before the app was backgrounded; start reported existing task and no new QA markers. Require confirmed process exit without force-stop, then accept either Home or restored notification check-in as ready. Full 30/60 persisted/offline gate remains pending until the rerun completes.

## October 1 — Native OS actions and offline recovery passed

Final isolated run 36834814944 passed using the unchanged quick QA APK from 36832129592. Actual Android 30-minute and one-hour notification buttons invoked production App. Each preserved dueAt, persisted its requested delay, and retained exactly one pending native request after confirmed background-process exit/restart. Report and visible confirmation screenshots inspected. Missing Gemini configuration showed the recovery action; explicit Keep as one item displayed the complete words with null timing, held them locally and survived confirmed restart. Evidence downloaded to the chat workspace outputs/p0-actions-pass. Earlier infrastructure failures are superseded by this observed pass, not silently treated as app successes.

Typecheck/lint/68 tests and latest branded native build 36832127653 pass. Three-item receipt/UI gate 36831455328 and real Persistent delivery/bulk-clear/restart gate 36824997183 pass. No required isolated gate remains running. No real phone data was changed. Phone saved/Home readiness is still unanswered; Metro 8083/session 29197 still serves the preceding code. Do not claim the latest speech-warning/Gentle/recovery update is installed. Latest native build is compatible; branded c8cefcd APK plus newest JavaScript can be loaded after readiness without uninstalling/clearing data.

P0 acceptance stays open for safe phone confirmation and corrected demo approval. Final demo still requires truthful narration, synthetic task footage and actual visible interactions; do not publish the local draft. Submission assets/source/setup/license are prepared. No P1 added.

## October 1 — Film brief approved for parallel preparation

docs/FILM_BRIEF.md v3 is reviewed against production scheduler/source and official Devpost requirements. Corrected postpone replacement (no remaining original latest reminder), fixed deadline/actual tap timing, updated-build/UI-freeze capture gate, final labels, quiet-room speech setup and parallel ownership. Approved the plan for storyboard/narration/audio/edit preparation now; actual human footage waits for app acceptance/freeze. Film agent owns only ignored film/ and film/HANDOVER.md; app session owns source/shared docs and retains its current NEXT ACTION. Old demo render remains rejected. Final film approval requires complete footage, measured output and human review. No app runtime or test script changed in this review.

## October 1 — Reviewed P0 polish implemented, Android acceptance pending

Applied the reviewed simplification: shared pill actions/chevron back links, Clock-relative readable dates, truthful tie explanation, concise receipt/Home copy, 96-point returning companion, quiet Home reminder status, title-to-edit Plan rows, bottom Clear list, calendar dots/48-point chevrons and notification status on Settings entry. Focus displays actual session elapsed time. Removed dead App/Home/Plan styles and the old violet underline.

Reminder choices now stage with the edit; Save persists details/mode and updates scheduling, while Cancel preserves saved state. Clearing exact timing disables reminders. Paywall returns to the requesting editor without losing its fields and stages Persistent after purchase/restore until Save. Notification check-in contains completion/focus/delays/change details, with no mode controls. No parser, scheduler or speech lifecycle change.

Typecheck, lint and all 74 tests pass, including date/null/year-boundary and staged-mode/snooze regressions. One Impeccable mechanical pass returned no findings for changed screens. Native selectors were updated and the fixture-only UI gate now checks keyboard-visible capture, reminder Cancel/Save, paywall draft retention and Android Back. These new native checks are pending, not passed yet. No physical app reload or task mutation occurred; the connected OnePlus still needs saved/Home readiness before loading. The film session may prepare assets, but final capture still waits for this UI acceptance/freeze. Preserve its ignored film/ and the pre-existing untracked automate_demo_capture.py.

## October 1 — Native polish acceptance and final confirmation

Commit d50a74f passed branded debug build 36848023063, full native UI flow 36848027053 and production notification-action/offline recovery 36848035543. Downloaded reports confirm real OS 30/60-minute buttons, unchanged deadlines/one pending request and cold-restart retention. Full UI confirms exact three-item capture, offscreen error recovery, reminder Cancel/Save, paywall draft preservation, Focus Back/completion, List/Calendar/clear/history. Batched Android screenshots were inspected: keyboard text/send visible, approved companion/icons/shapes and coherent revised screens. NEXT remains scrollable; do not claim both NEXT rows always fit above capture.

Two final corrections from that review: weekly header names both months at a boundary and shrinks/wraps at larger text; reminder failure points to opening/saving the item in Plan instead of suggesting a removed direct control. The bounded confirmation adds actual denied-notification holding/recovery and 1.3 system font-scale Home/List/Calendar. Typecheck/lint/74 tests pass; fresh native confirmation is pending.

User explicitly authorized pushing main/running GitHub checks and saved-input phone reload after the automatic review block. Phone Home was verified empty/not listening; an aggregate integrity baseline was recorded without saving payloads. Local .env still had DEMO_MODE=true; changed only that non-secret setting to false so physical testing uses SystemClock. Credentials were preserved and .env remains ignored. Windows denied local Hermes execution; hosted native builds passed. Metro refresh and physical loading remain in progress. No private item has been edited or deleted.

## October 1 — Final native confirmation passed; phone acceptance pending

Final confirmation 36852963130 at 2242fd0 passed the full native flow, actual notification-denial recovery with automatic Gentle, and 1.3 system font-scale Home/List/Calendar. Downloaded native-flow.txt and final large-text/permission frames were inspected. The month-range header and recovery instructions match the current controls. The final 1179×2556 actual Android Home screenshot, using synthetic items only, replaces assets/submission/screenshot-home.png. Both NEXT rows remain scrollable rather than guaranteed above the input. This completes the bounded native review; no optional polish or P1 expansion is planned before capture.

The authorized d50a74f development APK was installed over the OnePlus app; its native runtime is compatible with 2242fd0. Aggregate non-test payload integrity is unchanged. Metro 8084/session 27001 serves the latest JavaScript with DEMO_MODE=false; credentials remain ignored and unchanged. The phone switched to another app before bundle loading was confirmed, so leave that surface alone and wait for the human to open Coby. Do not claim the latest source is running yet. The remaining app gate is valid spoken capture followed by a pause without a false empty-dump warning, plus final subjective visual approval. No private task was saved, completed, edited, deleted or cleared.

Film preparation may continue in ignored film/. Human recording uses the actual editor: choose Persistent, purchase if required, return to the preserved draft, then Save changes. Its successful purchase-and-Save take and corrected final render still need human verification/review. The old private/incorrect demo remains rejected. Source is a freeze candidate; full P0/submission approval is not yet claimed.

## October 1 — Latest phone update loaded safely

After the human opened Coby, the Home composer was verified empty and idle before reconnecting. The previous Metro 8084 listener was bound to IPv6 ::1, while the phone's reverse connection needed IPv4; its old Home copy confirmed that the update had not loaded. Started Metro with NODE_OPTIONS=--dns-result-order=ipv4first, CI=1, localhost port 8085 and two workers. Session 57811 serves the current repository; IPv4 health check passed. Reversed device port 8085 and opened the development-client link. Android bundled index.ts with 905 modules; the updated Home placeholder is visible and the removed helper copy is absent. The latest source is now running on the OnePlus. Aggregate non-test payload integrity remains unchanged after reload. Credentials were not printed or modified.

The human confirmed that captured words stay after a 3–5-second pause with no incorrect empty-dump warning, and approved updated Home/Plan readability for freezing. The app is now frozen for human film capture. No application source changed in this loading correction; prior 74-test/native acceptance remains applicable. Final film approval remains separate.

## October 1 — Phone acceptance and app freeze

User acceptance closes the remaining speech-warning and subjective Home/Plan gates. Freeze runtime source at 2242fd0 (later commits only record evidence/assets/docs). Native debug runtime is d50a74f with the current JavaScript loaded from Metro 8085/session 57811. Do not add P1 or change final labels/layout during capture. All 74 tests, typecheck/lint, full native UI/recovery/large-text checks and notification-action checks passed; prior real Persistent delivery and physical purchase/restore evidence remain recorded. No private task was changed by the app session.

Film preparation and human capture may proceed using docs/FILM_BRIEF.md. The human still verifies the new editor's successful Test Store purchase return and explicit Save on the isolated hero item; do not infer that new positive-flow evidence from the CI paywall Back test. Fresh screenshot/icon/source/setup/license are prepared. The corrected under-two-minute film, final subjective film review and submission are still pending. Do not treat app freeze as approval of the rejected local draft or completed submission. Preserve the film agent's ignored film/ and untracked capture script.
