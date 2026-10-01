# Coby progress — October 1, 2026

Submission deadline: **October 1 at noon PDT / 8:00 PM Lagos**, confirmed at https://revenuecat-shipaton-2026.devpost.com/. Keep scope focused on P0 reliability, cohesive visuals, build and demo; the extension does not change P1 scope.

P0 is the complete first usable Coby, including dependable capture, nudges and a polished companion experience. P0 is not complete. The user confirmed that keyboard-visible typing and a minute-long voice dump now both work on the OnePlus A6010. This is acceptance for those tested conditions, not every Android device or offline speech.

## Accomplished

| Area | Evidence and remaining limit |
| --- | --- |
| Product foundation | Product canon, implementation/design/guardrail documents, handover, test/demo/decision records and environment template exist. |
| Android build | Native development app runs on a physical OnePlus; wireless debugging and localhost reverse work without USB. |
| Brain dump | Text and native voice exist. User confirmed typing remains visible with the keyboard open and a minute-long paused voice dump retains words. Earlier permission-denial fallback and stop/retry passed. Offline voice remains unverified. |
| Understanding/receipt | Fixture and live Gemini sample extraction previously passed; correction and ambiguity validation have unit coverage. Unknown date/time/duration remain null. Broader failures and current full receipt interaction need verification. |
| Holding/Home | Local SQLite, persistence across restart, completion and deterministic NOW/NEXT ranking previously passed. Home has one NOW and at most two NEXT, explanation and central orb above bottom capture. |
| Plan/Focus | List/selected-day Calendar and basic Focus previously passed. Saved manual edits, individual deletion and visible/Android Back exits are implemented; full current phone acceptance is pending. |
| Clear list | Implemented in Plan > List with confirmation, scoped notification cancellation and one SQLite deletion transaction. Removes all open items across calendar days; retains completed/archived history. Loaded on the wireless phone; confirmation and Keep my list cancellation passed. Actual bulk removal/persistence remains unverified. |
| Nudges | Gentle future/background delivery, edited-time replacement, 15-minute OS action, 30/60-minute in-app delays, Off/completion cancellation and cold-start body opening passed on OnePlus. Persistent cadence, 30/60-minute OS actions and delete/clear cancellation remain pending. |
| Billing | $4.99 coby_plus_monthly Test Store purchase, restore and Persistent gate verified on OnePlus September 30. Two native Persistent requests verified; full delivery cadence remains open. |
| Quality/harness | Typecheck/lint and 62 tests pass. Fixture parser, SystemClock/DemoClock and Lab controls exist; the complete demo path remains to rehearse. |
| Repository/assets | README/setup and license exist; orb and icon assets exist. Final asset review, fresh screenshot and final demo recording remain. |

## Remaining P0, in working order

1. Verify saved editing, Focus exits, individual deletion and Clear list/cancel/persistence without destroying real held items during agent tests.
2. Finish real phone notification acceptance: a future deadline with Gentle enabled, background delivery, edited time replacing the old schedule, and no future reminder after completion/deletion/clearing. Verify Persistent cadence and its entitlement gate.
3. Reminder setup is visible per Plan item and in the check-in screen. New items start with no commitment; the user chooses Gentle or Persistent. Undated/date-only items do not receive an invented notification time. Complete the remaining cancellation/cadence checks.
4. Complete the companion experience across Plan, receipt, Focus and paywall: consistent typography/spacing, clear action feedback, responsive controls, polished state transitions, accessible keyboard/navigation and useful empty/error states. Basic listening/thinking/settled orb response is P0. The user's subjective visual approval is still required.
5. Verify RevenueCat restore and free/Plus behavior, parsing uncertainty/failure, interrupted sessions, offline text fallback and restart reliability. Preserve the already passed capture checks through subsequent changes.
6. Freeze features after P0 acceptance. Rehearse the deterministic demo, record the final video, replace stale screenshots, review icon/README/license and confirm submission requirements. A public distributed build must not embed the development Gemini secret or use a RevenueCat Test Store key as production billing.

## P1 — only after P0 is stable

- Locked commitment with rescue code: voluntary friction, not OS-level blocking.
- Dark mode.
- Richer orb motion and haptics beyond P0's basic responsive states.
- Natural-language corrections, such as “move that to tomorrow at five.” Manual field editing is P0.

Notifications, basic orb responsiveness, keyboard fixes, editing, deletion, clearing, navigation and cohesive premium design are P0. Google login, calendar/Gmail sync, cloud sync, feeds, projects/tags, habits/streaks, app blocking and autonomous agents remain outside the submission scope; they are not promised P1 features.


## Latest implementation checkpoint

October 1 readability/recovery update installed on OnePlus from successful native build 36792872254. Icons and larger labels render; prior-day tasks stay held in Earlier outside NOW/NEXT. Native date/time selection/cancellation, persisted date-only clearing, live receipt review blocking/error scrolling/checkbox acceptance and Home NEXT edit/Back passed. A caught Plan return-view bug is corrected and phone verified. Latest bundle runs on localhost:8083. Typecheck/lint/62 tests pass. Only Coby nudge test was changed and removed; real-item digests unchanged.

Prior Gentle delivery/delays/cold-start routing/cancellation, Focus exits, Test Store purchase/restore, Persistent scheduling and synthetic deletion remain verified. Active-Plus display is installed. Final user readability, multi-item receipt location, Home Save return and capture regression still need confirmation. Isolated bulk clear, OS 30/60-minute actions, full Persistent delivery, launcher/splash assets, fresh screenshot/demo and final approval remain. P0 is not complete.
