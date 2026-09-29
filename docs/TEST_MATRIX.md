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
| Home | One NOW, max two NEXT, clear empty state | Unit + Android | Passed 2026-09-29; one NOW and up to two NEXT observed |
| Completion | Completing NOW removes it and recomputes NOW | Pixel 6 AVD | Passed 2026-09-29; assignment surfaced after call was completed |
| Parser | Messy input extracts only stated facts; ambiguity flagged | Unit + Android | Partial: fixture and configured Gemini sample passed 2026-09-29 with no invented deadline hour; ambiguity handling not directly tested |
| Plan | List shows active items; Calendar selected day shows correct items | Pixel 6 AVD | Passed 2026-09-29; Sep 30 assignment appeared on selected day; undated item stayed in List |
| Rank | Active, overdue, latest safe start, due today/tomorrow, stable tie order | Unit | Planned |
| Explanation | “Why this now?” reflects actual reason codes | Unit + Android | Planned |
| Focus | Only one item visible; finish and exit work | Android | Planned |
| Clock | DemoClock advances ranking/nudges deterministically | Unit | Planned |
| Nudge | Reschedule on edit; cancel on complete; no unknown-date nudge; cap frequency | Unit + Android | Planned |
| Speech | Permission, capture, editable transcript, denied-permission text fallback | Android development build | Planned |
| Gemini | Schema, nulls, failures, offline fallback behavior | Unit + Android dev build | Partial: fixture and live sample extraction passed on Pixel 6; failure/offline cases remain |
| RevenueCat | Test Store purchase, restore, entitlement, free vs Plus gates | Android development build | Partial: monthly Test Store package reported ready and Plus inactive; purchase/restore not performed |
| Lab | Seed, clear, advance time, trigger nudge, parser fixture, billing state | Android dev build | Partial: Gemini selection, billing diagnostic, and clear-data controls verified; time/nudge controls not exercised |
| Quality | Typecheck, lint, meaningful tests, visual review, accessibility | CI/local + Android | Partial: typecheck, lint, 11 tests, and visual review passed; local native build blocked by stalled NDK download |

## Latest run

2026-09-29: Pixel 6 AVD on Android 16 / API 36. CI-built debug APK launched through loopback-only Metro. Fixture and configured Gemini text capture each extracted three items; the date-only assignment had no invented hour, and the undated item stayed undated. SQLite state, completion recomputation, and Plan List/Calendar were verified after restart. Test items were cleared. Speech, local notifications, and RevenueCat purchase/restore remain to be checked. Local Gradle compilation still needs a successful NDK 27.1.12297006 install.
