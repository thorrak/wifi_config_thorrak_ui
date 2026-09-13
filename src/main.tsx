import { render } from 'preact';
import { registerTranslations } from '@wificonfig/ui';
import '@wificonfig/ui/styles/variables.css';
import '@wificonfig/ui/styles/base.css';
import '@wificonfig/ui/styles/utilities.css';
import './styles/app.css';
import de from './i18n/translations/de.json';
import es from './i18n/translations/es.json';
import fr from './i18n/translations/fr.json';
import vi from './i18n/translations/vi.json';
import { App } from './App';

// @nanostores/i18n loads a locale's catalog once, when the first message store
// is mounted, so the overlay namespaces must be merged in before rendering.
registerTranslations('de', de);
registerTranslations('es', es);
registerTranslations('fr', fr);
registerTranslations('vi', vi);

render(<App />, document.getElementById('app')!);
