# Test matrix

## October 1 — P0 closure checkpoint

- PASS: typecheck, lint and 68 tests, including timeout/abort/retry, explicit offline retention with null timing, and automatic Gentle only for future exact-time items.
- PASS: isolated native QA 36824997183 on Android 16/API36. Actual SQLite bulk removal retains completed/archived rows, cancels pending reminders, and survives cold restart. Both Persistent reminders delivered while backgrounded over their real 30-minute interval.
- PASS: production native UI 36831455328, reusing the unchanged runtime APK from 36829030329. Exact full input and three receipt cards verified before the offscreen invalid-title jump/correction. Hold, Focus completion, List/Calendar, confirmed Clear list and completed history after cold restart passed. Screenshots visually reviewed. Earlier truncated-input evidence does not establish this case.
- PASS: branded native build 36824942961, package com.emmagh1.coby, min API24/target API36. Fresh actual Android submission screenshot 1179×2556 inspected and committed. Public fixture release has bundled JavaScript, no local Gemini development key and no Google API-key pattern; it is not a live-AI/billing build.
- RUNNING: 36832129592 tests actual 30/60-minute Android notification buttons through production App and explicit offline recovery/receipt/restart in a separate QA package. Prior 36829983916 timed out during installation before an app action; installation timeout corrected.
- PENDING PHONE: saved/Home readiness, safe reload and spoken confirmation of the silence-warning fix. No speech lifecycle changes. Latest automatic-Gentle/recovery source is not yet loaded on the phone. Notification-denial saved-state messaging is not physically accepted yet.
- DEMO REVIEW FAILED: supplied local draft needs synthetic footage and truthful speech/SDK/event/Focus claims. Metadata: 95s, 1920×1080, 30fps. Final corrected render and subjective approval remain pending.

## October 1 — User acceptance and silence-warning correction

- USER ACCEPTED: the five requested checks work on the installed OnePlus update: readability/icons, Home editing, Earlier recovery, receipt use and keyboard/minute-long voice capture. The user did not understand the offscreen Hold/error-jump instruction, so that specific multi-item phone case remains unverified.
- REPORTED: after captured speech and a short pause, an incorrect “I didn't catch anything” warning appears while the valid dump remains sendable.
- PASS: two regression cases first reproduced this warning, then passed after speech feedback used VoiceSession's whole-attempt recognized-word state. Covers partial capture/manual stop, silence in a later native cycle, reset on a new attempt, and continued network-error feedback.
- PASS: typecheck, lint, 64 tests and Android export after the correction. No native dependency changed.
- PENDING: safe reload and physical confirmation of the false-warning correction. Metro 8083 still serves the preceding code. Do not reload unsaved words without user readiness. Final multi-item error-jump check remains for later; no need to repeat all accepted checks.
- Demo is being prepared by another agent under user direction; do not modify or commit its demo-video folder.

Record date, device/emulator, build, result, and evidence for every executed row. “Planned” is not “passed.”

## October 1 — Readability/recovery physical checkpoint

- PASS: typecheck/lint/62 tests. Six new cases cover prior local days/midnight, date-only recovery, rescheduling/history exclusion, one NOW/two NEXT, receipt multi-item blocking and picker previews/nulls/field selection.
- PASS: Android export includes the icon font; native build 36792872254 (73b6c06) passed. Installed over existing data on wireless OnePlus A6010/API 30.
- PASS: house/calendar navigation, gear, pencil, trash and enlarged labels render. Home NEXT opens its editor; Android Back returns Home without saving. Earlier opens retained prior-day items outside NOW/NEXT.
- PASS: synthetic native date/time picker opens, cancellation retains blanks, explicit selection saves October 1 at 02:14 local. Saved edit clearing time retains the date with dueAt null.
- PASS: live uncertain synthetic receipt blocks Hold, scrolls to Item 1, shows its specific error at the top, and clears the error when the review checkbox is ticked. Hold then saves.
- PASS: caught and corrected Plan returning to Earlier after switching to Held list and editing. Latest JavaScript bundle preserves the selected Plan view after editor cancellation. Typecheck/lint/62 tests pass again.
- PASS: only Coby nudge test created/edited/deleted; zero test reminders left. Real-item aggregate digests match before installation and after all checks. Latest bundle runs on Metro localhost:8083, session 29197.
- PENDING: final subjective readability, Home-origin Save return, multi-item offscreen uncertainty scrolling on phone, clear-date UI and keyboard/minute-long voice regression on this version. Domain multi-item/null/midnight cases pass; do not claim all device variants from a single-item check.
- No real task changed, archived, deleted or reseeded. Earlier is derived inspection, not a storage migration.

### User check after the new APK is installed

1. Home/Plan: check the house/calendar icons, gear, pencil and smaller labels. They should be readable without zooming.
2. Home: tap a NOW or NEXT title, change a sample task, and save. Return to Home; tap again and Cancel/Android Back without saving. No unintended completion.
3. Earlier: yesterday's unfinished tasks should be inspectable here, outside NOW/NEXT. Reschedule only a task you genuinely want to move; it should return to the current Home ranking.
4. Receipt: use a sample dump with several items and one uncertain date. Scroll to the last item and press Hold without reviewing the uncertain one. Coby should jump to the affected item and explain what needs review. Correct/review it, then Hold should work.
5. Date/time: open each picker, cancel once (nothing changes), then select a date/time and save. Reopen the task to verify persistence. Clear time should keep a date-only task; clear date should remove both fields.
6. Capture: type several lines with the keyboard open, then try a minute-long sample voice dump with pauses and Stop. Existing words should remain visible and intact. Samples need not be saved.

Report which numbered check failed and what you saw. Do not clear your real list for testing.

## Previous physical checkpoint — September 30, 23:42 Lagos

- PASS: bf79e24 loaded on wireless OnePlus A6010/API 30; GitHub Android debug build 36783330575 passed. Supersedes earlier disconnected-device notes.
- PASS: synthetic Focus entry, visible Back to Plan and Android Back; both restore planned without completion.
- PASS: $4.99 coby_plus_monthly Test Store purchase and subsequent Restore purchase. Before purchase, Persistent opens the paywall and restore reports no active purchase.
- PASS: synthetic future-date correction preserves identity/Persistent; exactly two native requests exist. Delivery of both Persistent requests remains unverified.
- PASS: Keep it preserves the task and both reminders. Delete removes task and scheduled/presented notifications; restart retains deletion with zero pending requests. Aggregate non-test payload digest unchanged. Synthetic task cleaned up.
- PASS: active-Plus display correction passes typecheck/lint/56 tests; physical reload pending.
- PENDING: new-UI keyboard/minute-long voice regression, isolated bulk clear, 30/60-minute OS actions, Persistent delivery, final assets/demo/subjective approval.

Older dated sections below are historical evidence; the October 1 checkpoint supersedes their pending reload notes.

| Area | Scenario | Target | Status |
| --- | --- | --- | --- |
| Android build | Compile debug APK | GitHub Actions | Passed 2026-09-29 |
| Android screenshot | Install fixture release APK and capture 1179×2556 Home | GitHub Android emulator | Passed 2026-09-29; reviewed 1179×2556 recovery screenshot in assets/submission; https://github.com/emmaGH1/coby/actions/runs/36631406071 |
| Android runtime | Install/open current recovery build | Pixel 6 AVD, Android 16 / API 36 | Pending: earlier prototype passed; current local build interrupted; toolchain packages and Java 17 now installed |
| Capture | Adaptive Home composer accepts and preserves an editable text dump | Unit + Pixel 6 AVD | Partial: typed/voice merge helper passed and populated composer release-rendered; real text entry and keyboard behavior pending locally |
| Receipt | Correct items displayed; unknown due date stays absent | Pixel 6 AVD | Passed 2026-09-29; three items shown, including one undated item |
| Persistence | Saved items survive app kill/restart | Pixel 6 AVD | Passed 2026-09-29; saved and completed state restored after reconnect |
| Home | Persistent composer, one NOW, max two NEXT, clear empty state | Unit + Android | Partial: data limits passed and populated recovery Home release-rendered; empty state and keyboard interaction pending locally |
| Completion | Completing NOW removes it and recomputes NOW | Pixel 6 AVD | Passed 2026-09-29; assignment surfaced after call was completed |
| Parser | Messy input extracts only stated facts; ambiguity flagged | Unit + Android | Partial: fixture and configured Gemini sample passed 2026-09-29 with no invented deadline hour; ambiguity handling not directly tested |
| Plan | List shows active items; Calendar selected day shows correct items | Pixel 6 AVD | Passed 2026-09-29; Sep 30 assignment appeared on selected day; undated item stayed in List |
| Rank | Active, overdue, latest safe start, due today/tomorrow, stable tie order | Unit | Passed 2026-09-29: covers active, overdue, latest-start, due today/tomorrow, due soon, explicit priority, deterministic ties, and completed exclusion |
| Explanation | “Why this now?” reflects actual reason codes | Unit + Android | Passed 2026-09-29: reason text checked for active, overdue, latest-start, and date-only today/tomorrow |
| Focus | Only one item visible; finish and exit work | Pixel 6 AVD | Passed 2026-09-29: one-item screen, End focus, and Complete passed; completing Call Daniel recomputed NOW to the assignment |
| Clock | DemoClock advances ranking/nudges deterministically | Unit | Passed 2026-09-29: DemoClock minute advancement verified |
| Nudge | Reschedule on edit; cancel on complete; no unknown-date nudge; cap frequency | Unit + Android | Partial: immediate local nudge delivered on Pixel 6; future schedule, cancellation, and frequency cap remain |
| Speech | Availability, multi-clause capture, segmented transcript, stop/retry, denied-permission fallback | Unit + Android development build | Partial: service detection, transcript merge, and error-copy helpers implemented; recognizer service exists on Pixel 6; real spoken transcription pending |
| Gemini | Schema, nulls, failures, offline fallback behavior | Unit + Android dev build | Partial: fixture and live sample extraction passed on Pixel 6; failure/offline cases remain |
| RevenueCat | Test Store purchase, restore, entitlement, free vs Plus gates | Android development build | Partial: verified $4.99 monthly product, coby_plus mapping, valid Test Store purchase, and Persistent reminder unlock on Pixel 6 AVD; restore remains untested |
| Lab | Seed, clear, advance time, trigger nudge, parser fixture, billing state | Android dev build | Partial: Gemini selection, billing diagnostic, immediate nudge, and clear-data controls verified; time controls not exercised |
| Quality | Typecheck, lint, meaningful tests, visual review, accessibility | CI/local + Android | Partial: typecheck, lint, and 19 tests pass; populated Home passed release render and finish review with 48 dp Android targets; remaining screens and local voice still pending |

## Latest run

2026-09-29 recovery slice: TypeScript, lint, and 19 tests pass. Android release capture https://github.com/emmaGH1/coby/actions/runs/36631406071 produced the reviewed 1179×2556 populated Home, now checked into `assets/submission/screenshot-home.png`. The finish review accepted the capture-first composition and required 48 dp touch targets for secondary Android controls; commits `527a3f9` and `071a5c3` contain the target and alignment fixes. The Pixel 6 AVD exposes Google's recognition service, and the local Android toolchain is now complete, but the Java 17 build was interrupted, so real spoken transcription, empty-state keyboard behavior, and a current local APK remain unverified. Earlier prototype evidence for parsing, persistence, rank, Plan, Focus, notification delivery, and RevenueCat purchase remains valid at the behavior level.

## 2026-09-30 receipt slice

Typecheck, lint, and 24 tests passed. Receipt validation covers unknown timing, invalid dates, local time round trips, clearing timing, invalid durations, and explicit review of ambiguous extraction. Current receipt Android interaction/visual review is pending while the local emulator reports System UI ANR and the development client reports a Metro connection error.

## 2026-09-30 — User-requested Home revision

- Typecheck, lint, and all 24 tests passed after the Home/orb/speech event changes.
- Pixel 6 API 36 development build loaded the current bundle through localhost Metro. Empty Home rendered with central sphere and a fixed bottom composer; status-bar inset is correct. The development-client gear overlay is not production UI.
- User reported no captured words in the previous live voice attempt: failed, not passed.
- SDK emulator microphone-state RPC returned host forwarding off; enabling it returned success and a second read returned on.
- Native volume response, actual multi-clause spoken transcription, denied permission, stop/retry, and reduced-motion device behavior remain pending.
- Prior release screenshot represents the superseded Home layout; do not submit it as the final UI.

Current emulator interaction caveat: Android/Gboard opened a stylus onboarding overlay during automated text entry. Text-to-receipt verification is not passed. Metro also reported emulator DNS failures resolving api.revenuecat.com in this session; prior successful billing evidence remains historical, not a current connectivity pass.

### Follow-up device evidence

The stylus tutorial was dismissed. Current Pixel 6 development build passed bottom-dock typed input, fixture parsing to receipt, accepting an undated item, local save/read to NOW, and completion returning to empty Home. Test phrase: "Remember to water the plants" (synthetic). Empty and one-item Home were inspected inline. This does not verify spoken transcription, software-keyboard resize, multi-item NEXT rendering, or full receipt correction fields.

## Speech network error recovery

- User retry failed with native speech network error; voice remains failed/unverified.
- Host mic forwarding was re-read as on; Android networks reported VALIDATED; google.com DNS resolved. ICMP ping had no response, which does not prove HTTPS failure. No HTTP proxy configured.
- New code: prefer offline recognition only for a confirmed installed English model; recover from network failure with setup action; keep text/tasks usable during bounded setup. Lab check/setup added.
- Typecheck, lint, 27 tests passed. New tests cover installed versus merely supported locales, locale normalization, missing/unsupported model, native query error and timeout.
- Pixel 6 native model check did not confirm English ready; native model download rejected with client error 5. No successful spoken transcription claimed. Emulator reboot/retry pending.

## Standard native microphone compatibility

- Online voice switched to standard capture; continuous mode requires a verified installed offline model.
- Typecheck, lint, and 27 tests passed; current Android bundle generated successfully.
- Data-preserving cold boot restored app services, but System UI/Pixel Launcher ANRs recur. Spoken acceptance remains blocked by an unreliable emulator session; no transcript success claimed.
- Synthetic microphone injection could not complete: emulator RPC timed out and the connection reset; ADB then waited for the disconnected device. This is not a voice pass. Recheck host microphone forwarding when restarting the AVD.

## Voice-only review on physical Android

- Typecheck, lint (no warnings), all 34 tests, and diff checks pass.
- OnePlus A6010, Android 11/API 30, arm64; default com.google.android.googlequicksearchbox recognition service. Development APK installed and current 871-module bundle loaded through localhost USB reverse.
- Live two-clause synthetic phrase: PASSED by user confirmation; both parts appear correctly in the field.
- Stop/retry preserving prior words: PASSED by user confirmation; a second spoken phrase appended to the first without replacement or lost words.
- Permission denial/text fallback: PASSED on the physical phone. Runtime microphone permission was denied; the access-off message appeared, the field accepted typed input, and microphone access was restored afterward. Background cancellation and native volume response remain unverified.
- No persisted audio, real personal dumps, or credentials are committed. Emulator voice remains unverified; Android system/app ANRs prevented reliable testing.

## Natural pauses and longer voice capture

- User regression: initial silence ends capture after ~2 seconds and longer speech is cut at 3–5 seconds. Prior short-phrase acceptance did not cover this.
- Typecheck, lint, all 38 tests pass. Session tests cover repeated silent cycles, multi-cycle final/interim text preservation, Done while silent/restarting, and fatal/background cancellation.
- Current Android bundle generated and loaded on the OnePlus phone. Live acceptance PASSED by user confirmation: 7-second wait before the first word, ~30-second dump with 3–4 second pauses, all three errands captured, and manual Done.
- Longer silence hints are provider-dependent. The continuation logic must preserve the dump when native boundaries still occur.

- Background/return smoke check: returning Home showed Speak, not continued listening. Startup foreground guard added for preparation races; all 38 tests/typecheck/lint passed afterward. This is a short smoke check, not a full background-duration test.
## Saved details and accidental Focus recovery

- Typecheck, lint, and all 42 tests pass.
- New domain cases preserve the same ID/source/history/lifecycle/commitment when editing, validate corrected timing, shift nudge timestamps, clear unknown timing to null with no nudges, and restore captured/planned status without completion after Focus.
- Current Android bundle loaded on the connected OnePlus A6010; Plan's Edit details controls observed. No phone data clearing or seeding.
- Pending live interaction acceptance: edit/save a time, cancel an unsaved edit, return via visible and Android Back from Focus, persist corrections after relaunch, and observe a revised notification replacing the prior schedule.

## Renewed voice cutoff follow-up

- User reports mid-dump cutoff/restart; prior 30-second acceptance no longer establishes reliable real use.
- Typecheck, lint, all 44 tests pass. Added legacy long-window/modern microphone-mode and duplicate end/late-result regression coverage.
- Candidate restores the legacy continuous hints and removes the extra application restart delay. Timing-only development diagnostics added.
- Live verification pending: user must save unsaved words before reload, then perform a minute-long paused dump while metadata confirms actual native boundaries. No claim of uninterrupted capture or resolved provider cutoff yet.

## Covered composer, utterance resets and task deletion

- User live result: keyboard covers the composer; voice still appears to cut/reset. Prior voice candidate is not a live pass.
- Evidence: one native start, repeated speech-end events, end only after Done (~36s). Sanitized partial metadata shows longer utterances replaced by short new partials during that same session.
- Typecheck, lint, all 47 tests pass. New synthetic cases cover speech-boundary partial retention, delayed corrections, cumulative native results and intentionally repeated utterances.
- Keyboard correction: Android height avoidance plus explicit resize config. Device visibility/cursor/send verification pending.
- Deletion: cancel item-specific notifications, delete one SQLite ID, refresh Home/Plan. Confirmation Cancel, isolated synthetic delete, untouched other tasks and persistence after relaunch remain pending physical checks.
- Await user readiness before reload to preserve unsaved dump text. No real held item was deleted during agent work.

## Wireless device setup

- OnePlus A6010 paired over Android Studio wireless debugging; adb device state is connected without USB.
- Wireless reverse tcp:8082 established. Metro remains localhost-only; 873-module Android bundle loaded on the phone.
- Editor visible on-device. Home typing, live utterance retention and synthetic-item deletion remain pending acceptance; no edits/deletions of real items performed by agent.

## Latest user acceptance and Clear list

- User explicitly confirmed: both keyboard-visible typing and minute-long voice dump now work on the wireless OnePlus A6010. This supersedes the pending acceptance for those two conditions; offline/other-device speech remains unverified.
- Clear list added to Plan List with count/scope confirmation. Cancel selected open-item reminders before transactional deletion of those IDs, preserving completed/archived history. Cancellation failure leaves items and reports potentially stopped reminders.
- Typecheck, lint, all 47 tests pass after bulk-clear implementation. Live Clear list confirmation/cancel and synthetic-item deletion/persistence still pending. No real list cleared.
- Nudges remain P0: prior immediate delivery is historical evidence; future/background delivery, reschedule/cancel and Persistent cadence still need device checks.

- Clear list phone follow-up: updated bundle loaded after waiting for Metro startup. Plan List exposes the action. Native confirmation reports the held-item count and all-calendar-days scope, with Keep my list/Clear list. Keep my list dismissed the dialog and retained the populated Plan. Actual bulk deletion/reminder cancellation/persistence was not exercised against real user items.


## September 30 — Nudge actions and weekly inspection

- PASS: typecheck, lint, 56 tests; close-deadline fallback, deadline-preserving 15/30/60-minute postponement, duplicate/stale action guards, edit cancellation, completed-item suppression and seven-day/previous-next week generation.
- PASS: Android Hermes bundle includes the approved companion and new screens. This is bundle verification, not physical-device acceptance.
- PASS: browser preview header/arrival, seven dates, previous week/Today, Completed restore and simulated notification delay/check-in, plus prior safe task controls and mobile width.
- PENDING: real future/background heads-up delivery, each delay choice changing the native schedule, notification body opening the correct item, action after app termination, disabling reminders and edit/complete/delete/clear cancellation. Verify actual unchanged deadline and persisted reminder time.
- PENDING: native Plan/arrival/Settings/check-in rendering, saved completion restore after restart, keyboard visibility and the previously accepted minute-long paused voice dump after this UI integration. SpeechSession code was not changed.
- BLOCKED DEVICE: no current adb or mDNS device. User has been asked to reconnect and save unsent words before reload. Test only clearly labelled synthetic items; no real held list may be cleared.

## Physical Gentle delivery and 15-minute action

- PASS: approved bundle loaded on wireless OnePlus A6010; Home, Plan List, receipt and reminder choices observed. Real tasks retained.
- PASS: synthetic 22:25 local deadline saved through live extraction/receipt; Gentle delivered while Coby was backgrounded. Android confirms HIGH importance, system sound/vibration and three category actions.
- PASS: actual notification 15-minute response persisted one new reminder while leaving the deadline unchanged; exactly one native pending request for this test item. SQLite inspection remained in memory and printed only test fields.
- PASS: channel sound warning corrected; typecheck, lint and 56 tests pass. Latest motion preview check passes.
- PENDING: visible action feedback, body tap/cold start, 30/60-minute actions, edit/complete/delete cancellation and keyboard/voice regression after UI integration. Clean up synthetic reminder after verification.

## Extended-window follow-through acceptance

- PASS: edited deadline clears the old postponed reminder and leaves exactly one replacement native request; replacement notification delivered after am kill of Coby's background process (not force-stop).
- PASS: user confirmed body tap opened correct synthetic item with corrected 22:43 deadline; check-in screen inspected.
- PASS: 30/60-minute in-app choices each preserve dueAt and leave exactly one native request. Only the 15-minute action was exercised from the OS notification itself.
- PASS: Off and completion each remove the synthetic pending native request; Completed shows strikethrough; restoring that test item returns it to planned with its future requested reminder.
- PENDING: 30/60-minute OS actions, visible/Android Back Focus exit, synthetic deletion/persistence, Persistent native cadence, RevenueCat restore, bulk clear in an isolated dataset, and keyboard/voice after the latest UI changes.
- Feedback/Manrope consistency correction is code verified; physical reload is pending. Do not claim these newest changes are installed. Phone readiness is requested because foreground switched away from Coby.

