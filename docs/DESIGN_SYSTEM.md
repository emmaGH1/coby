# Coby design system

## Direction

Premium calm companion: a quiet room with a soft, recognizable presence. Use whitespace, strong hierarchy, large readable typography, and soft controls. Original design inspired by calm principles, not another app's pixels. Keep one primary attention target per screen.

## Foundation tokens

| Token | Approved value | Role |
| --- | --- | --- |
| background | `#F2F2F2` | Off-white canvas |
| raised | `#FFFFFF` | Capture and high-trust surfaces |
| ink | `#1A1A1A` | Primary text and dark surfaces |
| muted | `#62676D` | Secondary text |
| hairline | `#DFE2E6` | Quiet structure |
| violet | `#2268CD` | Readable blue action surface |
| violetDeep | `#2268CD` | Readable blue accent text |
| violetSoft | `#EAF2FF` | Quiet accent background |
| amber | `#B98542` | Restrained caution |
| coral | `#BD6F65` | Restrained error |
| radiusSmall | `14` | Minor controls |
| radiusMedium | `20` | Buttons and rows |
| radiusLarge | `28` | Major surfaces |
| radiusPill | `999` | Pills and orb controls |

Functional type: Manrope. Use large titles and generous line-height. Build with tokens so dark mode can be added later; polish light mode first. Meet usable touch-target sizes and readable contrast.

October 1 correction: secondary/action labels use at least 14 points; Plan titles/main controls use 16. Preserve larger display titles and system font scaling. Explicitly load Ionicons for recognizable Home, Plan/calendar, gear, pencil and trash. Navigation includes icons and labels; edit/delete targets are 48×48.

Prior-day unfinished items stay saved in Plan's Earlier view and a quiet Home review link. Same-day overdue work retains its explanation. Refresh through Clock every minute and on foreground. Tapping NOW/NEXT opens details and Cancel/Save returns Home.

Receipt defaults to native date/time dialogs with manual entry/clear on demand. Picker previews/dismissal never invent timing. Blocked saves identify and highlight invalid items, announce and scroll to the first, and repeat a review link near Save. Uncertainty uses a visible review checkbox.

## Home composition

Home is the relief loop in one surface. The user should understand within seconds that they can speak or type without first navigating elsewhere.

- Empty state: large central blue/pink/off-white Soft Fold companion and the brand promise, with generous whitespace.
- Returning state: centered smaller companion, exactly one NOW and at most two NEXT in the scrollable content above capture.
- Capture is a persistent bottom dock with an immediately visible text placeholder, Speak/Stop, and a send action. It grows for editable transcript/text; the Android keyboard resizes the content above it.
- NOW remains one large obligation with a truthful explanation and focus/completion controls. Plan reveals the rest.
- Use one quiet capture surface; obligations stay directly on paper.
- The user's September 30 reference supersedes the earlier composer-above-NOW composition. This is P0 capture/visual recovery, not scope expansion.

## Screens

- Arrival: Soft Fold companion above lowercase coby and “Unload your mind.” Loading ends as soon as the app is ready; no artificial delay.
- Capture: orb as primary input, live/entered transcript, “Type instead,” and one Understand action.
- Receipt: “I've got it,” item count, compact rows with due/duration only when known, easy correction, “Looks right.”
- Home: exactly one NOW, up to two NEXT, a small “Why this now?” affordance, persistent capture entry. Empty: “You're clear for now.”
- Plan: List/Calendar toggle and selected-day items. Inspection should feel safe, not administrative.
- Focus: only the chosen item, time/progress, Complete and End focus. Hide tabs and other obligations.

## Companion

Four states: idle (slow breath), listening (responsive), thinking (gentle pulse), settled (quiet breath). Use the approved generated Soft Fold in assets/coby-companion.png. The circular C icon remains the launcher direction; launcher asset replacement is pending. Listening responds to native microphone volume in addition to a slow breath; thinking gently turns. Motion is not proof of transcription. Its presence should reassure without becoming a cartoon. Respect reduced-motion preferences. Motion must not obstruct the task.

## Avoid

Glassmorphism, neon, generic AI dashboards, constant gradients, rainbow categories, unnecessary nested cards, dense controls, guilt language, and animation that asks for attention when the user needs focus.

## Saved details and Focus exit

Each Plan row in List and Calendar offers Edit details beside the existing Focus action. Details open only on request, with date/time/duration immediately visible and an explicit Save changes/Cancel pair. Reuse the receipt's quiet styling and validation. Focus has a visible Back to Plan/Home control above the orb; Android Back exits through the same path. Reset scroll on screen changes so the exit control is reachable.

Android typing must keep the text field, cursor and send action above the software keyboard. The bottom dock remains anchored to the usable viewport while the content above scrolls. Saved-item editing includes a quiet Delete item action after Save changes, with an explicit confirmation; deletion controls do not add clutter to Home.


## Latest approved controls

Home puts coby at the left and Settings at the right, with no tagline beneath the name. Separate the ready status from the task divider with breathing room. Hide NOW/NEXT during listening and show a large circular Stop control while keeping the transcript visible. Keep the accepted Android keyboard resize and native voice session unchanged.

Plan shows exactly seven days at a time, with only the selected date number inside a blue circle. Previous/next week navigation and Today keep recent and future items accessible; a month grid remains outside P0. Completed items remain inspectable and restorable. Each row separates completion, details, pencil edit and confirmed trash deletion. Clear list stays beside list controls with confirmation.

Nudges use humane system notifications and a calm fixed-language check-in, not an LLM chat. Quick delays are 15/30/60 minutes; the deadline remains unchanged. Custom reminder time is deferred until the quick flow is verified. Task completion history belongs in P0; a conversation archive/journal is not implemented. Streaks remain outside submission scope.
