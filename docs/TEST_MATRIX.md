# Test matrix

Record date, device/emulator, build, result, and evidence for every executed row. “Planned” is not “passed.”

| Area | Scenario | Target | Status |
| --- | --- | --- | --- |
| Android build | Compile debug APK | GitHub Actions | Passed 2026-09-29 |
| Android screenshot | Install fixture release APK and capture 1179×2556 Home | GitHub Android emulator | Passed 2026-09-29; reviewed 1179×2556 recovery screenshot in assets/submission; https://github.com/emmaGH1/coby/actions/runs/36631406071 |
| Android runtime | Install/open current recovery build | Pixel 6 AVD, Android 16 / API 36 | Pending: earlier prototype passed; current build blocked by incomplete NDK download |
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

2026-09-29 recovery slice: TypeScript, lint, and 19 tests pass. Android release capture https://github.com/emmaGH1/coby/actions/runs/36631406071 produced the reviewed 1179×2556 populated Home, now checked into `assets/submission/screenshot-home.png`. The finish review accepted the capture-first composition and required 48 dp touch targets for secondary Android controls; commits `527a3f9` and `071a5c3` contain the target and alignment fixes. The Pixel 6 AVD exposes Google's recognition service, but the local NDK download still resets, so real spoken transcription, empty-state keyboard behavior, and a current local APK remain unverified. Earlier prototype evidence for parsing, persistence, rank, Plan, Focus, notification delivery, and RevenueCat purchase remains valid at the behavior level.
