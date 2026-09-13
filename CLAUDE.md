# wifi_config_thorrak_ui — project instructions

Provisioning web UI for TiltBridge, BrewPi-ESP and RepelBridge. A thin overlay
on the
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

## Products / branding

One build per product, selected by Vite mode. `.env.<mode>` holds
`VITE_PRODUCT_NAME`; `vite.config.ts` (`defineConfig(({ mode }) => ...)` +
`loadEnv`) throws if it is empty and writes to `dist/<mode>/`.

| Mode          | Name        | Output              | Consumer                                  |
|---------------|-------------|---------------------|-------------------------------------------|
| `tiltbridge`  | TiltBridge  | `dist/tiltbridge/`  | TiltBridge firmware `data/wifiui/`        |
| `brewpi`      | BrewPi-ESP  | `dist/brewpi/`      | BrewPi-ESP firmware `data/wifiui/`        |
| `repelbridge` | RepelBridge | `dist/repelbridge/` | RepelBridge firmware `data/wifiui/` (planned) |

The name is used in exactly three places: `index.html` `<title>`
(`%VITE_PRODUCT_NAME% WiFi Setup`), `setup.welcomeTitle` (`{product}` param,
all five languages) and the `StatusPage` `<h1>`, all via
`import.meta.env.VITE_PRODUCT_NAME` (declared in `src/vite-env.d.ts`).
**Never hardcode a product name in source, `index.html` or a translation** —
only the `.env.*` files carry them. Adding a product = one `.env.<mode>` file
+ one `build:<mode>` script in `package.json` (append it to `build` too).

## Workflow

- `npm run dev:server` (library test server + `tools/test_server.tiltbridge.json`),
  `npm run dev` (= `vite --mode tiltbridge`; also `dev:brewpi`,
  `dev:repelbridge`), `npm run build` (tsc once, then all three products;
  `build:<mode>` for one). Must pass `tsc` strict with no `console.log`.
- Output per product: `dist/<mode>/index.html`, `dist/<mode>/assets/app.js.gz`,
  `dist/<mode>/assets/index.css.gz` (fixed names, originals deleted). Firmware
  copies them into `data/wifiui/` and serves via
  `WIFI_CFG_WEBUI_CUSTOM_PATH="/littlefs/wifiui"`.
- Bump the library: `git -C esp_wifi_config fetch --tags && git -C esp_wifi_config checkout <tag>`,
  then `git add esp_wifi_config` and commit. Do not pick the tag yourself.

## i18n

New strings go in `src/i18n/messages/setup.ts` (English) and in all four JSONs
(de, es, fr, vi). `registerTranslations()` must run in `main.tsx` before the
first render. Parameterized strings use `params<{...}>('... {x} ...')`.
