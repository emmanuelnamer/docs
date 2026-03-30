export default function ClientResources() {
  const caseStudies = [
    {
      title: "De 250K€ à 900K€ en 12 mois",
      sector: "Coaching Business",
      description: "Comment un coach en développement d'entreprise a multiplié son CA par 3.6 grâce au système PVC.",
      metric: "×3.6 de CA",
    },
    {
      title: "42 RDV qualifiés par mois",
      sector: "Rénovation énergétique",
      description: "Un artisan en rénovation qui est passé de la prospection porte-à-porte à un flux automatisé de clients.",
      metric: "42 RDV/mois",
    },
    {
      title: "ROAS de 49 sur Meta Ads",
      sector: "Formation en ligne",
      description: "49€ générés pour chaque euro investi en publicité grâce à une VEE optimisée.",
      metric: "ROAS ×49",
    },
    {
      title: "35K€ à 220K€ de CA mensuel",
      sector: "Immobilier commercial",
      description: "Un commercial immobilier qui a transformé son processus de vente avec le modèle PVC.",
      metric: "×6 de CA",
    },
  ];

  const resources = [
    { title: "Le Guide du Système PVC", type: "PDF", description: "Comprendre les 3 piliers de l'acquisition digitale." },
    { title: "Les 5 Niveaux de Conscience", type: "Vidéo", description: "Comment faire monter vos prospects du niveau 1 au niveau 5." },
    { title: "Construire une Offre Premium", type: "Guide", description: "Les 5 éléments d'une offre irrésistible." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Études de Cas</h2>
        <p className="mb-4" style={{ color: 'var(--color-text-light)' }}>
          Des résultats concrets obtenus par des entrepreneurs accompagnés par Leads.fr.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudies.map((cs, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#EFF6FF', color: 'var(--color-primary)' }}>
                  {cs.sector}
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--color-success)' }}>{cs.metric}</span>
              </div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{cs.title}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{cs.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Ressources</h2>
        <div className="grid gap-3">
          {resources.map((r, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <span className="text-xs px-2 py-1 rounded font-bold" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                {r.type}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{r.title}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
