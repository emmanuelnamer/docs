import { useNavigate } from 'react-router-dom';

export default function NotEligible() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="py-4 px-6" style={{ backgroundColor: 'var(--color-primary)' }}>
        <span className="text-xl font-bold text-white">Leads.fr</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">🎬</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
            Découvrez d'abord le système PVC
          </h1>
          <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
            Avant de pouvoir accéder à un audit personnalisé, nous vous recommandons de regarder notre vidéo éducative.
            Elle vous expliquera en détail comment le modèle PVC peut transformer votre acquisition de clients.
          </p>
          <p className="mb-8 text-sm" style={{ color: 'var(--color-text-light)' }}>
            Cette vidéo de 12 minutes vous montrera exactement comment des centaines d'entrepreneurs
            ont structuré leur acquisition pour atteindre 10 rendez-vous qualifiés par semaine.
          </p>
          <div className="space-y-3">
            <button
              className="w-full py-4 rounded-xl text-white font-bold text-lg"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onClick={() => window.open('#vee', '_blank')}
            >
              Regarder la Vidéo Éducative
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl font-medium"
              style={{ color: 'var(--color-primary)', border: '2px solid var(--color-primary)' }}
            >
              Retour au diagnostic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
