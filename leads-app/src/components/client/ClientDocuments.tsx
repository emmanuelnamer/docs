import { Prospect } from '../../types';
import { store } from '../../data/store';

interface Props {
  prospect: Prospect;
}

export default function ClientDocuments({ prospect }: Props) {
  const report = store.getReportByProspect(prospect.id);
  const hasReport = report && report.sharedWithProspect;

  const documents = [
    {
      title: 'Score de Potentiel PVC',
      description: 'Résultat de votre diagnostic initial',
      available: true,
      icon: '📊',
    },
    {
      title: 'Rapport d\'Audit Personnalisé',
      description: 'Analyse complète de votre situation et recommandations',
      available: hasReport,
      icon: '📋',
    },
    {
      title: 'Script VEE Personnalisé',
      description: 'Structure de votre vidéo éducative engageante',
      available: hasReport,
      icon: '🎬',
    },
    {
      title: 'Accroches Publicitaires',
      description: 'Exemples de hooks pour vos campagnes Meta Ads',
      available: hasReport,
      icon: '📣',
    },
    {
      title: 'Feuille de Route 90 Jours',
      description: 'Plan d\'action étape par étape',
      available: hasReport,
      icon: '🗺️',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>Mes Documents</h2>
      <p style={{ color: 'var(--color-text-light)' }}>
        Vos livrables personnalisés s'enrichissent au fil de votre parcours.
      </p>
      <div className="grid gap-4">
        {documents.map((doc, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex items-center gap-4 transition-all"
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              opacity: doc.available ? 1 : 0.5,
            }}
          >
            <span className="text-3xl">{doc.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: 'var(--color-primary)' }}>{doc.title}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{doc.description}</p>
            </div>
            {doc.available ? (
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Consulter
              </button>
            ) : (
              <span className="text-sm px-3 py-1 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: 'var(--color-text-light)' }}>
                Bientôt disponible
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
