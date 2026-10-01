# Coby progress — October 1, 2026

## Current closeout

P0 acceptance remains open; no P1 work has started. The core relief flow, saved controls, ranking and RevenueCat Test Store have physical evidence. Current source adds the voice-warning correction, bounded extraction/offline manual retention, and the user-approved automatic Gentle default for new exact-time future items. Typecheck/lint and 68 tests pass; the latest changes still need the safe phone reload.

Approved C launcher/adaptive assets/native splash are exported and native build passed. The submission screenshot is refreshed from actual Android 16 at 1179×2556, inspected and committed. Isolated native Persistent/bulk-clear/restart and full native UI receipt/Focus/Plan/history gates are running in CI. Pending does not mean passed.

The supplied demo is a local draft requiring correction of private task footage and inaccurate speech/SDK/event claims. See DEMO_REVIEW and SUBMISSION. Next Gen can use source plus a truthful device demo; the public fixture APK is an auxiliary offline sample, not live AI/purchase access. A public live-AI APK needs a secured endpoint and is not claimed as delivered.

Submission deadline: **October 1 at noon PDT / 8:00 PM Lagos**, confirmed at https://revenuecat-shipaton-2026.devpost.com/. Keep scope focused on P0 reliability, cohesive visuals, build and demo; the extension does not change P1 scope.

P0 is the complete first usable Coby, including dependable capture, nudges and a polished companion experience. P0 is not complete. The user confirmed that keyboard-visible typing and a minute-long voice dump now both work on the OnePlus A6010. This is acceptance for those tested conditions, not every Android device or offline speech.

## Accomplished

| Area | Evidence and remaining limit |
| --- | --- |
| Product foundation | Product canon, implementation/design/guardrail documents, handover, test/demo/decision records and environment template exist. |
| Android build | Native development app runs on a physical OnePlus; wireless debugging and localhost reverse work without USB. |
| Brain dump | Text and native voice exist. User confirmed typing remains visible with the keyboard open and a minute-long paused voice dump retains words. Earlier permission-denial fallback and stop/retry passed. Offline voice remains unverified. |
| Understanding/receipt | Fixture/live Gemini extraction and native corrections passed; unknown timing remains null. User reports receipt use works. The specific multi-item offscreen error jump was not understood/tested; parsing failure cases remain open. |
| Holding/Home | Local SQLite, persistence across restart, completion and deterministic NOW/NEXT ranking previously passed. Home has one NOW and at most two NEXT, explanation and central orb above bottom capture. |
| Plan/Focus | Saved corrections, synthetic deletion and both Focus exits passed. User accepts Home editing, native timing controls and Earlier recovery on the current phone. |
| Clear list | Implemented in Plan > List with confirmation, scoped notification cancellation and one SQLite deletion transaction. Removes all open items across calendar days; retains completed/archived history. Loaded on the wireless phone; confirmation and Keep my list cancellation passed. Actual bulk removal/persistence remains unverified. |
| Nudges | Gentle future/background delivery, edited-time replacement, 15-minute OS action, 30/60-minute in-app delays, Off/completion/delete cancellation and cold-start body opening passed on OnePlus. Persistent delivery, 30/60-minute OS actions and bulk-clear cancellation remain pending. |
| Billing | $4.99 coby_plus_monthly Test Store purchase, restore and Persistent gate verified on OnePlus September 30. Two native Persistent requests verified; full delivery cadence remains open. |
| Quality/harness | Typecheck/lint and 64 tests pass. Fixture parser, SystemClock/DemoClock and Lab controls exist; the complete demo path remains to rehearse. |
| Repository/assets | README/setup and license exist; orb and icon assets exist. Final asset review, fresh screenshot and final demo recording remain. |

## Remaining P0, in working order

1. Load and confirm the verified false-silence warning correction; preserve the user-accepted typing and minute-long capture. Verify the specific multi-item offscreen receipt error jump later.
2. Verify actual Persistent delivery and 30/60-minute notification-button actions. Scheduling, entitlement/purchase/restore, Gentle delivery and cancellation on edit/complete/delete already passed.
3. Verify actual Clear list removal, reminder cancellation, history preservation and restart using an isolated synthetic dataset. Never clear the user's real list.
4. Complete interrupted-session, parser failure, offline text fallback and restart acceptance. Offline speech depends on the device/service; do not promise it from unit tests alone.
5. Export the approved C launcher icon/native splash; replace stale screenshots; finish README/setup and a submission-safe Android build with no embedded Gemini development secret. RevenueCat Test Store is a hackathon development integration, not production store billing.
6. Review/rehearse the demo being made with the other agent, confirm final visuals and submission requirements, and reserve time for final submission. P1 is optional after these gates, not a reason to delay a stable submission.

## While the user rests

Agent work: targeted fixes/tests, isolated reliability checks, asset preparation, documentation/build preparation and review of a supplied demo artifact. Routine assets/build work should use the user's lower-model preference before starting. Protect real phone data and unsaved input; no broad reseeding or clearing.

Human work when awake: short spoken confirmation of the warning fix, the specific receipt error-jump check if still needed, final visual/demo approval, any required account/credential action and final submission. The user need not stay present for routine development.

## P1 — only after P0 is stable

- Locked commitment with rescue code: voluntary friction, not OS-level blocking.
- Dark mode.
- Richer orb motion and haptics beyond P0's basic responsive states.
- Natural-language corrections, such as “move that to tomorrow at five.” Manual field editing is P0.

Notifications, basic orb responsiveness, keyboard fixes, editing, deletion, clearing, navigation and cohesive premium design are P0. Google login, calendar/Gmail sync, cloud sync, feeds, projects/tags, habits/streaks, app blocking and autonomous agents remain outside the submission scope; they are not promised P1 features.


## Latest implementation checkpoint

October 1 readability/recovery update installed on OnePlus from successful native build 36792872254. Icons and larger labels render; prior-day tasks stay held in Earlier outside NOW/NEXT. Native date/time selection/cancellation, persisted date-only clearing, live receipt review blocking/error scrolling/checkbox acceptance and Home NEXT edit/Back passed. A caught Plan return-view bug is corrected and phone verified. Latest bundle runs on localhost:8083. Typecheck/lint/62 tests pass. Only Coby nudge test was changed and removed; real-item digests unchanged.

The user now reports all five requested checks work, including Home editing and capture. Their specific offscreen error-jump check remains unclear. False silence feedback is corrected in source; typecheck/lint/64 tests and Android export pass, with reload/physical confirmation pending. Active-Plus display is installed. Isolated bulk clear, OS 30/60-minute actions, full Persistent delivery, failure/restart acceptance, launcher/splash assets, fresh screenshot/demo and final approval remain. P0 is not complete; no P2 scope has been agreed.
