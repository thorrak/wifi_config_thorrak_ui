import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { setupMessages } from '../i18n/messages/setup';
import { api } from '../api/client';
import { wizardStep } from '../stores/wizard';
import logo from '../assets/logo.svg';
import './DeviceNameStep.css';

function validateMdns(name: string): boolean {
  if (name.length < 1 || name.length > 63) return false;
  if (/--/.test(name)) return false;
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(name);
}

export function DeviceNameStep() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const t = useStore(setupMessages);

  useEffect(() => {
    api.getVars().then((vars) => {
      const mdns = vars.find((v) => v.key === 'mdns_name');
      if (mdns) setName(mdns.value);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (!validateMdns(name)) {
      setError(t.errorInvalid);
      return;
    }

    setSaving(true);
    try {
      await api.setVar('mdns_name', name);
      wizardStep.set(2);
    } catch {
      setError(t.errorSaveFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div class="device-name-step">
      <img src={logo} alt="" class="setup-logo" />
      <h1 class="setup-title">{t.welcomeTitle}</h1>
      <p class="setup-subtitle text-muted">{t.welcomeSubtitle}</p>

      <Card>
        <label class="device-name-label" for="device-name">
          {t.deviceNameLabel}
        </label>

        <div class={`device-name-input-group ${error ? 'has-error' : ''}`}>
          <input
            id="device-name"
            type="text"
            value={name}
            onInput={(e) => {
              setName((e.target as HTMLInputElement).value.toLowerCase());
              setError(null);
            }}
            class="device-name-input"
          />
          <span class="device-name-suffix">.local</span>
        </div>

        {error && <p class="error-message">{error}</p>}

        {name && !error && (
          <p class="device-name-preview">
            {t.deviceNamePreview({ name })}
          </p>
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
          <p class="help-text">
            {t.deviceNameHelpText({ name: name || 'mydevice' })}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          loading={saving}
          disabled={!name}
          class="w-full"
        >
          {saving ? t.saving : t.next}
        </Button>
      </Card>
    </div>
  );
}
