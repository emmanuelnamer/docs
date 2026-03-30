import { Prospect } from '../../types';

interface Props {
  prospects: Prospect[];
  onSelect: (id: string) => void;
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

const stageColors: Record<string, string> = {
  'pre-audit': '#64748B',
  'rdv1-pending': '#3B82F6',
  'rdv1-done': '#8B5CF6',
  'rdv2-pending': '#F59E0B',
  'rdv2-done': '#F97316',
  'rdv3-pending': '#EC4899',
  'rdv3-done': '#6366F1',
  'converted': '#10B981',
  'lost': '#EF4444',
};

export default function ProspectList({ prospects, onSelect }: Props) {
  if (prospects.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <p style={{ color: 'var(--color-text-light)' }}>Aucun prospect pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="font-bold" style={{ color: 'var(--color-primary)' }}>Tous les Prospects ({prospects.length})</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC' }}>
            <th className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Nom</th>
            <th className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Entreprise</th>
            <th className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Score</th>
            <th className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Étape</th>
            <th className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--color-text-light)' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {prospects.map(p => (
            <tr
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="cursor-pointer hover:bg-blue-50/50 transition-colors border-t"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <td className="p-3">
                <span className="font-medium">{p.firstName} {p.lastName}</span>
              </td>
              <td className="p-3 text-sm" style={{ color: 'var(--color-text-light)' }}>{p.company}</td>
              <td className="p-3">
                <span className="font-bold text-sm">{p.score}/75</span>
              </td>
              <td className="p-3">
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: stageColors[p.stage] + '20', color: stageColors[p.stage] }}
                >
                  {stageLabels[p.stage] || p.stage}
                </span>
              </td>
              <td className="p-3 text-sm" style={{ color: 'var(--color-text-light)' }}>
                {new Date(p.createdAt).toLocaleDateString('fr-FR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
