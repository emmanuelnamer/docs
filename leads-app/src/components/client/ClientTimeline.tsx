import { Prospect } from '../../types';

interface Props {
  prospect: Prospect;
}

const stages = [
  { key: 'pre-audit', label: 'Diagnostic', icon: '1' },
  { key: 'rdv1', label: 'RDV 1 — Audit', icon: '2' },
  { key: 'rdv2', label: 'RDV 2 — Rapport', icon: '3' },
  { key: 'rdv3', label: 'RDV 3 — Offre', icon: '4' },
  { key: 'converted', label: 'Accompagnement', icon: '5' },
];

function getStageIndex(stage: string): number {
  if (stage === 'pre-audit') return 0;
  if (stage.startsWith('rdv1')) return 1;
  if (stage.startsWith('rdv2')) return 2;
  if (stage.startsWith('rdv3')) return 3;
  if (stage === 'converted') return 4;
  return 0;
}

export default function ClientTimeline({ prospect }: Props) {
  const currentIndex = getStageIndex(prospect.stage);

  return (
    <div className="flex items-center">
      {stages.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
              style={{
                backgroundColor: i <= currentIndex ? 'var(--color-primary)' : '#E2E8F0',
                color: i <= currentIndex ? 'white' : 'var(--color-text-light)',
              }}
            >
              {i < currentIndex ? '✓' : s.icon}
            </div>
            <span
              className="text-xs mt-2 text-center font-medium"
              style={{ color: i <= currentIndex ? 'var(--color-primary)' : 'var(--color-text-light)' }}
            >
              {s.label}
            </span>
          </div>
          {i < stages.length - 1 && (
            <div
              className="flex-1 h-1 mx-2 rounded-full"
              style={{
                backgroundColor: i < currentIndex ? 'var(--color-primary)' : '#E2E8F0',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
