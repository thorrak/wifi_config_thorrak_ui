import { useStore } from '@nanostores/preact';
import { useEffect, useRef } from 'preact/hooks';
import { wizardStep } from '../stores/wizard';
import { setupMessages } from '../i18n/messages/setup';
import { scanNetworks } from '../stores/networks';
import { StepIndicator } from './StepIndicator';
import { DeviceNameStep } from './DeviceNameStep';
import { NetworkList } from './NetworkList';
import { SavedNetworks } from './SavedNetworks';
import './SetupWizard.css';

export function SetupWizard() {
  const step = useStore(wizardStep);
  const t = useStore(setupMessages);
  const hasScanned = useRef(false);

  useEffect(() => {
    if (step === 2 && !hasScanned.current) {
      hasScanned.current = true;
      scanNetworks();
    }
  }, [step]);

  return (
    <div class="setup-wizard">
      <StepIndicator current={step} total={2} />

      {step === 1 && <DeviceNameStep />}

      {step === 2 && (
        <div class="wifi-step">
          <h1 class="setup-title">{t.wifiTitle}</h1>
          <p class="setup-subtitle text-muted">{t.wifiSubtitle}</p>
          <NetworkList onConnect={() => {}} />
          <SavedNetworks />
        </div>
      )}
    </div>
  );
}
