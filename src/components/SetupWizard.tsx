import { useStore } from '@nanostores/preact';
import { NetworkList, SavedNetworks } from '@wificonfig/ui';
import { wizardStep } from '../stores/wizard';
import { setupMessages } from '../i18n/messages/setup';
import { StepIndicator } from './StepIndicator';
import { DeviceNameStep } from './DeviceNameStep';
import './SetupWizard.css';

interface Props {
  /** Fired when the connection modal is dismissed after a connect attempt. */
  onConnected: () => void;
}

export function SetupWizard({ onConnected }: Props) {
  const step = useStore(wizardStep);
  const t = useStore(setupMessages);

  return (
    <div class="setup-wizard">
      <StepIndicator current={step} total={2} />

      {step === 1 && <DeviceNameStep mode="wizard" />}

      {step === 2 && (
        <div class="wifi-step">
          <h1 class="setup-title">{t.wifiTitle}</h1>
          <p class="setup-subtitle text-muted">{t.wifiSubtitle}</p>
          <NetworkList onConnect={onConnected} />
          <SavedNetworks />
        </div>
      )}
    </div>
  );
}
