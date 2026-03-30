import { EligibilityQuestion } from '../../types';

interface Props {
  question: EligibilityQuestion;
  onAnswer: (questionId: string, value: string, eligible: boolean) => void;
  stepNumber: number;
  totalSteps: number;
}

export default function EligibilityStep({ question, onAnswer, stepNumber, totalSteps }: Props) {
  return (
    <div className="animate-fade-in">
      <p className="text-sm mb-2" style={{ color: 'var(--color-text-light)' }}>
        Question {stepNumber} sur {totalSteps}
      </p>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
        {question.question}
      </h2>
      {question.subtitle && (
        <p className="mb-8" style={{ color: 'var(--color-text-light)' }}>{question.subtitle}</p>
      )}
      <div className="space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(question.id, opt.value, opt.eligible)}
            className="w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-card)',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--color-primary)';
              (e.target as HTMLElement).style.backgroundColor = '#F0F4FF';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--color-border)';
              (e.target as HTMLElement).style.backgroundColor = 'var(--color-card)';
            }}
          >
            <span className="font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
