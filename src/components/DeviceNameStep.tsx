import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { api, Button, Card } from '@wificonfig/ui';
import { setupMessages } from '../i18n/messages/setup';
import { wizardStep } from '../stores/wizard';
import logo from '../assets/logo.svg';
import './DeviceNameStep.css';

const VAR_KEY = 'mdns_name';

/** RFC 1123 hostname label: 1-63 chars of [a-z0-9-], no leading/trailing hyphen. */
function isValidHostname(name: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(name);
}

interface Props {
  /**
   * `wizard`: full-page step with logo and a Next button that advances the
   * wizard. `inline`: a plain card with a Save button, for the status page.
   */
  mode: 'wizard' | 'inline';
}

export function DeviceNameStep({ mode }: Props) {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const t = useStore(setupMessages);
  const isWizard = mode === 'wizard';
  const unchanged = name === savedName;

  useEffect(() => {
    api
      .getVars()
      .then((vars) => {
        const current = vars.find((v) => v.key === VAR_KEY)?.value ?? '';
        // Names are always lowercase; a device value that is not counts as a
        // change so that saving normalizes it.
        setName(current.toLowerCase());
        setSavedName(current);
      })
      .catch(() => setError(t.errorLoadFailed))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setJustSaved(false);

    if (!isValidHostname(name)) {
      setError(t.errorInvalid);
      return;
    }

    // Nothing to write when the prefilled value was accepted as-is.
    if (unchanged) {
      if (isWizard) wizardStep.set(2);
      return;
    }

    setSaving(true);
    try {
      await api.setVar(VAR_KEY, name);
      setSavedName(name);
      if (isWizard) {
        wizardStep.set(2);
      } else {
        setJustSaved(true);
      }
    } catch {
      setError(t.errorSaveFailed);
    } finally {
      setSaving(false);
    }
  };

  const form = (
    <>
      {isWizard ? (
        <label class="device-name-label" for="device-name">
          {t.deviceNameLabel}
        </label>
      ) : null}

      {loading ? (
        <p class="device-name-loading text-muted">{t.loading}</p>
      ) : (
        <>
          <div class={`device-name-input-group ${error ? 'has-error' : ''}`}>
            <input
              id="device-name"
              type="text"
              value={name}
              aria-label={isWizard ? undefined : t.deviceNameLabel}
              onInput={(e) => {
                setName((e.target as HTMLInputElement).value.toLowerCase());
                setError(null);
                setJustSaved(false);
              }}
              class="device-name-input"
            />
            <span class="device-name-suffix">.local</span>
          </div>

          {error && <p class="error-message">{error}</p>}

          {name && !error && (
            <p class="device-name-preview">{t.deviceNamePreview({ name })}</p>
          )}

          <button
            type="button"
            class="help-toggle"
            onClick={() => setHelpOpen(!helpOpen)}
            aria-expanded={helpOpen}
          >
            {t.deviceNameHelp}
          </button>

          {helpOpen && (
            <p class="help-text">{t.deviceNameHelpText({ name: name || 'mydevice' })}</p>
          )}

          {justSaved && <p class="device-name-saved">{t.saved}</p>}

          <Button
            onClick={handleSubmit}
            loading={saving}
            disabled={!name || (!isWizard && unchanged)}
            class="w-full"
          >
            {saving ? t.saving : isWizard ? t.next : t.save}
          </Button>
        </>
      )}
    </>
  );

  if (!isWizard) {
    return <Card title={t.deviceNameLabel}>{form}</Card>;
  }

  return (
    <div class="device-name-step">
      <img src={logo} alt="" class="setup-logo" />
      <h1 class="setup-title">{t.welcomeTitle({ product: import.meta.env.VITE_PRODUCT_NAME })}</h1>
      <p class="setup-subtitle text-muted">{t.welcomeSubtitle}</p>
      <Card>{form}</Card>
    </div>
  );
}
