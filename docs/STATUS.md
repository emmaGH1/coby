# Coby progress — October 1, 2026

## P0 closeout

P0 acceptance remains open; no P1 work has started. Core capture, receipt, persistence, saved controls, prioritization and RevenueCat Test Store have physical evidence. Current source also includes the false-silence warning correction, bounded parser recovery and automatic free Gentle for new exact-time future items, approved by the user. These latest changes still need a safe phone reload.

Deadline: October 1 at noon PDT / 8:00 PM Lagos, confirmed at https://revenuecat-shipaton-2026.devpost.com/.

## Verified

| Area | Evidence and limits |
| --- | --- |
| Capture | User accepted keyboard-visible typing and minute-long paused voice on OnePlus A6010. Other devices/offline recognition are not universally verified. False empty-speech warning fixed in source with regression coverage; physical confirmation pending. |
| Receipt/local holding | Fixture/live Gemini extraction previously passed on phone. Native run 36831455328 verifies exact three-item input, offscreen invalid-card jump/correction, Hold and restart. Unknown timing remains null. |
| Home/Plan/Focus | One NOW/max two NEXT, Earlier recovery, saved editing, native date/time pickers and Focus exits have phone evidence. Full isolated UI flow verifies Focus completion, List/Calendar, confirmed Clear list and retained completed history after cold restart. |
| Nudges | Gentle background delivery, edited replacement, cold-start body opening, 15-minute OS action and 30/60-minute in-app delays passed on phone. Isolated native run 36824997183 verifies both Persistent deliveries across their real 30-minute gap and bulk cancellation/history/restart. Actual OS 30/60-minute buttons remain in the final running check. |
| Billing | $4.99 coby_plus_monthly Test Store purchase, restore and Persistent gate verified on OnePlus. Test Store is development integration, not production subscriptions. |
| Quality | Typecheck, lint and 68 tests pass. Fixture/Gemini parsers, SystemClock/DemoClock and Lab controls exist. Parser timeout/retry and manual retention have regression tests. |
| Brand/build | Approved C launcher/adaptive layers/native splash exported; branded Android build passed. Actual 1179×2556 screenshot inspected/committed. Public fixture APK contains bundled JavaScript and no development Gemini key; it is an offline sample, not configured live AI/billing. |
| Repository | Product/design/guardrails/handover/test/demo/decision docs, README/setup, license and environment template exist. Private demo footage stays ignored. |

## Remaining P0 acceptance

1. Inspect final isolated run 36832129592: actual Android 30/60-minute notification actions and explicit failed-parser recovery through receipt/save/restart.
2. After saved/Home readiness, load the update safely and confirm that valid captured speech no longer produces the empty-speech warning. Check automatic Gentle and permission-denial recovery without modifying real tasks.
3. Correct the supplied demo's private footage and inaccurate speech/SDK/event/Focus claims; review the full rendered result and obtain final subjective approval. See DEMO_REVIEW.md. Another agent is preparing the demo under user direction.
4. Freeze features, finalize the truthful submission package and reserve time for the user's final public upload/Devpost submission. Next Gen can use source plus a running-device demo. Public live-AI distribution requires a secured endpoint and is not claimed delivered.

Native run 36831455328 closes the multi-item offscreen receipt case on Android 16. Earlier one-card screenshots do not establish that case. No real phone task was edited, completed, deleted, cleared or reseeded during this closeout.

## While the user rests

Agent: independent fixes, isolated checks, assets, build preparation, documentation and demo review. Protect unsaved input; do not reload until saved/Home readiness. Human when awake: short voice confirmation, final visuals/demo approval and submission/account actions.

## P1 — only after P0 is stable

- Voluntary Locked commitment with rescue code, not OS blocking.
- Dark mode.
- Richer companion motion and optional haptics.
- Natural-language task corrections; manual editing is already P0.

Nudges, basic responsive motion, keyboard visibility, edits, deletion, clearing, navigation and cohesive design are P0. Google login, Calendar/Gmail sync, cloud sync, feeds, projects/tags, habits/streaks, app blocking and autonomous agents remain outside submission scope. No P2 scope has been agreed.
