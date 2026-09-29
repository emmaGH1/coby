# Implementation plan

## Architecture

Android-first React Native + Expo + TypeScript. Use an Expo development build early because native speech recognition and RevenueCat require native modules. Local SQLite is the source of truth. Local notifications are scheduled from deterministic rules. Gemini Flash-class inference is limited to messy-language extraction; use a fixture parser for offline development and the demo. No backend is required for the prototype, but a public production build must put Gemini behind a server endpoint instead of embedding a long-lived key.

Suggested boundaries: `app/` screens and routing; `components/` presentation; `features/capture`, `parser`, `planning`, `focus`, `notifications`, `billing`; `lib/db`, `clock`, `theme`, `config`; `assets/`. Screens compose features; no business rules in screen components or giant utility file.

## Contracts

`BrainDumpParser.parse(input, context): Promise<ParseResult>` with `GeminiBrainDumpParser` and `FixtureBrainDumpParser`. Context supplies local time and timezone. Output includes title, source fragment, kind (`task | event | reminder`), nullable `dueDate` (date only), nullable `dueAt` (exact clock time), nullable `durationMinutes`, nullable explicit priority (`urgent | important`), confidence, and clarification flag/question. The parser never ranks, schedules, nudges, or invents values.

`Clock.now(): Date` with `SystemClock` and `DemoClock`; inject it into ranking, parsing context, focus, notification scheduling, and demo fixtures. Avoid scattered `new Date()` in business logic.

Stored `CobyItem`: id, title, sourceText, kind, createdAt, dueDate|null, dueAt|null, durationMinutes|null, explicitPriority|null, status (`captured | planned | active | completed | archived`), commitmentMode (`none | gentle | persistent | locked`), completedAt|null. Add only fields needed by a working slice.

Ranking inputs, in order: active commitment, overdue, latest safe start, deadline proximity, duration versus remaining time, explicit importance, stable creation order. Return reason codes with the ranking. Home selects one NOW and at most two NEXT. Plan shows all.

For each item change, cancel its old local notifications, compute intervention points, and schedule fresh ones. Gentle uses one or two useful reminders. Persistent can escalate around a comfortable and latest safe start, with a frequency cap. Unknown deadlines never become fabricated notification times.

## Checkpoints

0. **Context foundation:** create all requested docs, `.env.example`, repo setup, and a single active handover action. Commit.
1. **Vertical slice:** scaffold Expo TypeScript app; text dump → fixture extraction → receipt → SQLite save → Home NOW → completion. Verify typecheck, lint, tests, and Android if available. Update handover and commit before live AI or speech.
2. **Inspection and focus:** Plan List/Calendar, deterministic ranking and reason, focus flow. Verify and commit.
3. **Time and nudges:** clock injection, local notification scheduler, Gentle/Persistent policies, Coby Lab controls. Verify on Android and commit.
4. **Native integrations:** development build, speech recognition, Gemini parser, RevenueCat Test Store with entitlement and monthly product. Preserve offline fixture path. Verify and commit.
5. **Feature freeze:** once all P0 passes, address reliability, visual polish, accessibility, README/license, icon, screenshot, and under-two-minute demo. Consider P1 only if P0 is stable and time remains.

## Coby Lab harness

Development-only surface with seed demo data, clear local data, advance DemoClock, trigger next nudge, switch parser fixture/live mode, and show RevenueCat entitlement state. Never ship a control that silently corrupts production state. The demo path must run without network or real-time waiting.

## Human work

Provide the Gemini development key and RevenueCat Test Store project/API key when asked; create the `coby_plus` entitlement and monthly product if agent access is unavailable; review the subjective visual direction; record the Android demo; handle GitHub access and final submission. The agent should build all independent code, fixtures, docs, tests, and assets first, and identify exact account steps when needed.

## Completion evidence

Each checkpoint needs a device or emulator observation where available, typecheck/lint/test results, an updated test matrix, one NEXT ACTION, and a commit. Do not describe unverified native integrations as working.

