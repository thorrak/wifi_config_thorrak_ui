import { useState, useEffect } from 'preact/hooks';
import { StatusCard } from './components/StatusCard';
import { SetupWizard } from './components/SetupWizard';
import { LanguageSelector } from './components/LanguageSelector';
import { api } from './api/client';
import type { WifiStatus } from './types';
import './styles/variables.css';
import './styles/base.css';
import './styles/utilities.css';

export function App() {
  const [status, setStatus] = useState<WifiStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    try {
      const s = await api.getStatus();
      setStatus(s);
    } catch (e) {
      console.error('Failed to load status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = () => {
    setTimeout(loadStatus, 2000);
  };

  return (
    <div class="app">
      <header class="header">
        <LanguageSelector />
      </header>

      <StatusCard status={status} loading={loading} />
      <SetupWizard onConnect={handleConnect} />
    </div>
  );
}
