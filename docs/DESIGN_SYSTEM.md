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

- Empty or clear state: brand promise followed by an expanded dump composer.
- Returning state: compact composer remains above NOW; it never moves behind a floating button or secondary page.
- Composer: functional orb, direct prompt, editable transcript, Speak/Done control, and one “Let Coby hold it” action.
- NOW: one large obligation with a small truthful explanation and two compact actions.
- NEXT: at most two quiet rows. Plan is the route to everything else.
- Use one raised capture surface. NOW and NEXT remain on the paper canvas rather than becoming a stack of cards.

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
