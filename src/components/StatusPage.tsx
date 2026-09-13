import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import {
  api,
  appMessages,
  StatusCard,
  NetworkList,
  SavedNetworks,
  LanguageSelector,
} from '@wificonfig/ui';
import type { WifiStatus } from '@wificonfig/ui';
import { DeviceNameStep } from './DeviceNameStep';

const POLL_INTERVAL = 5000;

interface Props {
  initialStatus: WifiStatus | null;
}

/** Shown when the device is already connected: status, device name, networks. */
export function StatusPage({ initialStatus }: Props) {
  const [status, setStatus] = useState<WifiStatus | null>(initialStatus);
  const t = useStore(appMessages);

  const loadStatus = async () => {
    try {
      setStatus(await api.getStatus());
    } catch {
      setStatus(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(loadStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div class="app">
      <header class="header">
        <h1>{t.title}</h1>
        <LanguageSelector />
      </header>

      <StatusCard status={status} loading={false} />
      <DeviceNameStep mode="inline" />
      <NetworkList onConnect={loadStatus} />
      <SavedNetworks />
    </div>
  );
}
