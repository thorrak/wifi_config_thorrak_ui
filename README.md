# wifi_config_thorrak_ui

Provisioning web UI for [TiltBridge](https://github.com/thorrak/tiltbridge) and
[BrewPi-ESP](https://github.com/thorrak/brewpi-esp8266). It is a thin overlay on
the generic web UI that ships with the
[esp_wifi_config](https://github.com/WiFiConfig/esp_wifi_config) library: the
library's `frontend/` is pulled in as a git submodule and compiled straight
from source, and this repo adds a device-name (mDNS hostname) step in front of
the WiFi setup.

## Layering rule

- **Generic UI changes go to the library** (`esp_wifi_config/frontend/`),
  never here. Status card, network scanning/connecting, saved networks, the
  connection modal, the language selector, the API client, the base
  translations and the global styles all live there.
- **This repo owns only the product-specific parts:** the setup wizard shell,
  the step indicator, the device-name step, the `setup` message namespace and
  its translations, the logo, and the app entry point.

The library is imported under the `@wificonfig/ui` alias, which maps to
`esp_wifi_config/frontend/src` (see `vite.config.ts` and `tsconfig.json`).
`@wificonfig/ui` resolves to the library's `lib.ts` barrel; deep paths such as
`@wificonfig/ui/styles/base.css` resolve inside the same tree.

## Behaviour

On load the app fetches `GET /api/wifi/status`:

- **Connected** (`state === "connected"`): a status page is rendered: header
  with title and language selector, the library's status card (polled every
  5 s), an editable device-name card, the network list and the saved-network
  list.
- **Otherwise**: the two-step wizard. Step 1 asks for the device name
  (prefilled from `GET /api/wifi/vars`, key `mdns_name`; `PUT` only when the
  value changed). Step 2 is the WiFi network list with the connection modal;
  once the connection succeeds and the modal is dismissed, the app switches to
  the status page.

The device name is validated client-side as an RFC 1123 hostname label (1-63
characters, `[a-z0-9-]`, no leading or trailing hyphen) and lowercased
automatically.

## Development

```bash
npm install          # package-lock.json is tracked; `npm ci` for exact versions
npm run dev:server   # library test server on :8080 with tools/test_server.tiltbridge.json
npm run dev          # Vite dev server; /api is proxied to 127.0.0.1:8080
npm run build        # tsc && vite build -> dist/
```

The submodule has no `node_modules` of its own; its sources resolve `preact`,
`nanostores` and `@nanostores/*` from this repo, so keep the versions in
`package.json` in step with `esp_wifi_config/frontend/package.json`.

The test server needs `pip install -r esp_wifi_config/tools/test_server/requirements.txt`
and accepts `--auth USER:PASS` to emulate a device with HTTP auth enabled.

### First checkout

```bash
git clone --recurse-submodules <this repo>
# or, in an existing clone:
git submodule update --init
```

### Bumping the library

```bash
git -C esp_wifi_config fetch --tags
git -C esp_wifi_config checkout <tag>     # e.g. v0.3.2
git add esp_wifi_config
git commit -m "chore: bump esp_wifi_config to <tag>"
```

`.gitmodules` records the branch the submodule tracks; the commit pins the exact
revision.

## Consuming the build

`npm run build` writes `dist/index.html`, `dist/assets/app.js.gz` and
`dist/assets/index.css.gz` (the uncompressed assets are deleted). Copy the three
files into the firmware's `data/wifiui/` directory; TiltBridge and BrewPi-ESP
serve that directory via
`WIFI_CFG_WEBUI_CUSTOM_PATH="/littlefs/wifiui"`.

```bash
npm run build
cp dist/index.html dist/assets/app.js.gz dist/assets/index.css.gz <firmware>/data/wifiui/
```

## Translations

English strings for the `setup` namespace are defined in
`src/i18n/messages/setup.ts`; German, Spanish, French and Vietnamese live in
`src/i18n/translations/{de,es,fr,vi}.json` (setup namespace only) and are merged
into the library's catalogs with `registerTranslations()` in `src/main.tsx`
before the first render. Every new key must be added to all five languages.

## Project structure

```
esp_wifi_config/            # submodule: the library (frontend/src is @wificonfig/ui)
src/
  main.tsx                  # registers translations, imports global styles, renders App
  App.tsx                   # /status probe; status page vs wizard
  components/
    StatusPage.tsx          # connected view (status, device name, networks)
    SetupWizard.tsx         # two-step wizard shell
    StepIndicator.tsx/.css
    DeviceNameStep.tsx/.css # mDNS name form (wizard + inline modes)
  i18n/messages/setup.ts    # English base strings
  i18n/translations/*.json  # de/es/fr/vi, setup namespace
  stores/wizard.ts          # current wizard step
  styles/app.css            # overlay-only styles
  assets/logo.svg
tools/test_server.tiltbridge.json   # fixture for `npm run dev:server`
```
