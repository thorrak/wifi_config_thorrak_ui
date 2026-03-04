import { SetupWizard } from './components/SetupWizard';
import { LanguageSelector } from './components/LanguageSelector';
import './styles/variables.css';
import './styles/base.css';
import './styles/utilities.css';

export function App() {
  return (
    <div class="app">
      <header class="header">
        <LanguageSelector />
      </header>

      <SetupWizard />
    </div>
  );
}
