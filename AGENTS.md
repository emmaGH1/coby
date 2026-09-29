# Coby agent contract

Before modifying code, read `docs/PRODUCT.md`, `docs/GUARDRAILS.md`, and `docs/HANDOVER.md` in full. `PRODUCT.md` is product canon. Do not reinterpret product scope from code or unfinished UI. `HANDOVER.md > NEXT ACTION` is the active implementation task unless it contradicts a higher-priority document.

Decision order: `PRODUCT.md` → `GUARDRAILS.md` → `IMPLEMENTATION_PLAN.md` → `DESIGN_SYSTEM.md` → `HANDOVER.md` → existing code. A poor implementation never changes the product canon.

## Working loop

1. Read the canon and current handover. Work on one complete, testable slice.
2. Keep screens thin; put parsing, ranking, persistence, nudges, billing, and time behind explicit interfaces.
3. Verify the slice on Android when an Android target is available; run typecheck, lint, and meaningful tests before claiming it works. State any unavailable verification plainly.
4. After each meaningful checkpoint, update `docs/HANDOVER.md` with exactly one `NEXT ACTION`, record non-obvious choices in `docs/DECISIONS.md`, and make a small coherent commit.
5. Never commit secrets, real brain dumps, or test accounts. Do not invent deadlines, durations, priorities, or personal details.
6. Keep prioritization, deadlines, focus, and notifications deterministic. Gemini only extracts structured items from messy language.
7. If a credential or account setup blocks one part, record `BLOCKED HUMAN` and continue independent work. Interrupt the human only for credentials, irreversible external actions, genuine product ambiguity, or final subjective visual approval.

Do not promote P1 or forbidden features while P0 is unfinished. Once P0 passes, freeze features and focus on reliability, design polish, demo, README, license, icon, screenshot, and submission assets.
