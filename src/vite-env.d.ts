/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Product display name from `.env.<mode>` ; required at build, see vite.config.ts. */
  readonly VITE_PRODUCT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
