# Coby design system

## Direction

Premium calm companion: a quiet room with a soft, recognizable presence. Use whitespace, strong hierarchy, large readable typography, and soft controls. Original design inspired by calm principles, not another app's pixels. Keep one primary attention target per screen.

## Foundation tokens

| Token | Initial value | Role |
| --- | --- | --- |
| background | `#F5F1E9` | Warm paper canvas |
| raised | `#FCFAF5` | Capture and high-trust surfaces |
| ink | `#191816` | Primary text and dark surfaces |
| muted | `#6F6A64` | Secondary text |
| hairline | `#DDD6CC` | Quiet structure |
| violet | `#705BB6` | Active companion state |
| violetDeep | `#55428F` | Accessible accent text |
| violetSoft | `#E8E1F5` | Quiet accent background |
| amber | `#B98542` | Restrained caution |
| coral | `#BD6F65` | Restrained error |
| radiusSmall | `14` | Minor controls |
| radiusMedium | `20` | Buttons and rows |
| radiusLarge | `28` | Major surfaces |
| radiusPill | `999` | Pills and orb controls |

Functional type: Manrope. Use large titles and generous line-height. Build with tokens so dark mode can be added later; polish light mode first. Meet usable touch-target sizes and readable contrast.

## Home composition

Home is the relief loop in one surface. The user should understand within seconds that they can speak or type without first navigating elsewhere.

- Empty state: large central pearlescent violet orb and the brand promise, with generous whitespace.
- Returning state: centered smaller orb, exactly one NOW and at most two NEXT in the scrollable content above capture.
- Capture is a persistent bottom dock with an immediately visible text placeholder, Speak/Done, and a send action. It grows for editable transcript/text; the Android keyboard resizes the content above it.
- NOW remains one large obligation with a truthful explanation and focus/completion controls. Plan reveals the rest.
- Use one quiet capture surface; obligations stay directly on paper.
- The user's September 30 reference supersedes the earlier composer-above-NOW composition. This is P0 capture/visual recovery, not scope expansion.

## Screens

- Arrival: lowercase wordmark, orb, “carry less.” and one obvious entry action.
- Capture: orb as primary input, live/entered transcript, “Type instead,” and one Understand action.
- Receipt: “I've got it,” item count, compact rows with due/duration only when known, easy correction, “Looks right.”
- Home: exactly one NOW, up to two NEXT, a small “Why this now?” affordance, persistent capture entry. Empty: “You're clear for now.”
- Plan: List/Calendar toggle and selected-day items. Inspection should feel safe, not administrative.
- Focus: only the chosen item, time/progress, Complete and End focus. Hide tabs and other obligations.

## Orb

Four states: idle (slow breath), listening (responsive), thinking (gentle pulse), settled (quiet breath). Use the transparent generated pearlescent sphere in assets/coby-orb.png. Listening responds to native microphone volume in addition to a slow breath; thinking gently turns. Motion is not proof of transcription. Its presence should reassure without becoming a cartoon. Respect reduced-motion preferences. Motion must not obstruct the task.

## Avoid

Glassmorphism, neon, generic AI dashboards, constant gradients, rainbow categories, unnecessary nested cards, dense controls, guilt language, and animation that asks for attention when the user needs focus.

## Saved details and Focus exit

Each Plan row in List and Calendar offers Edit details beside the existing Focus action. Details open only on request, with date/time/duration immediately visible and an explicit Save changes/Cancel pair. Reuse the receipt's quiet styling and validation. Focus has a visible Back to Plan/Home control above the orb; Android Back exits through the same path. Reset scroll on screen changes so the exit control is reachable.

Android typing must keep the text field, cursor and send action above the software keyboard. The bottom dock remains anchored to the usable viewport while the content above scrolls. Saved-item editing includes a quiet Delete item action after Save changes, with an explicit confirmation; deletion controls do not add clutter to Home.
