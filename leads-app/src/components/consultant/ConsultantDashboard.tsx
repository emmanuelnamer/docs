import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../data/store';
import ProspectList from './ProspectList';
import ProspectDetail from './ProspectDetail';

export default function ConsultantDashboard() {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);

  if (!user || user.role !== 'consultant') {
    navigate('/login');
    return null;
  }

  const prospects = store.getProspectsByConsultant(user.id);

  const todayRDVs = prospects.filter(p => {
    const rdvs = [p.rdv1, p.rdv2, p.rdv3].filter(Boolean);
    const today = new Date().toISOString().split('T')[0];
    return rdvs.some(r => r?.date === today && r.status === 'scheduled');
  });

  const stageCount: Record<string, number> = {};
  prospects.forEach(p => { stageCount[p.stage] = (stageCount[p.stage] || 0) + 1; });

  const alertProspects = prospects.filter(p => {
    const created = new Date(p.createdAt);
    const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 5 && p.stage === 'pre-audit';
  });

  function handleLogout() {
    store.logout();
    navigate('/login');
  }

  if (selectedProspectId) {
    return (
      <ProspectDetail
        prospectId={selectedProspectId}
        onBack={() => setSelectedProspectId(null)}
        consultantId={user.id}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">Leads.fr</span>
            <span className="text-sm px-2 py-0.5 rounded text-white/70 bg-white/10">Consultant</span>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Prospects" value={prospects.length} />
          <StatCard label="RDV Aujourd'hui" value={todayRDVs.length} color="var(--color-accent)" />
          <StatCard label="En attente de suivi" value={alertProspects.length} color="var(--color-danger)" />
          <StatCard label="Convertis" value={stageCount['converted'] || 0} color="var(--color-success)" />
        </div>

        {/* Alerts */}
        {alertProspects.length > 0 && (
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <span className="text-lg">⚠️</span>
            <p className="text-sm" style={{ color: '#991B1B' }}>
              <strong>{alertProspects.length} prospect(s)</strong> sans suivi depuis plus de 5 jours.
            </p>
          </div>
        )}

        {/* Pipeline view */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-bold" style={{ color: 'var(--color-primary)' }}>Pipeline des Prospects</h2>
          </div>
          <div className="flex gap-1 p-4 overflow-x-auto">
            {['pre-audit', 'rdv1-pending', 'rdv1-done', 'rdv2-pending', 'rdv2-done', 'rdv3-pending', 'converted'].map(stage => (
              <PipelineColumn
                key={stage}
                stage={stage}
                count={stageCount[stage] || 0}
                prospects={prospects.filter(p => p.stage === stage)}
                onSelect={setSelectedProspectId}
              />
            ))}
          </div>
        </div>

        {/* Full list */}
        <ProspectList prospects={prospects} onSelect={setSelectedProspectId} />
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: color || 'var(--color-primary)' }}>{value}</p>
    </div>
  );
}

function PipelineColumn({ stage, count, prospects, onSelect }: { stage: string; count: number; prospects: any[]; onSelect: (id: string) => void }) {
  const labels: Record<string, string> = {
    'pre-audit': 'Diagnostic',
    'rdv1-pending': 'RDV 1',
    'rdv1-done': 'Audit fait',
    'rdv2-pending': 'RDV 2',
    'rdv2-done': 'Rapport vu',
    'rdv3-pending': 'RDV 3',
    'converted': 'Converti',
  };

  return (
    <div className="flex-1 min-w-[140px]">
      <div className="text-center mb-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--color-text-light)' }}>{labels[stage] || stage}</span>
        <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{count}</div>
      </div>
      <div className="space-y-2">
        {prospects.slice(0, 3).map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full text-left p-2 rounded-lg text-xs hover:shadow-md transition-all"
            style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--color-border)' }}
          >
            <p className="font-semibold truncate">{p.firstName} {p.lastName}</p>
            <p className="truncate" style={{ color: 'var(--color-text-light)' }}>{p.company}</p>
          </button>
        ))}
        {prospects.length > 3 && (
          <p className="text-xs text-center" style={{ color: 'var(--color-text-light)' }}>+{prospects.length - 3} autres</p>
        )}
      </div>
    </div>
  );
}
