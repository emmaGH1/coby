# Coby product canon

## Locked thesis

Coby is a calm, voice-first companion for people carrying too much in their heads. Users dump thoughts naturally; Coby understands and quietly holds them, organizes them, surfaces only what deserves attention now, and proactively intervenes before important things slip. Everything remains inspectable on demand, but the user rarely needs to manage it.

**Brand:** `coby`. **Arrival copy:** **Unload your mind.** The user retired “carry less.” from the Home header and arrival on September 30.
**Supporting copy:** Out of your head. Into good hands.  
**UX principle:** minimal by default, transparent on demand.  
**Core loop:** Dump → Understand → Hold → Surface → Act.

## Platform

Android-first for P0 and the hackathon submission. Optimize and verify the experience on the Pixel 6 phone class and Android 16 / API 36 baseline. Keep component boundaries portable, but do not add iPhone-specific P0 scope before the Android path is reliable.

Coby optimizes for reduced cognitive load and trust, not maximum information density. Coby is **not** a general-purpose task manager, chatbot, AI planner, calendar replacement, medical ADHD treatment, productivity dashboard, or autonomous agent. Do not imply that Coby treats ADHD.

## P0: required before submission

| Surface | Required behavior |
| --- | --- |
| Arrival | Warm branded entry with an immediate path into the app. |
| Capture | Native/device voice input and reliable text fallback. Editable transcript before understanding. |
| Understand | Structured extraction of tasks, events, and reminders. Unknown dates and durations stay null. |
| Receipt | Calm confirmation of every extracted item; user can correct errors before saving. Native date/time selection with optional manual entry. Invalid submission identifies and scrolls to the affected item; uncertainty has an explicit review checkbox. |
| Hold | Local persistence survives app restart. |
| Home | Exactly one NOW item when available and at most two NEXT items. Prior-day unfinished items stay saved in Earlier review, outside NOW/NEXT. Tap NOW/NEXT to edit directly. A clear state when none exists. |
| Plan | All held items inspectable in List and seven-day Calendar views, with previous/next week inspection and a quiet Completed history view with restoration. Saved items expose Edit details for title, kind, date, time, and duration corrections, plus individual deletion and confirmed Clear list with reminder cancellation. |
| Focus | One item at a time, with completion and a clear exit. Back returns to the originating Home/Plan without completing the item; Android Back does the same. |
| Rank | Deterministic priority with a truthful “Why this now?” explanation. |
| Nudge | Deadline-aware local notifications; recalculate when relevant fields change. Notification buttons postpone the reminder by 15 minutes, 30 minutes or one hour without moving the task deadline. Tapping the notification opens a calm check-in with Focus, completion and correction controls. |
| Commitment | Gentle and Persistent modes. Persistent is a Plus entitlement. |
| Billing | RevenueCat Test Store, `coby_plus` entitlement, monthly product and working purchase/restore path. |
| Experience | Cohesive premium Coby visual system and deterministic demo path. |

Free includes brain dump, NOW/NEXT, Plan, and Gentle nudges. Plus unlocks Persistent and, later, Locked. Never paywall the basic relief loop.

October 1 approved reminder default: confirming a new item with an explicit future date/time enables Gentle automatically. Unknown, date-only and past timing get no invented reminder. The receipt explains the default; Plan allows Off/Gentle/Persistent. Notification denial or scheduling failure must report that the item is saved, rather than prompting duplicate capture.

## P1 only after P0 is stable

Locked commitment with a rescue code; dark mode; richer orb motion and haptics; natural-language task corrections. Locked is behavioral friction, not device security.

## Explicitly out of scope before submission

Google login, Google Calendar or Gmail sync, cloud sync, social feeds, projects, tags, habits or streaks, app blocking, autonomous LLM agents, full month-calendar implementation, and a complex task-management editor.

## Trust rules

- Never invent a user's life details. Preserve original input alongside parsed items.
- A receipt makes interpretation visible before the app holds it.
- NOW is explainable; Plan reveals everything on demand.
- Nudges are useful and humane, never shaming or incessant.
- If interpretation is uncertain, ask for correction or leave fields unknown.
