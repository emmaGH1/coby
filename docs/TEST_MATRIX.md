# Test matrix

Record date, device/emulator, build, result, and evidence for every executed row. “Planned” is not “passed.”

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
