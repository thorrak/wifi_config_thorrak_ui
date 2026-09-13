import { useState, useEffect } from 'preact/hooks';
import { api, LanguageSelector } from '@wificonfig/ui';
import type { WifiStatus } from '@wificonfig/ui';
import { SetupWizard } from './components/SetupWizard';
import { StatusPage } from './components/StatusPage';

type View = 'loading' | 'wizard' | 'status';

async function fetchStatus(): Promise<WifiStatus | null> {
  try {
    return await api.getStatus();
  } catch {
    return null;
  }
}

export function App() {
  const [view, setView] = useState<View>('loading');
  const [status, setStatus] = useState<WifiStatus | null>(null);

  useEffect(() => {
    fetchStatus().then((s) => {
      setStatus(s);
      setView(s?.state === 'connected' ? 'status' : 'wizard');
    });
  }, []);

  // Called by the wizard once the connection modal is dismissed: if the
  // device is now online, swap to the status page.
  const handleConnected = async () => {
    const s = await fetchStatus();
    if (s?.state === 'connected') {
      setStatus(s);
      setView('status');
    }
  };

  if (view === 'status') {
    return <StatusPage initialStatus={status} />;
  }

  return (
    <div class="app">
      <header class="header header-wizard">
        <LanguageSelector />
      </header>

      {view === 'wizard' && <SetupWizard onConnected={handleConnected} />}
    </div>
  );
}
