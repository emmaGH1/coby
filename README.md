# coby

**Unload your mind.** Out of your head. Into good hands.

Coby is an Android-first, voice-first companion for handing over mental load. It extracts what you said, confirms it, holds it locally, and shows one NOW item. Plan keeps the full set visible whenever you want it. See [PRODUCT.md](docs/PRODUCT.md) for the locked scope.

## Current Android screen

![Coby Home screenshot](assets/submission/screenshot-home.png)

Captured on an Android 16 / API 36 emulator at 1179 × 2556 pixels. The fixture data is synthetic.

## Development setup

1. Install Node.js, Android Studio, Android SDK Platform 36, Android Build-Tools, Platform-Tools, and an Android emulator. Set `ANDROID_HOME` and add `platform-tools` to your Windows `Path`. Follow [Expo’s Android development build setup](https://docs.expo.dev/get-started/set-up-your-environment/?buildEnv=local&device=simulated&mode=development-build&platform=android).
2. Run `npm install` in this folder.
3. Copy `.env.example` to `.env`. Fill only local development keys. Set `EXPO_PUBLIC_COBY_AI_PROVIDER=gemini` to use live extraction; use `fixture` for the deterministic offline demo. Set `EXPO_PUBLIC_COBY_DEMO_MODE=true` only when you want synthetic sample items on an empty installation. The verified fallback model is `gemini-3.5-flash-lite`.
4. Start an Android emulator. Run `npm run android` to create/install the native development build. Subsequent JavaScript changes can use `npm run start`.

Expo Go is insufficient for Coby’s native speech, RevenueCat, SQLite, and notification setup. Never commit `.env`. `EXPO_PUBLIC_` variables are embedded in the app bundle: direct Gemini keys are for local development only. Put Gemini behind a server endpoint before distributing a public APK.

## RevenueCat Test Store

Use a **public Test Store SDK key** in `.env`, not a secret API key. In the RevenueCat dashboard, create entitlement `coby_plus`; attach your Test Store monthly product; place that product in the current offering’s monthly package. Coby’s Plus paywall buys that package, checks `coby_plus`, and supports restore. Test Store purchases require a development build. Do not ship a release build with a Test Store key.

Free: brain dump, NOW/NEXT, Plan, Gentle reminders. Plus: Persistent reminders. Locked is deferred.

## Checks

```text
npm run typecheck
npm run lint
npm test
npm run smoke:gemini   # optional: reads ignored local .env and sends only the sample dump
```

`npx expo export --platform android` confirms JavaScript bundling; it does not verify native behavior. Run the screen and permission checks in [TEST_MATRIX.md](docs/TEST_MATRIX.md) on an emulator or device. Coby Lab appears only in a development build and can seed demo data, clear it, advance a demo clock, trigger a local notification, switch parsers, and show the RevenueCat state.

## Privacy and prototype limits

Accepted items live in SQLite on the device. In Gemini mode, the text dump is sent to Google for structured extraction; fixture mode stays offline. The app has no login, cloud sync, or background AI agent. Date-only phrases stay date-only; Coby does not invent an hour or schedule a timed nudge for them. This prototype is a planning companion, not medical treatment.

Current native run, Test Store purchase, and final screenshot/video status are tracked in [HANDOVER.md](docs/HANDOVER.md). The source is available under [MIT](LICENSE).

## Build variants

- **Local development:** live Gemini with your own ignored development key, native/device voice, and RevenueCat Test Store. This is the fully integrated prototype verified on the OnePlus A6010. Do not publish an APK containing your Gemini key.
- **Offline fixture artifact:** the screenshot workflow produces a release APK without keys. It uses the exact sample in [DEMO.md](docs/DEMO.md); other input is retained as one unstructured item. This artifact demonstrates local capture/receipt/storage/navigation, not live AI extraction or configured purchases.
- **Isolated native QA:** a manual workflow builds `com.emmagh1.coby.nativeqa`, a separate emulator-only application. It exercises the real SQLite and reminder adapters without touching phone tasks. Its test entry is never selected by the normal Coby build.

The Next Gen submission uses source and a truthful device demo. A public APK with live extraction requires a secured server endpoint; it is not supplied by the offline fixture artifact.

Brand assets reproduce the approved circular C mark. Run `scripts/export-brand-assets.cjs` with Sharp available (`COBY_SHARP_PATH` can point to an existing installation). The 1024px launcher, adaptive layers, monochrome layer and native splash are generated together.

### Emulator microphone check

If Speak opens but no words arrive on the Windows Android emulator, run `node scripts/emulator-microphone.cjs` to inspect host microphone forwarding. `node scripts/emulator-microphone.cjs --enable` enables it and verifies the resulting state through the Android SDK emulator API. Windows microphone permission, an available recognition service, and a real spoken transcription check are still required. The script never prints the emulator's token.
