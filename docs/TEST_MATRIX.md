# Test matrix

Record date, device/emulator, build, result, and evidence for every executed row. “Planned” is not “passed.”

| Area | Scenario | Target | Status |
| --- | --- | --- | --- |
| Android build | Compile debug APK | GitHub Actions | Passed 2026-09-29 |
| Android screenshot | Install fixture release APK and capture 1179×2556 Home | GitHub Android emulator | Passed 2026-09-29; screenshot included in assets/submission |
| Android runtime | Install/open dev build and reconnect to Metro | Pixel 6 AVD, Android 16 / API 36 | Passed 2026-09-29 using CI-built debug APK and loopback-only ADB reverse |
| Capture | Text dump parses fixture; transcript remains editable | Pixel 6 AVD | Partial: sample capture passed 2026-09-29; manual transcript correction not tested |
| Receipt | Correct items displayed; unknown due date stays absent | Pixel 6 AVD | Passed 2026-09-29; three items shown, including one undated item |
| Persistence | Saved items survive app kill/restart | Pixel 6 AVD | Passed 2026-09-29; saved and completed state restored after reconnect |
| Home | One NOW, max two NEXT, clear empty state | Unit + Android | Passed 2026-09-29; one NOW, up to two NEXT, and empty state observed |
| Completion | Completing NOW removes it and recomputes NOW | Pixel 6 AVD | Passed 2026-09-29; assignment surfaced after call was completed |
| Parser | Messy input extracts only stated facts; ambiguity flagged | Unit + Android | Partial: fixture and configured Gemini sample passed 2026-09-29 with no invented deadline hour; ambiguity handling not directly tested |
| Plan | List shows active items; Calendar selected day shows correct items | Pixel 6 AVD | Passed 2026-09-29; Sep 30 assignment appeared on selected day; undated item stayed in List |
| Rank | Active, overdue, latest safe start, due today/tomorrow, stable tie order | Unit | Passed 2026-09-29: covers active, overdue, latest-start, due today/tomorrow, due soon, explicit priority, deterministic ties, and completed exclusion |
| Explanation | “Why this now?” reflects actual reason codes | Unit + Android | Passed 2026-09-29: reason text checked for active, overdue, latest-start, and date-only today/tomorrow |
| Focus | Only one item visible; finish and exit work | Pixel 6 AVD | Passed 2026-09-29: one-item screen, End focus, and Complete passed; completing Call Daniel recomputed NOW to the assignment |
| Clock | DemoClock advances ranking/nudges deterministically | Unit | Passed 2026-09-29: DemoClock minute advancement verified |
| Nudge | Reschedule on edit; cancel on complete; no unknown-date nudge; cap frequency | Unit + Android | Partial: immediate local nudge delivered on Pixel 6; future schedule, cancellation, and frequency cap remain |
| Speech | Permission, capture, editable transcript, denied-permission text fallback | Android development build | Partial: microphone permission granted; silent session returned no speech and displayed text fallback; spoken transcription not tested |
| Gemini | Schema, nulls, failures, offline fallback behavior | Unit + Android dev build | Partial: fixture and live sample extraction passed on Pixel 6; failure/offline cases remain |
| RevenueCat | Test Store purchase, restore, entitlement, free vs Plus gates | Android development build | Partial: verified $4.99 monthly product, coby_plus mapping, valid Test Store purchase, and Persistent reminder unlock on Pixel 6 AVD; restore remains untested |
| Lab | Seed, clear, advance time, trigger nudge, parser fixture, billing state | Android dev build | Partial: Gemini selection, billing diagnostic, immediate nudge, and clear-data controls verified; time controls not exercised |
| Quality | Typecheck, lint, meaningful tests, visual review, accessibility | CI/local + Android | Partial: typecheck, lint, 17 tests, and visual review passed; ESLint skips generated android/; local Gradle build reports missing source.properties for NDK 27.1.12297006 (CXX1101) |

## Latest run

2026-09-29: Pixel 6 AVD on Android 16 / API 36. CI-built debug APK launched through loopback-only Metro. Fixture and configured Gemini text capture each extracted three items; the date-only assignment had no invented hour, and the undated item stayed undated. SQLite state, completion recomputation, Plan List/Calendar, focus start/end and completion-from-focus, and an immediate local notification were verified. Completing from focus recomputed NOW to the assignment. Android speech permission succeeded but no spoken input was available, so the app showed its text fallback. Test items and the test notification were cleared. RevenueCat now displays $4.99/month; the default Monthly package uses coby_plus_monthly attached to coby_plus. A valid Test Store purchase unlocked Persistent reminders and Coby Lab confirmed Plus active. Restore remains untested. npm test (17), typecheck, and lint passed after the ranking/clock additions. Local Gradle compilation still needs a successful NDK 27.1.12297006 install.
