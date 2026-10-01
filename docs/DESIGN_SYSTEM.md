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
| error | `#9A4742` | Functional error text/borders |
| radiusSmall | `14` | Inputs and validation summaries |
| radiusMedium | `20` | Cards and capture surface |
| radiusLarge | `28` | Reserved large surfaces |
| radiusPill | `999` | Pills and orb controls |

Functional type: Manrope. Use large titles and generous line-height. Build with tokens so dark mode can be added later; polish light mode first. Meet usable touch-target sizes and readable contrast.

October 1 correction: secondary/action labels use at least 14 points; Plan titles/main controls use 16. Preserve larger display titles and system font scaling. Explicitly load Ionicons for recognizable Home, Plan/calendar, gear, pencil and trash. Navigation includes icons and labels; edit/delete targets are 48×48.

Prior-day unfinished items stay saved in Plan's Earlier view and a quiet Home review link. Same-day overdue work retains its explanation. Refresh through Clock every minute and on foreground. Tapping NOW/NEXT opens details and Cancel/Save returns Home.

Receipt defaults to native date/time dialogs with manual entry/clear on demand. Picker previews/dismissal never invent timing. Blocked saves identify and highlight invalid items, announce and scroll to the first, and repeat a review link near Save. Uncertainty uses a visible review checkbox.

## Home composition

Home is the relief loop in one surface. The user should understand within seconds that they can speak or type without first navigating elsewhere.

- Empty state: large central blue/pink/off-white Soft Fold companion and the brand promise, with generous whitespace.
- Returning state: centered 96-point companion, exactly one NOW and at most two NEXT in the scrollable content above capture. Long content and larger system text may require scrolling; never shrink type to force all three items onto one screen.
- Capture is a persistent bottom dock with an immediately visible text placeholder, Speak/Stop, and a send action. It grows for editable transcript/text; the Android keyboard resizes the content above it.
- NOW remains one large obligation with a truthful explanation and focus/completion controls. Plan reveals the rest.
- Use one quiet capture surface; obligations stay directly on paper.
- The user's September 30 reference supersedes the earlier composer-above-NOW composition. This is P0 capture/visual recovery, not scope expansion.

## Screens

- Arrival: Soft Fold companion above lowercase coby and “Unload your mind.” Loading ends as soon as the app is ready; no artificial delay.
- Capture: persistent bottom text/voice composer, live/entered transcript, and one send action. Placeholder: “What’s on your mind? Messy is fine.”
- Receipt: “I’ve got N things.”, compact cards with readable dates/duration only when known, easy correction, “Looks right. Hold it.” Item numbers appear when review is needed; accessible field labels remain stable.
- Home: exactly one NOW, up to two NEXT, a small “Why this now?” affordance, persistent capture entry. Empty: “Out of your head. / Into good hands.” Returning: “Everything else is safe in Plan.”
- Plan: List/Calendar toggle and selected-day items. Inspection should feel safe, not administrative.
- Focus: only the chosen item, known due time and actual session elapsed minutes from Clock, Complete and End focus. This is not a countdown timer. Hide tabs and other obligations.

## Companion

Four states: idle (slow breath), listening (responsive), thinking (gentle pulse), settled (quiet breath). Use the approved generated Soft Fold in assets/coby-companion.png. The circular C icon remains the launcher direction; launcher asset replacement is pending. Listening responds to native microphone volume in addition to a slow breath; thinking gently turns. Motion is not proof of transcription. Its presence should reassure without becoming a cartoon. Respect reduced-motion preferences. Motion must not obstruct the task.

## Avoid

Glassmorphism, neon, generic AI dashboards, constant gradients, rainbow categories, unnecessary nested cards, dense controls, guilt language, and animation that asks for attention when the user needs focus.

## Saved details and Focus exit

Each Plan row in List and Calendar has a completion ring, tappable title for editing, confirmed trash deletion, and a single Focus link for unfinished items. Home keeps its pencil beside the tappable title. Details open only on request, with date/time/duration and Reminder choices visible. Save changes applies the draft together; Cancel leaves saved details and reminders untouched. Reuse receipt validation. Focus has a visible Back to Plan/Home/check-in control above the companion; Android Back exits through the same path.

Android typing must keep the text field, cursor and send action above the software keyboard. The bottom dock remains anchored to the usable viewport while the content above scrolls. Saved-item editing includes a quiet Delete item action after Save changes, with an explicit confirmation; deletion controls do not add clutter to Home.


## Latest approved controls

Home puts coby at the left and Settings at the right, with no tagline beneath the name. Separate the ready status from the task divider with breathing room. Hide NOW/NEXT during listening and show a large circular Stop control while keeping the transcript visible. Keep the accepted Android keyboard resize and native voice session unchanged.

Plan shows exactly seven days at a time, with only the selected date number inside a blue circle and a small dot under dates with held items. Previous/next Ionicons chevrons use 48-point targets; the month label is 16 points. Today keeps recent and future items accessible; a month grid remains outside P0. Completed items remain inspectable and restorable. Hide Earlier when empty. Clear list is a quiet trash action below the held list, with confirmation. Home/Plan bottom navigation owns screen changes; no duplicate Home link in Plan.

Nudges use humane system notifications and a calm fixed-language check-in, not an LLM chat. Quick delays are 15/30/60 minutes; the deadline remains unchanged. Custom reminder time is deferred until the quick flow is verified. Task completion history belongs in P0; a conversation archive/journal is not implemented. Streaks remain outside submission scope.

## October 1 P0 polish

Use **Reminder** consistently, with **Off**, **Gentle** and **Persistent · Plus**. Reminder choices live inside saved-item editing and require an explicit date and time. Changing them stages a draft; Save commits and synchronizes reminders. Clearing the time disables reminders on Save. A paywall detour preserves the draft, returns to the requesting editor and stages Persistent after successful purchase/restore; the user still saves the item. Settings shows actual notification permission on entry and foreground return.

The notification check-in prioritizes item/title and known due time, then “I’ve done this”, Start focus, delay choices and Change details. Home shows a muted reminder status only, with no reminder controls or Plus upsell. Paywall copy describes one Gentle reminder and at most a second Persistent check-in; postponing replaces pending reminders.

Dates use Today/Tomorrow, a weekday and day/month for the current year, and day/month/year otherwise. Exact times use 12-hour AM/PM. Unknown dates stay absent. The ranking fallback describes creation-order ties within equal priority, without claiming the globally earliest deadline.

Use the shared ActionButton for primary/quiet actions: 52-point minimum, pill shape, 16-point Manrope. Cards use radius 20; inputs use radius 14; discrete actions/segmented controls use pills. Circular dates/rings/voice controls use the pill token; the 6-point review checkbox is a deliberate compact shape exception. Shared BackLink uses an Ionicons chevron plus label and a 48-point target. Retain functional permission/error/review disclosures.
