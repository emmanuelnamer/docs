import { ScoringQuestion } from '../../types';

interface Props {
  question: ScoringQuestion;
  onAnswer: (questionId: string, value: number) => void;
  stepNumber: number;
  totalSteps: number;
}

const axisLabels = {
  pub: 'Acquisition & Publicité',
  vee: 'Qualification & Contenu',
  closing: 'Closing & Vente',
  predictability: 'Prédictibilité',
};

export default function ScoringStep({ question, onAnswer, stepNumber, totalSteps }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          Question {stepNumber} sur {totalSteps}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{
          backgroundColor: 'var(--color-primary)', color: 'white'
        }}>
          {axisLabels[question.axis]}
        </span>
      </div>
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>
        {question.question}
      </h2>
      <div className="space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onAnswer(question.id, opt.value)}
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
