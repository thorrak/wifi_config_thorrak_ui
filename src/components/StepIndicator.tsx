import { useStore } from '@nanostores/preact';
import { setupMessages } from '../i18n/messages/setup';
import { wizardStep } from '../stores/wizard';
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
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < current;
          return (
            <button
              key={i}
              type="button"
              class={`step-dot ${step === current ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              disabled={step >= current}
              onClick={() => wizardStep.set(step as 1 | 2)}
              aria-label={t.stepLabel({ step: String(step) })}
            />
          );
        })}
      </div>
      <span class="step-label text-sm text-muted">
        {t.stepOf({ current: String(current), total: String(total) })}
      </span>
    </div>
  );
}
