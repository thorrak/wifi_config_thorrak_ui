import { useStore } from '@nanostores/preact';
import { setupMessages } from '../i18n/messages/setup';
import './StepIndicator.css';

interface Props {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: Props) {
  const t = useStore(setupMessages);

  return (
    <div class="step-indicator">
      <div class="step-dots">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            class={`step-dot ${i + 1 === current ? 'active' : ''} ${i + 1 < current ? 'completed' : ''}`}
          />
        ))}
      </div>
      <span class="step-label text-sm text-muted">
        {t.stepOf({ current: String(current), total: String(total) })}
      </span>
    </div>
  );
}
