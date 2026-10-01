# Coby product film — production brief v3

Status: reviewed and approved for production planning on October 1. Final recording waits for the app's UI freeze and human capture readiness; approval of this plan is not approval of a rendered film. The human performs all film capture; the film agent plans, edits in HyperFrames, and reviews. The film agent never operates the phone, publishes, or submits.
Capture gate update: the latest OnePlus update is loaded; the human accepted the silence-warning fix and approved Home/Plan visuals. Runtime source 2242fd0 is frozen. App acceptance permits human capture when ready; final film approval and the successful purchase-and-Save take remain required.
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

Dump (exact words; choose a fixed explicit deadline D roughly 45–50 minutes ahead before recording, including AM/PM or a 24-hour clock time; record the actual Hold time T):

"Finish the database assignment tomorrow, call Daniel at [TIME] for five minutes, and buy data."

- Assignment: date only, no time (must show as unset).
- Call Daniel: hero. Explicit time + 5 min. Auto-Gentle on Hold.
- Buy data: no timing.

Hero stays open until completion. No private data anywhere.

Reminder timing (src/domain/nudges.ts, deadline D, duration 5 min): the initial Persistent schedule has a first reminder at D − 35 min and a latest reminder at D − 5 min. If D = T+45 min, these are approximately T+10 and T+40. Use the actual captured deadline and tap times to calculate the waits; do not assume Hold happened at the planned time.

A 15-minute postpone cancels/replaces the pending schedule with one snoozed reminder 15 minutes after that tap. The original latest reminder is therefore not left pending. The task deadline D remains unchanged. Complete after the snoozed reminder, without changing mode or timing between takes.

## 5. Capture (human, Guest user on OnePlus A6010)

Setup: the human checks Settings → System → Multiple users → Guest, confirms this is an isolated profile and that Coby is installed and usable there, then grants mic + notifications and allows Coby through DND. Do not assume Guest availability or app installation; if unavailable, use a separately agreed synthetic test installation, never clear Owner's real data. Verify Plus is initially inactive for the purchase take. Run one throwaway smoke test (dump → Hold → paywall opens, without buying → delete).

Before final capture, the app session must confirm that the latest voice-warning/recovery/automatic-Gentle update is loaded, targeted phone acceptance has passed and the polished interface is frozen. Record the build/commit and final visible labels. The demo session may prepare narration, music, composition and capture instructions immediately; it must not reload, build, alter or operate the app/phone. Reserve the phone with the human for capture so another session is not testing it simultaneously.

Voice: TTS plays the dump into the phone mic (phone 5–10 cm from the speaker, or a wired earbud mic held against it). Use a quiet room and test the level: noise still affects recognition even when the recording's audio is discarded. Lay the same spoken sample over the corresponding capture in the edit; never imply different words were recognized. If recognition fails twice, type the dump and label "typed for this take". Never show the mic UI over typed text.

Log the clock time of every tap.

| Take | Action | When |
| --- | --- | --- |
| A | Clean Home + companion, ~8 s | any |
| B | Speak → TTS → live transcript → Stop → Understand → receipt (show unset field, Gentle default note) → Hold → Home | T |
| C | NOW → Why this now? → edit hero item → Reminder/Persistent · Plus → Test Store paywall → purchase → verify and save Persistent for the same item | right after B |
| D | Plan List: same three items | right after C |
| E | Leave Coby. Notification "This is a good time to start." → tap 15 min → postponement shown | ≈ T+10 |
| F | "Checking in, as you asked." → tap body → check-in → Start focus → Complete → Completed history | 15 min after E's actual delay tap |

Take C's editor is implemented. Native flow 36852963130 verifies staged reminder Save/Cancel, paywall draft preservation and Back; it does not prove a new successful purchase in this editor. Use the frozen app's actual labels: select Persistent · Plus, finish the Test Store purchase, return to the draft and tap Save changes. Confirm the hero's saved reminder is Persistent before waiting for E. Never reconstruct missing controls. Each take ≤ 180 s if the human uses adb screenrecord. Check for unrelated notifications before using any frame. Switch back to Owner when done.

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

Official Devpost requirements rechecked October 1: target-device footage, up to two minutes, publicly visible YouTube/Vimeo upload, and permission for third-party music/material. Source: https://revenuecat-shipaton-2026.devpost.com/. Check eligibility and judge access separately in docs/SUBMISSION.md.

## 12. Timeline (Lagos)

Takes done 12:30 · rough cut 15:00 · picture lock 17:30 · human approval 18:30 · upload + submit 19:30.

## 13. Parallel ownership and deliverables

The demo session owns only `film/` and its own `film/HANDOVER.md`, containing one NEXT ACTION. Root app source, dependency files, environment files, capture/test scripts and shared docs/HANDOVER.md remain owned by the app session. Read shared docs without editing them; give review notes back to the human for coordination. No agent-to-agent messaging or publication without human authorization.

Start the storyboard, narration draft, audio audition and edit scaffolding now. Use labelled placeholders until the human supplies approved post-freeze takes A–F; do not export placeholders as the final demo. If the UI freeze slips, update the capture schedule with the human and retain the upload/submission buffer.

Deliver `film/out/coby_judges_master.mp4`, SRT, a short claim/disclosure and asset-license note, a measured technical report, and the reviewable preview. The app session updates shared HANDOVER/DEMO_REVIEW only after the human approves the complete rendered film.

## 14. Review outcome — October 1

Approved story, duration, truthful claims, real-device footage, human capture boundary and visual/audio direction. Corrected postponement semantics, fixed-deadline capture timing, startup/build readiness, final-label dependence, noisy-room advice and parallel file ownership against current source. The storyboard does not require a Focus countdown, restore demonstration or any new feature. Final film approval remains pending actual footage, measured output and complete human review.
