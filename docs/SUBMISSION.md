# Coby — Next Gen submission preparation

Deadline: October 1, 2026, noon PDT / 20:00 Lagos. Source: https://revenuecat-shipaton-2026.devpost.com/.

## Project title

Coby — Unload your mind.

## Short description

A calm, voice-first companion that turns a messy brain dump into a trustworthy receipt, holds it locally, shows one thing to do now, and reaches out before deadlines slip.

## What it does

Speak or type naturally. Coby extracts tasks, events and reminders, then lets you review and correct the interpretation before saving. Unknown timing stays unset. Home shows one NOW and at most two NEXT items, with an explanation of why the current item matters. Plan reveals the full list, weekly calendar, completed history and unfinished work from earlier days.

Focus keeps one item in view. You can leave without completing it, edit saved details, restore completed items, delete individual items, or confirm clearing the held list. Deadline-aware local notifications open a check-in. Reminder buttons offer 15 minutes, 30 minutes or one hour while retaining the original deadline.

The free relief loop includes capture, NOW/NEXT, Plan and Gentle reminders. RevenueCat Test Store powers the monthly Coby Plus entitlement and purchase/restore flow; Plus unlocks Persistent reminders. Test purchases are explicitly a prototype integration.

## How it is built

Android-first React Native, Expo SDK 57 and TypeScript. SQLite stores accepted items on the device. Native/device speech recognition supplies editable text. Gemini performs structured extraction only; priority, timing, notifications and focus behavior use deterministic local rules. A fixture parser and DemoClock provide a repeatable development path.

The prototype has no account, cloud sync or autonomous AI agent. In live Gemini development mode, the text dump goes to Gemini for extraction. It is a planning companion, not medical treatment. Offline recognition depends on the installed Android speech service/model. A public live-AI APK requires a secured endpoint; the provided offline fixture build contains no Gemini key.

## Repository

https://github.com/emmaGH1/coby — source, assets, setup instructions and MIT license. Check latest README and TEST_MATRIX before describing any verification as complete.

## Attachments to finalize

- 1024×1024 icon: `assets/icon.png` (approved C mark).
- Fresh Android screenshot: `assets/submission/screenshot-home.png`, 1179×2556, without a device frame. Replace only after inspecting the new workflow artifact.
- Public YouTube or Vimeo link to a corrected device demo under two minutes. The existing 95-second draft is not approved; see DEMO_REVIEW.
- Confirm the selected Next Gen category and the required student eligibility evidence in the submission form.
- Give judges reproducible setup for their own development keys and RevenueCat Test Store, or an authorized safe test access route. Never paste private API keys into Devpost.

## Final human steps

Review the final screenshot and complete video, upload the approved video to the chosen public video account, fill the project form, check all links as a logged-out viewer, and submit before the deadline. Final publication/submission is a human approval step. Reserve a buffer rather than starting P1 while these are open.
