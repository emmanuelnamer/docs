import { useNavigate } from 'react-router-dom';
import { store } from '../../data/store';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const user = store.getCurrentUser();

  if (!user || user.role !== 'manager') {
    navigate('/login');
    return null;
  }

  const stats = store.getStats();
  const prospects = store.getProspects();
  const consultants = store.getConsultants();

  function handleLogout() {
    store.logout();
    navigate('/login');
  }

  const stageLabels: Record<string, string> = {
    'pre-audit': 'Diagnostic',
    'rdv1-pending': 'RDV 1 planifié',
    'rdv1-done': 'Audit fait',
    'rdv2-pending': 'RDV 2 planifié',
    'rdv2-done': 'Rapport présenté',
    'rdv3-pending': 'RDV 3 planifié',
    'rdv3-done': 'Décision',
    'converted': 'Converti',
    'lost': 'Perdu',
  };

  const conversionRate = stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">Leads.fr</span>
            <span className="text-sm px-2 py-0.5 rounded text-white/70 bg-white/10">Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">{user.firstName} {user.lastName}</span>
            <button onClick={handleLogout} className="text-sm px-3 py-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <KPI label="Total Prospects" value={stats.total} />
          <KPI label="Éligibles" value={stats.eligible} color="var(--color-primary)" />
          <KPI label="Score Moyen" value={`${stats.avgScore}/75`} color="var(--color-accent)" />
          <KPI label="Convertis" value={stats.converted} color="var(--color-success)" />
          <KPI label="Taux de Conversion" value={`${conversionRate}%`} color={conversionRate > 20 ? 'var(--color-success)' : 'var(--color-accent)'} />
        </div>

        {/* Pipeline */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Pipeline Global</h2>
          <div className="space-y-2">
            {Object.entries(stats.byStage).map(([stage, count]) => {
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-sm w-36 truncate">{stageLabels[stage] || stage}</span>
                  <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                    <div
                      className="h-full rounded-full flex items-center pl-2"
                      style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: 'var(--color-primary)' }}
                    >
                      <span className="text-xs text-white font-bold">{count}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold w-12 text-right">{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultants */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Consultants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultants.map(c => {
              const cProspects = prospects.filter(p => p.consultantId === c.id);
              const cConverted = cProspects.filter(p => p.stage === 'converted').length;
              return (
                <div key={c.id} className="p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{c.firstName} {c.lastName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{cProspects.length}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Prospects</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{cConverted}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Convertis</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
                        {cProspects.length > 0 ? Math.round((cConverted / cProspects.length) * 100) : 0}%
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Conversion</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent prospects */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Derniers Prospects</h2>
          {prospects.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>Aucun prospect pour le moment.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <th className="text-left p-2 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Nom</th>
                  <th className="text-left p-2 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Entreprise</th>
                  <th className="text-left p-2 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Score</th>
                  <th className="text-left p-2 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Consultant</th>
                  <th className="text-left p-2 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Étape</th>
                </tr>
              </thead>
              <tbody>
                {prospects.slice(-10).reverse().map(p => {
                  const cons = p.consultantId ? store.getConsultant(p.consultantId) : null;
                  return (
                    <tr key={p.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="p-2 text-sm font-medium">{p.firstName} {p.lastName}</td>
                      <td className="p-2 text-sm" style={{ color: 'var(--color-text-light)' }}>{p.company}</td>
                      <td className="p-2 text-sm font-bold">{p.score}/75</td>
                      <td className="p-2 text-sm">{cons ? `${cons.firstName} ${cons.lastName}` : '—'}</td>
                      <td className="p-2 text-sm">{stageLabels[p.stage] || p.stage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <p className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: color || 'var(--color-text)' }}>{value}</p>
    </div>
  );
}
