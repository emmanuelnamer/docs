import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eligibilityQuestions, scoringQuestions } from '../../data/questions';
import { store } from '../../data/store';
import { Prospect } from '../../types';
import EligibilityStep from './EligibilityStep';
import ScoringStep from './ScoringStep';
import InfoCollect from './InfoCollect';
import ScoreResult from './ScoreResult';

type Phase = 'eligibility' | 'scoring' | 'info' | 'result';

export default function PreAuditFunnel() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('eligibility');
  const [eligStep, setEligStep] = useState(0);
  const [scoreStep, setScoreStep] = useState(0);
  const [eligAnswers, setEligAnswers] = useState<Record<string, string>>({});
  const [scoreAnswers, setScoreAnswers] = useState<Record<string, number>>({});
  const [prospect, setProspect] = useState<Prospect | null>(null);

  const totalSteps = 4 + 15 + 1; // elig + scoring + info
  const currentStep = phase === 'eligibility' ? eligStep + 1
    : phase === 'scoring' ? 4 + scoreStep + 1
    : phase === 'info' ? 20
    : 20;
  const progress = Math.round((currentStep / totalSteps) * 100);

  function handleEligAnswer(questionId: string, value: string, eligible: boolean) {
    const newAnswers = { ...eligAnswers, [questionId]: value };
    setEligAnswers(newAnswers);

    if (!eligible) {
      // Redirect to VEE
      navigate('/not-eligible');
      return;
    }

    if (eligStep < eligibilityQuestions.length - 1) {
      setEligStep(eligStep + 1);
    } else {
      setPhase('scoring');
    }
  }

  function handleScoreAnswer(questionId: string, value: number) {
    const newAnswers = { ...scoreAnswers, [questionId]: value };
    setScoreAnswers(newAnswers);

    if (scoreStep < scoringQuestions.length - 1) {
      setScoreStep(scoreStep + 1);
    } else {
      setPhase('info');
    }
  }

  function handleInfoSubmit(info: { firstName: string; lastName: string; email: string; phone: string; company: string; sector: string; revenue: string }) {
    // Calculate scores
    const scoreByAxis = { pub: 0, vee: 0, closing: 0, predictability: 0 };
    scoringQuestions.forEach(q => {
      const val = scoreAnswers[q.id] || 0;
      scoreByAxis[q.axis] += val;
    });
    const totalScore = scoreByAxis.pub + scoreByAxis.vee + scoreByAxis.closing + scoreByAxis.predictability;

    const newProspect: Prospect = {
      id: 'p-' + Date.now(),
      ...info,
      createdAt: new Date().toISOString(),
      score: totalScore,
      scoreByAxis,
      eligible: true,
      eligibilityAnswers: eligAnswers,
      scoringAnswers: scoreAnswers,
      stage: 'pre-audit',
    };

    store.createProspect(newProspect);
    setProspect(newProspect);
    setPhase('result');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="py-4 px-6 flex items-center justify-between" style={{ backgroundColor: 'var(--color-primary)' }}>
        <span className="text-xl font-bold text-white">Leads.fr</span>
        <span className="text-sm text-white/70">Diagnostic PVC</span>
      </div>

      {/* Progress bar */}
      {phase !== 'result' && (
        <div className="w-full h-2" style={{ backgroundColor: 'var(--color-border)' }}>
          <div
            className="h-full transition-all duration-500 rounded-r-full"
            style={{ width: `${progress}%`, backgroundColor: 'var(--color-accent)' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {phase === 'eligibility' && (
            <EligibilityStep
              question={eligibilityQuestions[eligStep]}
              onAnswer={handleEligAnswer}
              stepNumber={eligStep + 1}
              totalSteps={totalSteps}
            />
          )}
          {phase === 'scoring' && (
            <ScoringStep
              question={scoringQuestions[scoreStep]}
              onAnswer={handleScoreAnswer}
              stepNumber={4 + scoreStep + 1}
              totalSteps={totalSteps}
            />
          )}
          {phase === 'info' && (
            <InfoCollect onSubmit={handleInfoSubmit} />
          )}
          {phase === 'result' && prospect && (
            <ScoreResult prospect={prospect} />
          )}
        </div>
      </div>
    </div>
  );
}
