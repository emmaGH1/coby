# Coby product film — production brief v2

Status: approved plan. The human performs all phone capture; the agent plans, edits in HyperFrames, and reviews. The agent never operates the phone, publishes, or submits.
Deadline: October 1, 2026, 20:00 Lagos (noon PDT). Event: RevenueCat Shipaton 2026, Next Gen.
Read first: AGENTS.md, docs/PRODUCT.md, docs/GUARDRAILS.md, docs/DEMO_REVIEW.md, docs/SUBMISSION.md. Canon wins over this brief.

## 1. Goal

One judged master, 110–115 s (hard limit < 120 s), 1920×1080, 30 fps, H.264/AAC, public on YouTube/Vimeo.
Devpost requires the app shown on its target device: all app footage is real Android screen recording. Never rebuild app UI in HyperFrames.
Arc: recognition → handover → trust → action (with Plus) → relief.
No social cut before submission.

The old 95 s draft, its Kokoro `am_adam` narration and footage failed review (DEMO_REVIEW.md) and must not be reused. The Rhodes bed may be auditioned, not assumed.

## 2. Viewer must understand

1. Unload thoughts by voice.
2. Inspect/correct the receipt; unspecified timing stays unset.
3. One NOW, at most two NEXT, with an inspectable reason.
4. RevenueCat powers Coby Plus: Test Store purchase unlocks Persistent reminders on the same task.
5. A real local reminder arrives; postponing moves the reminder, not the deadline.
6. Focus and completion close the loop.

## 3. Claims

Allowed: Android speech recognition; Gemini extracts structure only; ranking, focus and reminders are local deterministic rules; Gentle is free; Persistent is Plus; RevenueCat Test Store purchase.
Forbidden: Whisper, universal offline speech, calendar sync, autonomous actions, ADHD treatment, perfect/zero-error accuracy, "zero friction", production billing, restore (not shown), Coby making the call.
Brand: lowercase "coby". Lines: "Unload your mind." / "Out of your head. Into good hands."

## 4. Synthetic story

Dump (exact words; insert the clock time at T+45 min, where T is when Hold is pressed):

"Finish the database assignment tomorrow, call Daniel at [TIME] for five minutes, and buy data."

- Assignment: date only, no time (must show as unset).
- Call Daniel: hero. Explicit time + 5 min. Auto-Gentle on Hold.
- Buy data: no timing.

Hero stays open until completion. No private data anywhere.

Reminder timing (src/domain/nudges.ts, deadline D, duration 5 min): first reminder at D − 35 min (≈ T+10); 15-minute postpone → snoozed reminder ≈ T+25; Persistent "latest" reminder at D − 5 min (≈ T+40). Complete before T+40.

## 5. Capture (human, Guest user on OnePlus A6010)

Setup: Settings → System → Multiple users → Guest. Coby is installed there and unused. Grant mic + notifications; load dev build; DND with Coby allowed; one throwaway smoke test (dump → Hold → paywall opens → delete).

Voice: TTS plays the dump into the phone mic (phone 5–10 cm from the speaker, or a wired earbud mic held against it). Room noise does not matter for the film because screen recording has no audio; the clean TTS file is laid over in the edit. If recognition fails twice, type the dump and label "typed for this take". Never show the mic UI over typed text.

Log the clock time of every tap.

| Take | Action | When |
| --- | --- | --- |
| A | Clean Home + companion, ~8 s | any |
| B | Speak → TTS → live transcript → Stop → Understand → receipt (show unset field, Gentle default note) → Hold → Home | T |
| C | NOW → Why this now? → Persistent · Plus → Test Store paywall → purchase → "Persistent reminders on" | right after B |
| D | Plan List: same three items | right after C |
| E | Leave Coby. Notification "This is a good time to start." → tap 15 min → postponement shown | ≈ T+10 |
| F | "Checking in, as you asked." → tap body → check-in → Focus → Done → Completed history | ≈ T+25, before T+40 |

Each take ≤ 180 s if using adb screenrecord. Check for unrelated notifications before using any frame. Switch back to Owner when done.

## 6. Storyboard (~112 s)

| Time | Scene | Footage | Narration (TTS narrator) |
| --- | --- | --- | --- |
| 0–8 | Recognition → handover | A + typography fragments of the dump gathering toward phone; reveal to "Unload your mind." | "Your head is full. Organizing it becomes another job. This is coby." |
| 8–33 | Capture | B, user-voice TTS over it; processing wait may be cut with label | "Just say it." (then silence for the user voice) |
| 33–47 | Trust | B receipt; reframe on explicit time, then unset field; Hold | "Check what coby understood. The time you gave stays. What you didn't say stays unset." |
| 47–57 | One thing now | C: NOW + reason held readable | "One thing now, with a reason you can see." |
| 57–78 | Plus (RevenueCat) | C: Persistent gate → Test Store purchase → Persistent on | "Gentle reminders are free. For things that can't slip, coby Plus — powered by RevenueCat — adds Persistent follow-through." |
| 78–84 | Held | D | "Everything else is held in Plan." |
| 84–104 | Return | E → "15 minutes later" card → F | "Later, coby reaches out. Need fifteen minutes? The reminder moves; the deadline doesn't. Then focus, and done." |
| 104–112 | Close | Companion + coby | "coby. Unload your mind." |

If over time, cut in this order: Plan, opening fragments, second reframe in receipt. Never cut the purchase, nudge, or Done. Rewrite any line whose action is missing from the footage.

## 7. Disclosures (small, on screen)

"Synthetic data" (opening) · "Waits shortened" on time-jump cards · "RevenueCat Test Store — test purchase" during Plus · "typed for this take" only if used · processing-cut label if used.

## 8. Visual and motion

Palette #F2F2F2, #FFFFFF, #1A1A1A, #2268CD, #EAF2FF + approved companion colors. Manrope (local). Display 96–120 px, captions 48–56 px at 1080p.
Real footage is the focal point; crop close for reading, whole device only for context. No repeated phone-plus-text-card layout, no neon/glass/particles/gradient text.
Motion: gather → reveal → settle → return. Connective 0.35–0.7 s, reframes 0.7–1.2 s, still while text is read. Max three signature moments: handover, receipt match, notification return. Never add taps not performed or alter app state.

## 9. Audio

Two distinct TTS voices: "user" (the dump) and narrator. Kokoro or HyperFrames tts is the default; a clone is allowed only of the founder's own voice. Warm instrumental bed; motif at handover returns at the notification and resolves at Done. No whoosh spam. Separate voice/music/fx tracks. Target ≈ -14 LUFS integrated, ≤ -1 dBTP — report only measured values.

## 10. HyperFrames project

Separate git-ignored folder `film/`; footage and renders never committed. Follow the hyperframes skills; one caption track; burned captions + SRT. Use registry primitives before hand-building effects.

## 11. Acceptance

Truth: every narrated action visible; same three items throughout; no completed task nudged; disclosures present; no private data/unrelated apps.
Craft: product visible within 5 s; app text readable at phone size; muted viewing still tells the story.
Technical: ffprobe duration < 120 s, 1920×1080, audio present, no blank/broken frames.
Final approval and upload are human-only.

## 12. Timeline (Lagos)

Takes done 12:30 · rough cut 15:00 · picture lock 17:30 · human approval 18:30 · upload + submit 19:30.

## 13. Deliver

film/out/coby_judges_master.mp4 · SRT · short claim/disclosure + asset-license note. Update docs/HANDOVER.md and docs/DEMO_REVIEW.md after approval.
