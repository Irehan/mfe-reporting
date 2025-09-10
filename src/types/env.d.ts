// Minimal ambient declarations so TS understands import.meta.env
// without depending on vite/client types.

interface ImportMetaEnv {
  readonly DEV?: boolean;
  readonly PROD?: boolean;
  readonly BASE_URL?: string;
  readonly VITE_REGISTRY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
