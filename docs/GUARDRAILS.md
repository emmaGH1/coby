# Guardrails

1. Product scope follows `PRODUCT.md`; P0 takes precedence over polish and P1.
2. No invented due dates, durations, priorities, reminders, or personal facts. Unknown means null. Ambiguity that changes meaning gets a clarification flag.
3. Gemini performs structured extraction only. Ranking, focus, calendar grouping, notification times, and commitment rules are deterministic local code.
4. Maintain an offline fixture parser and deterministic DemoClock path. A network failure cannot erase locally held items.
5. Keep the source phrase and show a receipt before acceptance. Let users inspect all held items in Plan.
6. Never put Gemini keys or private user data in git. `.env.example` contains names and placeholders only. Treat mobile embedded keys as development-only; a distributed build needs a proxy.
7. Local notifications must be cancelable, tied to item state, frequency-capped, and shame-free. Completed or archived items get no future nudges.
8. RevenueCat Test Store controls Plus entitlement. Free brain dump, NOW, Plan, and Gentle remain useful. Never claim a purchase works until tested in a development build.
9. Locked mode, if built later, is friction only. Never imply OS-level blocking or unbreakable lockout.
10. Avoid medical treatment claims and diagnosis language.
11. Prefer reversible local changes. Record native/device, key, account, and GitHub blockers precisely; continue unrelated work.
12. At checkpoint: verify, update TEST_MATRIX and HANDOVER, record decisions, commit. Report what was actually tested and what remains unverified.
