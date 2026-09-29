# Test matrix

Record date, device/emulator, build, result, and evidence for every executed row. “Planned” is not “passed.”

| Area | Scenario | Target | Status |
| --- | --- | --- | --- |
| Capture | Text dump parses fixture, transcript remains editable | Unit + Android | Planned |
| Receipt | Correct items displayed, unknown due/duration absent, correction before save | Unit + Android | Planned |
| Persistence | Saved items survive app kill/restart | Android | Planned |
| Home | One NOW, max two NEXT, clear empty state | Unit + Android | Planned |
| Completion | Completing NOW removes it and recomputes NOW | Unit + Android | Planned |
| Parser | Messy input extracts only stated facts; ambiguity flagged | Unit | Planned |
| Plan | List shows all; Calendar selected day shows correct items | Unit + Android | Planned |
| Rank | Active, overdue, latest safe start, due today/tomorrow, stable tie order | Unit | Planned |
| Explanation | “Why this now?” reflects actual reason codes | Unit + Android | Planned |
| Focus | Only one item visible; finish and exit work | Android | Planned |
| Clock | DemoClock advances ranking/nudges deterministically | Unit | Planned |
| Nudge | Reschedule on edit; cancel on complete; no unknown-date nudge; cap frequency | Unit + Android | Planned |
| Speech | Permission, capture, editable transcript, denied-permission text fallback | Android development build | Planned |
| Gemini | Schema, nulls, failures, offline fallback behavior | Unit + Android dev build | Planned |
| RevenueCat | Test Store purchase, restore, entitlement, free vs Plus gates | Android development build | Planned |
| Lab | Seed, clear, advance time, trigger nudge, parser fixture, billing state | Android dev build | Planned |
| Quality | Typecheck, lint, meaningful tests, visual review, accessibility | CI/local + Android | Planned |

## Latest run

2026-09-29: typecheck passed; lint passed; 4 domain tests passed; Android JS bundle export passed. No Android runtime target available, so persistence and UI flow remain unverified on device.

