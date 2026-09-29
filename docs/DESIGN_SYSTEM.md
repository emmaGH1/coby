# Coby design system

## Direction

Premium calm companion: a quiet room with a soft, recognizable presence. Use whitespace, strong hierarchy, large readable typography, and soft controls. Original design inspired by calm principles, not another app's pixels. Keep one primary attention target per screen.

## Foundation tokens

| Token | Initial value | Role |
| --- | --- | --- |
| background | `#F7F6F2` | Warm off-white canvas |
| ink | `#1A1A19` | Primary text and dark surfaces |
| violet | `#7464B5` | Single accent family; refine visually |
| violetSoft | `#E9E4F6` | Quiet accent background |
| amber | `#B98542` | Restrained caution |
| coral | `#BD6F65` | Restrained error |
| radiusSmall | `14` | Minor controls |
| radiusMedium | `20` | Buttons and rows |
| radiusLarge | `28` | Major surfaces |
| radiusPill | `999` | Pills and orb controls |

Functional type: Manrope or a similarly legible sans-serif. Use large titles and generous line-height. Build with tokens so dark mode can be added later; polish light mode first. Meet usable touch-target sizes and readable contrast.

## Screens

- Arrival: lowercase wordmark, orb, “carry less.” and one obvious entry action.
- Capture: orb as primary input, live/entered transcript, “Type instead,” and one Understand action.
- Receipt: “I've got it,” item count, compact rows with due/duration only when known, easy correction, “Looks right.”
- Home: exactly one NOW, up to two NEXT, a small “Why this now?” affordance, persistent capture entry. Empty: “You're clear for now.”
- Plan: List/Calendar toggle and selected-day items. Inspection should feel safe, not administrative.
- Focus: only the chosen item, time/progress, Complete and End focus. Hide tabs and other obligations.

## Orb

Four states: idle (slow breath), listening (responsive), thinking (gentle pulse), settled (small compression). Its presence should reassure without becoming a cartoon. Respect reduced-motion preferences. Motion must not obstruct the task.

## Avoid

Glassmorphism, neon, generic AI dashboards, constant gradients, rainbow categories, unnecessary nested cards, dense controls, guilt language, and animation that asks for attention when the user needs focus.
