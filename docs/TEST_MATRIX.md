# Test matrix

Record date, device/emulator, build, result, and evidence for every executed row. “Planned” is not “passed.”

| Area | Scenario | Target | Status |
| --- | --- | --- | --- |
| Android build | Compile debug APK | GitHub Actions | Passed 2026-09-29 |
| Android screenshot | Install fixture release APK and capture 1179×2556 Home | GitHub Android emulator | Passed 2026-09-29; screenshot included in assets/submission |
| Android runtime | Install/open current recovery build | Pixel 6 AVD, Android 16 / API 36 | Pending: earlier prototype passed; current build blocked by incomplete NDK download |
| Capture | Adaptive Home composer accepts and preserves an editable text dump | Unit + Pixel 6 AVD | Partial: typed/voice merge helper passed; current Android layout and keyboard behavior pending |
| Receipt | Correct items displayed; unknown due date stays absent | Pixel 6 AVD | Passed 2026-09-29; three items shown, including one undated item |
| Persistence | Saved items survive app kill/restart | Pixel 6 AVD | Passed 2026-09-29; saved and completed state restored after reconnect |
| Home | Persistent composer, one NOW, max two NEXT, clear empty state | Unit + Android | Partial: data limits passed previously; redesigned empty/populated Android render pending |
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
| Quality | Typecheck, lint, meaningful tests, visual review, accessibility | CI/local + Android | Partial: typecheck, lint, and 19 tests pass for recovery slice; new Home visual review pending; local NDK reinstall failed when the download connection reset |

## Latest run

2026-09-29 recovery slice: TypeScript, lint, and 19 tests pass. Unit checks cover preserving typed text during dictation and actionable recognizer errors. The Pixel 6 AVD is connected and exposes Google's recognition service. A clean NDK reinstall was attempted after moving the empty package folder aside; Gradle accepted the license and began the exact `27.1.12297006` install, but the download failed with `java.net.SocketException: Connection reset`. The redesigned Home and real spoken transcription therefore remain unverified on Android. Earlier prototype evidence for parsing, persistence, rank, Plan, Focus, notification delivery, and RevenueCat purchase remains valid at the behavior level, while its visual screenshot is stale.
