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
