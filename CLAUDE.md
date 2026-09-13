# wifi_config_thorrak_ui — project instructions

Provisioning web UI for TiltBridge and BrewPi-ESP. A thin overlay on the
`esp_wifi_config` library's web UI, which is a git submodule at
`esp_wifi_config/` and imported as `@wificonfig/ui`
(`esp_wifi_config/frontend/src`; the bare specifier maps to `lib.ts`).

## Layering rule (most important)

Generic UI changes belong in the library's `frontend/`, not here. Do not copy
library components, the API client, styles or base translations into this repo;
import them from `@wificonfig/ui`. If something in the library needs to change,
say so instead of working around it here. Never edit files under
`esp_wifi_config/` from this repo.

This repo owns: `App.tsx`, `main.tsx`, `StatusPage`, `SetupWizard`,
`StepIndicator`, `DeviceNameStep`, `stores/wizard.ts`, the `setup` i18n
namespace (`src/i18n/messages/setup.ts` + `src/i18n/translations/*.json`),
`styles/app.css`, `assets/logo.svg`.

## Behaviour

- On load fetch `/api/wifi/status`. `state === "connected"` renders the status
  page (StatusCard polled every 5 s, inline device-name card, NetworkList,
  SavedNetworks); anything else renders the two-step wizard (device name, then
  WiFi). After a successful connect the wizard hands over to the status page.
- Device name = `mdns_name` variable (`GET /api/wifi/vars`, `PUT /api/wifi/vars/mdns_name`).
  Validation is an RFC 1123 hostname label (1-63 chars, `[a-z0-9-]`, no
  leading/trailing hyphen), lowercased on input. No PUT when unchanged.

## Stack

Preact 10 + TypeScript (strict, `noUnusedLocals`), Vite 5, nanostores +
`@nanostores/i18n`. Runtime dependency versions in `package.json` must match
`esp_wifi_config/frontend/package.json` because the submodule resolves them
from this repo's `node_modules`.

## Workflow

- `npm run dev:server` (library test server + `tools/test_server.tiltbridge.json`),
  `npm run dev`, `npm run build` (`tsc && vite build`; must pass with no
  `console.log`).
- Output: `dist/index.html`, `dist/assets/app.js.gz`, `dist/assets/index.css.gz`
  (fixed names, originals deleted). Firmware copies them into `data/wifiui/`
  and serves via `WIFI_CFG_WEBUI_CUSTOM_PATH="/littlefs/wifiui"`.
- Bump the library: `git -C esp_wifi_config fetch --tags && git -C esp_wifi_config checkout <tag>`,
  then `git add esp_wifi_config` and commit. Do not pick the tag yourself.

## i18n

New strings go in `src/i18n/messages/setup.ts` (English) and in all four JSONs
(de, es, fr, vi). `registerTranslations()` must run in `main.tsx` before the
first render. Parameterized strings use `params<{...}>('... {x} ...')`.
