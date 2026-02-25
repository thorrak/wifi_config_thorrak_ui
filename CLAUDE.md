# ESP WiFi Manager WebUI

## Project Overview
Web UI for configuring WiFi on ESP32 IoT devices. Served by the device's Soft AP when it cannot connect to WiFi. Designed to be embedded in ESP32 firmware as gzipped static assets.

## Tech Stack
- **Framework:** Preact 10 (not React) with TypeScript
- **Build:** Vite 5 with `@preact/preset-vite`, output gzipped to `dist/`
- **State:** Nanostores atoms (local component state via `useState`)
- **i18n:** `@nanostores/i18n` + `@nanostores/persistent` — English base strings defined in `src/i18n/messages/*.ts`, translations in `src/i18n/translations/{lang}.json` (es, fr, de, vi)
- **Styling:** CSS custom properties (`variables.css`), per-component CSS files, dark mode via `prefers-color-scheme`
- **Dev server:** Vite proxies `/api` to `http://127.0.0.1:8080` (device test server)

## Build & Dev
- `npm run dev` — start dev server (requires device test server on :8080)
- `npm run build` — `tsc && vite build` → gzipped assets in `dist/`

## Project Structure
```
src/
  main.tsx              # Entry point
  App.tsx               # Root component
  types.ts              # TypeScript interfaces
  api/client.ts         # All API calls (/api/wifi/*)
  components/           # UI components (*.tsx + *.css pairs)
    ui/                 # Reusable primitives (Button, Card)
    StatusCard.tsx      # Connection state display
    NetworkList.tsx     # Scan + connect flow
    SavedNetworks.tsx   # Saved network management
    LanguageSelector.tsx
  i18n/
    index.ts            # i18n setup (locale atom, createI18n)
    messages/*.ts       # English base strings by namespace
    translations/*.json # Non-English translations
  styles/               # Global CSS (variables, base, utilities)
```

## API Endpoints (all under `/api/wifi`)
- **Status:** `GET /status`
- **Scan:** `GET /scan`
- **Networks:** `GET /networks`, `POST /networks`, `DELETE /networks/:ssid`
- **Connection:** `POST /connect`, `POST /disconnect`
- **AP:** `GET /ap/status`, `GET /ap/config`, `PUT /ap/config`, `POST /ap/start`, `POST /ap/stop`
- **Variables:** `GET /vars`, `PUT /vars/:key`, `DELETE /vars/:key`
- **System:** `POST /factory_reset`

## UI Workflow (Setup Flow)
The device serves this UI when it cannot connect to WiFi. The UI guides the user through a two-step setup:

### Step 1: Device Name (mDNS)
- Fetch current `mdns_name` via `GET /vars` and prepopulate an input field
- User can accept or change the name
- Validate: must be a valid mDNS hostname (lowercase alphanumeric + hyphens, no leading/trailing hyphens, 1-63 chars, no consecutive hyphens)
- On submit: `PUT /vars/mdns_name` with new value — must succeed before proceeding
- Show the resulting address as `{name}.local` for clarity

### Step 2: WiFi Configuration
- Present available networks (scan + list) — existing `NetworkList` component
- User selects AP, enters password, connects — existing flow
- `StatusCard` shows connection progress/result

### Flow Control
- Step 1 must complete successfully before Step 2 is shown
- Language selector remains accessible throughout
- Status card shows current connection state throughout

## i18n Conventions
- Namespaces match component domains: `app`, `status`, `networks`, `saved`
- Base English strings in `src/i18n/messages/{namespace}.ts` using `i18n('namespace', { ... })`
- Translations in `src/i18n/translations/{lang}.json` keyed by namespace
- Parameterized strings use `{param}` syntax, accessed as functions: `t.msg({ param: value })`
- All user-facing strings must be internationalized
