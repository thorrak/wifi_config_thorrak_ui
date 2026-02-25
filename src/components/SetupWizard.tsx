import { useStore } from '@nanostores/preact';
import { wizardStep } from '../stores/wizard';
import { setupMessages } from '../i18n/messages/setup';
import { StepIndicator } from './StepIndicator';
import { DeviceNameStep } from './DeviceNameStep';
import { NetworkList } from './NetworkList';
import { SavedNetworks } from './SavedNetworks';
import './SetupWizard.css';

interface Props {
  onConnect: (ssid: string) => void;
}

export function SetupWizard({ onConnect }: Props) {
  const step = useStore(wizardStep);
  const t = useStore(setupMessages);

  return (
    <div class="setup-wizard">
      <StepIndicator current={step} total={2} />

      {step === 1 && <DeviceNameStep />}

      {step === 2 && (
        <div class="wifi-step">
          <h1 class="setup-title">{t.wifiTitle}</h1>
          <p class="setup-subtitle text-muted">{t.wifiSubtitle}</p>
          <NetworkList onConnect={onConnect} />
          <SavedNetworks />
        </div>
      )}
    </div>
  );
}
