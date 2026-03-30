import { useState } from 'react';
import { store } from '../../data/store';
import { Prospect, Audit, ProspectStage } from '../../types';
import AuditForm from './AuditForm';
import ReportGenerator from './ReportGenerator';

interface Props {
  prospectId: string;
  onBack: () => void;
  consultantId: string;
}

export default function ProspectDetail({ prospectId, onBack, consultantId }: Props) {
  const [prospect, setProspect] = useState<Prospect>(store.getProspect(prospectId)!);
  const [showAudit, setShowAudit] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rdvForm, setRdvForm] = useState({ date: '', time: '', type: '' as string });

  if (!prospect) return null;

  const audit = store.getAuditByProspect(prospectId);
  const report = store.getReportByProspect(prospectId);

  function scheduleRDV(type: 'rdv1' | 'rdv2' | 'rdv3') {
    setRdvForm({ date: '', time: '', type });
  }

  function confirmRDV() {
    if (!rdvForm.date || !rdvForm.time || !rdvForm.type) return;
    const rdv = {
      id: 'rdv-' + Date.now(),
      date: rdvForm.date,
      time: rdvForm.time,
      type: rdvForm.type as 'rdv1' | 'rdv2' | 'rdv3',
      status: 'scheduled' as const,
    };
    const updates: Partial<Prospect> = {
      [rdvForm.type]: rdv,
      stage: (rdvForm.type + '-pending') as ProspectStage,
    };
    store.updateProspect(prospectId, updates);
    setProspect(store.getProspect(prospectId)!);
    setRdvForm({ date: '', time: '', type: '' });
  }

  function markRDVDone(type: 'rdv1' | 'rdv2' | 'rdv3') {
    const rdv = prospect[type];
    if (!rdv) return;
    const updates: Partial<Prospect> = {
      [type]: { ...rdv, status: 'done' },
      stage: (type + '-done') as ProspectStage,
    };
    store.updateProspect(prospectId, updates);
    setProspect(store.getProspect(prospectId)!);
  }

  function markConverted() {
    store.updateProspect(prospectId, { stage: 'converted' });
    setProspect(store.getProspect(prospectId)!);
  }

  function shareReport() {
    if (report) {
      store.updateReport(report.id, { sharedWithProspect: true, sharedAt: new Date().toISOString() });
    }
  }

  function getScoreColor(score: number) {
    if (score <= 20) return '#EF4444';
    if (score <= 40) return '#F59E0B';
    if (score <= 60) return '#3B82F6';
    return '#10B981';
  }

  if (showAudit) {
    return (
      <AuditForm
        prospect={prospect}
        consultantId={consultantId}
        existingAudit={audit}
        onBack={() => { setShowAudit(false); setProspect(store.getProspect(prospectId)!); }}
      />
    );
  }

  if (showReport) {
    return (
      <ReportGenerator
        prospect={prospect}
        audit={audit!}
        onBack={() => { setShowReport(false); setProspect(store.getProspect(prospectId)!); }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-white/70 hover:text-white">← Retour</button>
          <span className="text-xl font-bold text-white">
            {prospect.firstName} {prospect.lastName}
          </span>
          <span className="text-sm px-2 py-0.5 rounded text-white/70 bg-white/10">{prospect.company}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Score PVC</p>
            <p className="text-2xl font-bold" style={{ color: getScoreColor(prospect.score) }}>
              {prospect.score}/75
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Secteur</p>
            <p className="font-semibold">{prospect.sector || '—'}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>CA Actuel</p>
            <p className="font-semibold">{prospect.revenue || '—'}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Email / Téléphone</p>
            <p className="text-sm font-medium">{prospect.email}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{prospect.phone}</p>
          </div>
        </div>

        {/* Score by axis */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Score par Axe</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'pub', label: 'Publicité', max: 20 },
              { key: 'vee', label: 'VEE', max: 20 },
              { key: 'closing', label: 'Closing', max: 20 },
              { key: 'predictability', label: 'Prédictibilité', max: 15 },
            ].map(axis => {
              const val = prospect.scoreByAxis[axis.key as keyof typeof prospect.scoreByAxis];
              const pct = (val / axis.max) * 100;
              return (
                <div key={axis.key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{axis.label}</span>
                    <span className="text-sm font-bold">{val}/{axis.max}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct < 33 ? '#EF4444' : pct < 66 ? '#F59E0B' : '#10B981' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RDV Management */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Rendez-vous</h3>
            {(['rdv1', 'rdv2', 'rdv3'] as const).map(type => {
              const rdv = prospect[type];
              const labels = { rdv1: 'RDV 1 — Audit', rdv2: 'RDV 2 — Rapport', rdv3: 'RDV 3 — Offre' };
              return (
                <div key={type} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                  <p className="text-sm font-semibold mb-1">{labels[type]}</p>
                  {rdv ? (
                    <div>
                      <p className="text-sm">{rdv.date} à {rdv.time}</p>
                      <p className="text-xs" style={{ color: rdv.status === 'done' ? 'var(--color-success)' : 'var(--color-accent)' }}>
                        {rdv.status === 'done' ? '✓ Réalisé' : 'Planifié'}
                      </p>
                      {rdv.status === 'scheduled' && (
                        <button
                          onClick={() => markRDVDone(type)}
                          className="mt-1 text-xs px-2 py-1 rounded text-white"
                          style={{ backgroundColor: 'var(--color-success)' }}
                        >
                          Marquer réalisé
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => scheduleRDV(type)}
                      className="text-xs px-3 py-1 rounded-lg font-medium"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      Planifier
                    </button>
                  )}
                </div>
              );
            })}

            {/* RDV scheduling modal */}
            {rdvForm.type && (
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <p className="text-sm font-semibold mb-2">Planifier le rendez-vous</p>
                <input
                  type="date"
                  className="w-full p-2 rounded border mb-2 text-sm"
                  value={rdvForm.date}
                  onChange={e => setRdvForm({ ...rdvForm, date: e.target.value })}
                />
                <input
                  type="time"
                  className="w-full p-2 rounded border mb-2 text-sm"
                  value={rdvForm.time}
                  onChange={e => setRdvForm({ ...rdvForm, time: e.target.value })}
                />
                <div className="flex gap-2">
                  <button onClick={confirmRDV} className="text-xs px-3 py-1 rounded text-white" style={{ backgroundColor: 'var(--color-success)' }}>
                    Confirmer
                  </button>
                  <button onClick={() => setRdvForm({ date: '', time: '', type: '' })} className="text-xs px-3 py-1 rounded" style={{ backgroundColor: '#E2E8F0' }}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Audit */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Audit</h3>
            {audit ? (
              <div>
                <p className="text-sm mb-2">
                  Statut : <span className="font-semibold" style={{ color: audit.status === 'completed' ? 'var(--color-success)' : 'var(--color-accent)' }}>
                    {audit.status === 'completed' ? 'Finalisé' : 'En cours'}
                  </span>
                </p>
                <button
                  onClick={() => setShowAudit(true)}
                  className="text-sm px-4 py-2 rounded-lg font-medium text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {audit.status === 'completed' ? 'Voir l\'audit' : 'Continuer l\'audit'}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
                  Aucun audit démarré.
                </p>
                <button
                  onClick={() => setShowAudit(true)}
                  className="text-sm px-4 py-2 rounded-lg font-medium text-white"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  Démarrer l'audit
                </button>
              </div>
            )}
          </div>

          {/* Report */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Rapport</h3>
            {report ? (
              <div>
                <p className="text-sm mb-2">Rapport généré le {new Date(report.createdAt).toLocaleDateString('fr-FR')}</p>
                <p className="text-sm mb-3">
                  Partagé : <span style={{ color: report.sharedWithProspect ? 'var(--color-success)' : 'var(--color-text-light)' }}>
                    {report.sharedWithProspect ? 'Oui' : 'Non'}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReport(true)}
                    className="text-xs px-3 py-1 rounded-lg text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Voir
                  </button>
                  {!report.sharedWithProspect && (
                    <button
                      onClick={shareReport}
                      className="text-xs px-3 py-1 rounded-lg text-white"
                      style={{ backgroundColor: 'var(--color-success)' }}
                    >
                      Partager au prospect
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {audit?.status === 'completed' ? (
                  <button
                    onClick={() => setShowReport(true)}
                    className="text-sm px-4 py-2 rounded-lg font-medium text-white"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    Générer le rapport
                  </button>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                    Finalisez l'audit pour générer le rapport.
                  </p>
                )}
              </div>
            )}

            {/* Convert button */}
            {prospect.stage === 'rdv3-done' && (
              <button
                onClick={markConverted}
                className="mt-4 w-full text-sm px-4 py-2 rounded-lg font-bold text-white"
                style={{ backgroundColor: 'var(--color-success)' }}
              >
                Marquer comme converti
              </button>
            )}
          </div>
        </div>

        {/* Pre-audit answers */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Réponses Pré-Audit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(prospect.scoringAnswers).map(([qId, score]) => (
              <div key={qId} className="text-sm p-2 rounded" style={{ backgroundColor: '#F8FAFC' }}>
                <span className="font-medium">{qId}</span>: <span className="font-bold">{score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
