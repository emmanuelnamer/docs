import { useNavigate } from 'react-router-dom';
import { Prospect } from '../../types';
import { store } from '../../data/store';

interface Props {
  prospect: Prospect;
}

function getScoreLevel(score: number) {
  if (score <= 20) return { label: 'Inexploité', color: '#EF4444', emoji: '' };
  if (score <= 40) return { label: 'En Construction', color: '#F59E0B', emoji: '' };
  if (score <= 60) return { label: 'Intermédiaire', color: '#3B82F6', emoji: '' };
  return { label: 'Avancé', color: '#10B981', emoji: '' };
}

function getAxisLabel(axis: string) {
  const labels: Record<string, { name: string; max: number }> = {
    pub: { name: 'Publicité & Acquisition', max: 20 },
    vee: { name: 'Vidéo Éducative & Qualification', max: 20 },
    closing: { name: 'Closing & Processus de Vente', max: 20 },
    predictability: { name: 'Prédictibilité & Automatisation', max: 15 },
  };
  return labels[axis] || { name: axis, max: 20 };
}

export default function ScoreResult({ prospect }: Props) {
  const navigate = useNavigate();
  const level = getScoreLevel(prospect.score);

  function handleLogin() {
    // Auto-login the prospect
    store.login(prospect.email, '');
    navigate('/client');
  }

  return (
    <div className="animate-fade-in text-center">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
        Votre Score de Potentiel PVC
      </h1>
      <p className="mb-8" style={{ color: 'var(--color-text-light)' }}>
        {prospect.firstName}, voici l'analyse de votre potentiel d'acquisition digitale.
      </p>

      {/* Score circle */}
      <div className="relative mx-auto mb-6" style={{ width: 200, height: 200 }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="85" fill="none" stroke="#E2E8F0" strokeWidth="12" />
          <circle
            cx="100" cy="100" r="85"
            fill="none"
            stroke={level.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(prospect.score / 75) * 534} 534`}
            transform="rotate(-90 100 100)"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: level.color }}>{prospect.score}</span>
          <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>/ 75</span>
        </div>
      </div>

      <div className="inline-block px-4 py-2 rounded-full mb-8 font-semibold" style={{ backgroundColor: level.color + '20', color: level.color }}>
        Niveau : {level.label}
      </div>

      {/* Axis breakdown */}
      <div className="rounded-2xl p-6 mb-8 text-left" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Détail par axe</h3>
        {Object.entries(prospect.scoreByAxis).map(([axis, score]) => {
          const info = getAxisLabel(axis);
          const pct = (score / info.max) * 100;
          return (
            <div key={axis} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{info.name}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                  {score}/{info.max}
                </span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: pct < 33 ? '#EF4444' : pct < 66 ? '#F59E0B' : '#10B981' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <h3 className="text-xl font-bold mb-2">
          Votre potentiel de croissance est réel.
        </h3>
        <p className="mb-4 text-white/80">
          Un consultant Leads.fr va analyser votre situation en détail et vous présenter un plan d'action personnalisé pour déployer le système PVC dans votre activité.
        </p>
        <button
          onClick={handleLogin}
          className="px-8 py-3 rounded-xl font-bold text-lg transition-all"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          Accéder à mon espace client
        </button>
      </div>

      <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
        Votre espace personnel a été créé. Vous y retrouverez votre score, vos documents et le suivi de vos rendez-vous.
      </p>
    </div>
  );
}
