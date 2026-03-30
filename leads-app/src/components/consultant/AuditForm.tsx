import { useState } from 'react';
import { store } from '../../data/store';
import { Prospect, Audit } from '../../types';

interface Props {
  prospect: Prospect;
  consultantId: string;
  existingAudit?: Audit;
  onBack: () => void;
}

export default function AuditForm({ prospect, consultantId, existingAudit, onBack }: Props) {
  const [audit, setAudit] = useState<Audit>(existingAudit || {
    id: 'audit-' + Date.now(),
    prospectId: prospect.id,
    consultantId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'in-progress',
    sectionA: { dateCreation: '', nbEmployees: '', mainActivity: '', geoZone: '', currentRevenue: '' },
    sectionB: { offerDescription: '', avatarWho: '', avatarPain: '', avatarDesire: '', averageBasket: '', offerInOnePhrase: '', offerProofs: '', methodPillar1: '', methodPillar2: '', methodPillar3: '' },
    sectionC: { currentChannels: '', currentAdBudget: '', hasVideoContent: '', currentLeadsPerMonth: '', currentConversionRate: '', mainAcquisitionBrake: '', mupRealBlock: '', musUniqueMethod: '', offerIrresistibleScore: '' },
    sectionD: { objectiveCA12m: '', objectiveLeadsMonth: '', objectiveClosingRate: '', readyToInvestPub: '', readyToRecord: '', biggestFear: '', deepMotivation: '' },
    notes: { keyOpportunity: '', freeNotes: '' },
  });

  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C' | 'D' | 'notes'>('A');

  function updateSection<K extends keyof Audit>(section: K, field: string, value: string) {
    setAudit(prev => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, string>), [field]: value },
      updatedAt: new Date().toISOString(),
    }));
  }

  function handleSave(complete = false) {
    const updated = { ...audit, status: complete ? 'completed' as const : 'in-progress' as const };
    if (existingAudit) {
      store.updateAudit(audit.id, updated);
    } else {
      store.createAudit(updated);
      store.updateProspect(prospect.id, { auditId: audit.id });
    }
    onBack();
  }

  const sections: { key: typeof activeSection; label: string }[] = [
    { key: 'A', label: 'Portrait' },
    { key: 'B', label: 'Offre & Positionnement' },
    { key: 'C', label: 'Acquisition' },
    { key: 'D', label: 'Objectifs' },
    { key: 'notes', label: 'Notes' },
  ];

  const inputClass = "w-full p-3 rounded-lg border-2 outline-none transition-colors focus:border-[var(--color-primary)] text-sm";

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-white/70 hover:text-white">← Retour</button>
            <span className="text-lg font-bold text-white">
              Audit — {prospect.firstName} {prospect.lastName}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/20 hover:bg-white/30"
            >
              Sauvegarder
            </button>
            <button
              onClick={() => handleSave(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-success)' }}
            >
              Finaliser l'audit
            </button>
          </div>
        </div>
        {/* Section tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
              style={{
                backgroundColor: activeSection === s.key ? 'var(--color-bg)' : 'transparent',
                color: activeSection === s.key ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>

          {activeSection === 'A' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Section A — Portrait de l'entreprise</h3>
              <Field label="Date de création de l'entreprise" value={audit.sectionA.dateCreation} onChange={v => updateSection('sectionA', 'dateCreation', v)} input={inputClass} />
              <Field label="Nombre d'employés" value={audit.sectionA.nbEmployees} onChange={v => updateSection('sectionA', 'nbEmployees', v)} input={inputClass} />
              <Field label="Activité principale" value={audit.sectionA.mainActivity} onChange={v => updateSection('sectionA', 'mainActivity', v)} input={inputClass} />
              <Field label="Zone géographique couverte" value={audit.sectionA.geoZone} onChange={v => updateSection('sectionA', 'geoZone', v)} input={inputClass} />
              <Field label="CA actuel" value={audit.sectionA.currentRevenue} onChange={v => updateSection('sectionA', 'currentRevenue', v)} input={inputClass} />
            </div>
          )}

          {activeSection === 'B' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Section B — Offre & Positionnement</h3>
              <FieldArea label="Description de l'offre principale" value={audit.sectionB.offerDescription} onChange={v => updateSection('sectionB', 'offerDescription', v)} input={inputClass} />
              <Field label="Avatar : Qui est votre client idéal ?" value={audit.sectionB.avatarWho} onChange={v => updateSection('sectionB', 'avatarWho', v)} input={inputClass} />
              <Field label="Quelle est sa douleur principale ?" value={audit.sectionB.avatarPain} onChange={v => updateSection('sectionB', 'avatarPain', v)} input={inputClass} />
              <Field label="Quel est son désir profond ?" value={audit.sectionB.avatarDesire} onChange={v => updateSection('sectionB', 'avatarDesire', v)} input={inputClass} />
              <Field label="Panier moyen (€)" value={audit.sectionB.averageBasket} onChange={v => updateSection('sectionB', 'averageBasket', v)} input={inputClass} />
              <FieldArea label="Offre résumée en une phrase" value={audit.sectionB.offerInOnePhrase} onChange={v => updateSection('sectionB', 'offerInOnePhrase', v)} input={inputClass} />
              <FieldArea label="Preuves et résultats obtenus" value={audit.sectionB.offerProofs} onChange={v => updateSection('sectionB', 'offerProofs', v)} input={inputClass} />
              <Field label="Pilier 1 de votre méthode" value={audit.sectionB.methodPillar1} onChange={v => updateSection('sectionB', 'methodPillar1', v)} input={inputClass} />
              <Field label="Pilier 2 de votre méthode" value={audit.sectionB.methodPillar2} onChange={v => updateSection('sectionB', 'methodPillar2', v)} input={inputClass} />
              <Field label="Pilier 3 de votre méthode" value={audit.sectionB.methodPillar3} onChange={v => updateSection('sectionB', 'methodPillar3', v)} input={inputClass} />
            </div>
          )}

          {activeSection === 'C' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Section C — Acquisition actuelle</h3>
              <Field label="Canaux d'acquisition actuels" value={audit.sectionC.currentChannels} onChange={v => updateSection('sectionC', 'currentChannels', v)} input={inputClass} />
              <Field label="Budget publicitaire mensuel actuel" value={audit.sectionC.currentAdBudget} onChange={v => updateSection('sectionC', 'currentAdBudget', v)} input={inputClass} />
              <Field label="Contenu vidéo existant ?" value={audit.sectionC.hasVideoContent} onChange={v => updateSection('sectionC', 'hasVideoContent', v)} input={inputClass} />
              <Field label="Nombre de leads/mois actuels" value={audit.sectionC.currentLeadsPerMonth} onChange={v => updateSection('sectionC', 'currentLeadsPerMonth', v)} input={inputClass} />
              <Field label="Taux de conversion actuel" value={audit.sectionC.currentConversionRate} onChange={v => updateSection('sectionC', 'currentConversionRate', v)} input={inputClass} />
              <FieldArea label="Principal frein à l'acquisition" value={audit.sectionC.mainAcquisitionBrake} onChange={v => updateSection('sectionC', 'mainAcquisitionBrake', v)} input={inputClass} />
              <FieldArea label="MUP — Le vrai blocage" value={audit.sectionC.mupRealBlock} onChange={v => updateSection('sectionC', 'mupRealBlock', v)} input={inputClass} />
              <FieldArea label="MUS — Méthode unique de la solution" value={audit.sectionC.musUniqueMethod} onChange={v => updateSection('sectionC', 'musUniqueMethod', v)} input={inputClass} />
              <Field label="Score d'offre irrésistible (1-10)" value={audit.sectionC.offerIrresistibleScore} onChange={v => updateSection('sectionC', 'offerIrresistibleScore', v)} input={inputClass} />
            </div>
          )}

          {activeSection === 'D' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Section D — Objectifs & Ambition</h3>
              <Field label="Objectif CA 12 mois" value={audit.sectionD.objectiveCA12m} onChange={v => updateSection('sectionD', 'objectiveCA12m', v)} input={inputClass} />
              <Field label="Objectif leads/mois" value={audit.sectionD.objectiveLeadsMonth} onChange={v => updateSection('sectionD', 'objectiveLeadsMonth', v)} input={inputClass} />
              <Field label="Objectif taux de closing (%)" value={audit.sectionD.objectiveClosingRate} onChange={v => updateSection('sectionD', 'objectiveClosingRate', v)} input={inputClass} />
              <Field label="Prêt à investir en pub ? (Budget envisagé)" value={audit.sectionD.readyToInvestPub} onChange={v => updateSection('sectionD', 'readyToInvestPub', v)} input={inputClass} />
              <Field label="Prêt à enregistrer une VEE ?" value={audit.sectionD.readyToRecord} onChange={v => updateSection('sectionD', 'readyToRecord', v)} input={inputClass} />
              <FieldArea label="Plus grande peur / frein" value={audit.sectionD.biggestFear} onChange={v => updateSection('sectionD', 'biggestFear', v)} input={inputClass} />
              <FieldArea label="Motivation profonde" value={audit.sectionD.deepMotivation} onChange={v => updateSection('sectionD', 'deepMotivation', v)} input={inputClass} />
            </div>
          )}

          {activeSection === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Notes du Consultant</h3>
              <FieldArea label="Opportunité clé identifiée" value={audit.notes.keyOpportunity} onChange={v => updateSection('notes', 'keyOpportunity', v)} input={inputClass} />
              <FieldArea label="Notes libres (observations, personnalité, freins, contexte)" value={audit.notes.freeNotes} onChange={v => updateSection('notes', 'freeNotes', v)} input={inputClass} rows={8} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, input }: { label: string; value: string; onChange: (v: string) => void; input: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-light)' }}>{label}</label>
      <input className={input} style={{ borderColor: 'var(--color-border)' }} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function FieldArea({ label, value, onChange, input, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; input: string; rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-light)' }}>{label}</label>
      <textarea className={input} style={{ borderColor: 'var(--color-border)' }} value={value} onChange={e => onChange(e.target.value)} rows={rows} />
    </div>
  );
}
