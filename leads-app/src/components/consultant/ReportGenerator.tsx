import { useState } from 'react';
import { store } from '../../data/store';
import { Prospect, Audit, Report, ReportContent } from '../../types';

interface Props {
  prospect: Prospect;
  audit: Audit;
  onBack: () => void;
}

function generateReport(prospect: Prospect, audit: Audit): ReportContent {
  const a = audit;
  const budgetPub = parseInt(a.sectionD.readyToInvestPub) || 500;
  const cpl = budgetPub > 1000 ? 3 : 5;
  const leadsEstimated = Math.round(budgetPub / cpl);
  const rdvEstimated = Math.round(leadsEstimated * 0.17);
  const closingRate = parseInt(a.sectionD.objectiveClosingRate) || 30;
  const clientsEstimated = Math.round(rdvEstimated * (closingRate / 100));
  const avgBasket = parseInt(a.sectionB.averageBasket) || 2000;
  const caAdditional = clientsEstimated * avgBasket;
  const ca12m = caAdditional * 12;

  return {
    executiveSummary: `${prospect.firstName} ${prospect.lastName} dirige ${prospect.company} dans le secteur ${prospect.sector}. Avec un score de potentiel PVC de ${prospect.score}/75, l'entreprise présente un potentiel d'optimisation significatif sur son acquisition digitale. L'analyse révèle des opportunités majeures sur ${prospect.scoreByAxis.pub < 10 ? 'la publicité' : prospect.scoreByAxis.vee < 10 ? 'le contenu éducatif' : 'le processus de closing'}, avec un potentiel de CA additionnel estimé à ${caAdditional.toLocaleString('fr-FR')} € par mois.`,
    strengths: [
      a.sectionB.offerProofs ? `Preuves et résultats existants : ${a.sectionB.offerProofs}` : 'Entrepreneur motivé et engagé dans la démarche',
      a.sectionB.methodPillar1 ? `Méthode structurée avec des piliers clairs` : 'Connaissance approfondie de son marché',
      a.sectionB.avatarWho ? `Avatar client identifié : ${a.sectionB.avatarWho}` : 'Offre de service existante',
    ],
    improvements: [
      prospect.scoreByAxis.pub < 15 ? 'Mettre en place une stratégie publicitaire Meta Ads structurée' : 'Optimiser les campagnes publicitaires existantes',
      prospect.scoreByAxis.vee < 15 ? 'Créer une Vidéo Éducative Engageante (VEE) pour éduquer les prospects' : 'Optimiser la VEE existante',
      prospect.scoreByAxis.closing < 15 ? 'Structurer un processus de closing avec qualification pré-RDV' : 'Affiner le script de closing',
    ],
    pvcSystem: {
      pubBlock: `Canal recommandé : Meta Ads (Facebook + Instagram). Cible identifiée : ${a.sectionB.avatarWho || 'à définir'}. Objectif : attirer ${leadsEstimated} leads/mois vers la VEE. Budget de départ recommandé : ${budgetPub} €/mois.`,
      veeBlock: `Sujet de la VEE : ${a.sectionC.mupRealBlock || 'le vrai blocage en acquisition'}. Durée recommandée : 8 à 12 minutes. Structure : Hook → Ciblage (${a.sectionB.avatarWho || 'avatar'}) → 3 piliers (${a.sectionB.methodPillar1 || '...'} / ${a.sectionB.methodPillar2 || '...'} / ${a.sectionB.methodPillar3 || '...'}) → MAI → Offre → CTA. Taux de conversion visé : 15 à 20%.`,
      closingBlock: `Format : appel visio 30 min. Taux de closing cible : ${closingRate}%. Le prospect arrivera éduqué sur ${a.sectionC.mupRealBlock || 'le blocage identifié'} et connaîtra les 3 piliers de la méthode.`,
    },
    projectionTable: {
      budgetPub,
      leadsEstimated,
      rdvEstimated,
      clientsEstimated,
      caAdditional,
      ca12m,
    },
    diagnosticPub: `Axe Publicité — Score : ${prospect.scoreByAxis.pub}/20. ${prospect.scoreByAxis.pub < 10 ? `L'acquisition publicitaire est actuellement inexploitée ou sous-optimisée. Les canaux actuels (${a.sectionC.currentChannels || 'non définis'}) ne permettent pas un flux prévisible. Le budget actuel de ${a.sectionC.currentAdBudget || '0€'} doit être structuré avec une approche Meta Ads ciblée.` : `Des bases publicitaires existent. L'optimisation doit porter sur le ciblage de l'avatar, le testing de multiples hooks, et le suivi du coût par lead.`}`,
    diagnosticVee: `Axe VEE — Score : ${prospect.scoreByAxis.vee}/20. ${prospect.scoreByAxis.vee < 10 ? `Aucun contenu éducatif structuré n'est en place. Les prospects arrivent en RDV sans être éduqués, ce qui allonge le cycle de vente et réduit le taux de conversion. La création d'une VEE est la priorité n°1.` : `Du contenu éducatif existe mais n'est pas optimisé selon la structure VEE. L'ajout d'un hook fort, d'un MAI et d'un CTA structuré augmenterait significativement les conversions.`}`,
    diagnosticClosing: `Axe Closing — Score : ${prospect.scoreByAxis.closing}/20. ${prospect.scoreByAxis.closing < 10 ? `Le processus de vente manque de structure. L'absence de qualification pré-RDV et de script fait perdre du temps sur des profils non qualifiés. La mise en place d'un formulaire de qualification et d'un protocole de closing fluide est indispensable.` : `Le processus de closing est en place. L'optimisation passe par le renforcement de l'inversion de posture et l'intégration systématique de la visio.`}`,
    avatarAnalysis: `Avatar identifié : ${a.sectionB.avatarWho || 'À préciser lors de l\'accompagnement'}. Douleur principale : ${a.sectionB.avatarPain || 'Non identifiée'}. Désir profond : ${a.sectionB.avatarDesire || 'Non identifié'}.`,
    offerAnalysis: `${a.sectionB.offerInOnePhrase || 'L\'offre doit être reformulée en une phrase claire.'}. Score d'offre irrésistible : ${a.sectionC.offerIrresistibleScore || 'Non évalué'}/10.`,
    mupIdentified: a.sectionC.mupRealBlock || 'L\'entrepreneur n\'a pas de système d\'acquisition structuré — il dépend de méthodes chronophages et non prévisibles.',
    musToConstruct: a.sectionC.musUniqueMethod || 'Le système PVC va remplacer les méthodes actuelles par un tunnel automatisé : Publicité ciblée → VEE éducative → Closing qualifié.',
    veeScript: `🎬 HOOK : "Toi qui es ${a.sectionB.avatarWho || '[avatar]'} et qui ${a.sectionB.avatarPain || '[douleur principale]'}, retiens bien ce que je vais te dire..."

👤 CIBLAGE & CRÉDIBILITÉ : "Je m'adresse exactement aux ${a.sectionB.avatarWho || '[avatar]'}. ${a.sectionB.offerProofs ? 'Résultats obtenus : ' + a.sectionB.offerProofs : ''}"

💡 VALEUR PILIER 1 : ${a.sectionB.methodPillar1 || '[À définir]'}

💡 VALEUR PILIER 2 : ${a.sectionB.methodPillar2 || '[À définir]'}

💡 VALEUR PILIER 3 : ${a.sectionB.methodPillar3 || '[À définir]'}

🔒 MAI : "Même si tu appliques ces 3 étapes, tu vas te heurter à ${a.sectionC.mupRealBlock ? 'des obstacles liés à ' + a.sectionC.mupRealBlock : '[obstacles]'}..."

🎯 OFFRE : ${a.sectionB.offerInOnePhrase || '[Offre en une phrase]'}

📞 CTA : "Réserve un audit gratuit de 30 minutes"`,
    adHooks: [
      `${a.sectionB.avatarWho || '[Avatar]'}, tu passes encore ${a.sectionC.mainAcquisitionBrake || '[symptôme du blocage]'} ? Voici pourquoi — et ce que tu peux faire dès cette semaine.`,
      `L'erreur que font 90% des ${a.sectionB.avatarWho || '[avatar]'} sur leur acquisition... ${a.sectionC.mupRealBlock || '[blocage reformulé]'}`,
      `Comment ${a.sectionB.avatarDesire || '[désir profond]'} sans ${a.sectionC.mainAcquisitionBrake || '[frein principal]'} → ${a.sectionC.musUniqueMethod || '[méthode unique]'}`,
    ],
    roadmap90days: [
      'Semaine 1-2 : Finaliser l\'offre et rédiger le script VEE',
      'Semaine 3-4 : Enregistrer la VEE et lancer la campagne Meta test (budget minimal)',
      'Mois 2 : Optimiser les performances publicitaires et le tunnel de conversion',
      'Mois 3 : Scaling progressif — Objectif 10 RDV qualifiés/semaine',
    ],
    consultantNotes: `${audit.notes.keyOpportunity ? 'Opportunité clé : ' + audit.notes.keyOpportunity + '. ' : ''}${audit.notes.freeNotes || ''}`,
  };
}

export default function ReportGenerator({ prospect, audit, onBack }: Props) {
  const existingReport = store.getReportByProspect(prospect.id);
  const [report] = useState<Report>(existingReport || {
    id: 'report-' + Date.now(),
    prospectId: prospect.id,
    auditId: audit.id,
    consultantId: audit.consultantId,
    createdAt: new Date().toISOString(),
    sharedWithProspect: false,
    content: generateReport(prospect, audit),
  });

  if (!existingReport) {
    store.createReport(report);
    store.updateProspect(prospect.id, { reportId: report.id });
  }

  function handleShare() {
    store.updateReport(report.id, { sharedWithProspect: true, sharedAt: new Date().toISOString() });
    onBack();
  }

  const c = report.content;
  const t = c.projectionTable;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-white/70 hover:text-white">← Retour</button>
            <span className="text-lg font-bold text-white">Rapport d'Audit PVC</span>
          </div>
          <div className="flex gap-2">
            {!report.sharedWithProspect && (
              <button onClick={handleShare} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--color-success)' }}>
                Partager au prospect
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Page 1 - Cover */}
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
          <p className="text-sm mb-2 text-white/60">Leads.fr</p>
          <h1 className="text-3xl font-bold mb-4">Rapport d'Audit PVC</h1>
          <p className="text-xl mb-2">{prospect.firstName} {prospect.lastName} — {prospect.company}</p>
          <p className="text-white/70 mb-6">{prospect.sector} — {new Date().toLocaleDateString('fr-FR')}</p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <span className="text-sm">Score de Potentiel PVC</span>
            <span className="text-3xl font-bold">{prospect.score}/75</span>
          </div>
        </div>

        {/* Page 2 - Executive Summary */}
        <ReportSection title="Synthèse Exécutive">
          <p className="mb-4 leading-relaxed">{c.executiveSummary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
              <h4 className="font-semibold mb-2" style={{ color: '#166534' }}>Points Forts</h4>
              <ul className="space-y-1">{c.strengths.map((s, i) => <li key={i} className="text-sm">✓ {s}</li>)}</ul>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF7ED' }}>
              <h4 className="font-semibold mb-2" style={{ color: '#9A3412' }}>Axes de Progression</h4>
              <ul className="space-y-1">{c.improvements.map((s, i) => <li key={i} className="text-sm">→ {s}</li>)}</ul>
            </div>
          </div>
        </ReportSection>

        {/* Page 3 - PVC System */}
        <ReportSection title="Votre Système PVC Personnalisé">
          <p className="mb-6 text-sm" style={{ color: 'var(--color-text-light)' }}>
            Sur la base de votre audit, voici le système PVC adapté à votre activité dans le secteur {prospect.sector}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <PVCBlock letter="P" title="Publicité" color="#3B82F6" content={c.pvcSystem.pubBlock} />
            <PVCBlock letter="V" title="VEE" color="#8B5CF6" content={c.pvcSystem.veeBlock} />
            <PVCBlock letter="C" title="Closing" color="#10B981" content={c.pvcSystem.closingBlock} />
          </div>

          {/* Projection table */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <div className="p-3 font-semibold text-sm" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              Tableau de Projection Personnalisé
            </div>
            <div className="grid grid-cols-6 text-center text-sm">
              {[
                { label: 'Budget Pub', value: `${t.budgetPub} €/mois` },
                { label: 'Leads estimés', value: `${t.leadsEstimated}/mois` },
                { label: 'RDV (×0.17)', value: `${t.rdvEstimated}/mois` },
                { label: 'Clients', value: `${t.clientsEstimated}/mois` },
                { label: 'CA additionnel', value: `${t.caAdditional.toLocaleString('fr-FR')} €/mois` },
                { label: 'Objectif 12 mois', value: `${t.ca12m.toLocaleString('fr-FR')} €` },
              ].map((cell, i) => (
                <div key={i} className="p-3 border-r last:border-r-0" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>{cell.label}</p>
                  <p className="font-bold" style={{ color: 'var(--color-primary)' }}>{cell.value}</p>
                </div>
              ))}
            </div>
          </div>
        </ReportSection>

        {/* Page 4 - Diagnostic */}
        <ReportSection title="Diagnostic par Axe PVC">
          <div className="space-y-4">
            <DiagBlock title="Axe P — Publicité" score={prospect.scoreByAxis.pub} max={20} text={c.diagnosticPub} />
            <DiagBlock title="Axe V — Vidéo Éducative" score={prospect.scoreByAxis.vee} max={20} text={c.diagnosticVee} />
            <DiagBlock title="Axe C — Closing" score={prospect.scoreByAxis.closing} max={20} text={c.diagnosticClosing} />
          </div>
        </ReportSection>

        {/* Page 5 - Offer Analysis */}
        <ReportSection title="Analyse Offre & Positionnement">
          <div className="space-y-3">
            <InfoRow label="Avatar identifié" value={c.avatarAnalysis} />
            <InfoRow label="Analyse de l'offre" value={c.offerAnalysis} />
            <InfoRow label="MUP identifié" value={c.mupIdentified} />
            <InfoRow label="MUS à construire" value={c.musToConstruct} />
          </div>
        </ReportSection>

        {/* Page 6 - VEE Script */}
        <ReportSection title="Script VEE Pré-rempli">
          <pre className="whitespace-pre-wrap text-sm p-4 rounded-lg leading-relaxed" style={{ backgroundColor: '#F8FAFC' }}>
            {c.veeScript}
          </pre>
        </ReportSection>

        {/* Page 7 - Ad Hooks */}
        <ReportSection title="Exemples d'Accroches Publicitaires">
          <div className="space-y-3">
            {c.adHooks.map((hook, i) => (
              <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>Hook {i + 1}</p>
                <p className="text-sm italic">"{hook}"</p>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Page 8 - Roadmap */}
        <ReportSection title="Feuille de Route 90 Jours">
          <div className="space-y-3">
            {c.roadmap90days.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                  {i + 1}
                </span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Page 9 - Consultant Notes */}
        <ReportSection title="Observations du Consultant">
          <p className="text-sm leading-relaxed">{c.consultantNotes || 'Aucune note ajoutée.'}</p>
        </ReportSection>
      </main>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{title}</h2>
      {children}
    </div>
  );
}

function PVCBlock({ letter, title, color, content }: { letter: string; title: string; color: string; content: string }) {
  return (
    <div className="rounded-xl p-4" style={{ border: `2px solid ${color}` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: color }}>
          {letter}
        </span>
        <span className="font-bold" style={{ color }}>{title}</span>
      </div>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function DiagBlock({ title, score, max, text }: { title: string; score: number; max: number; text: string }) {
  const pct = (score / max) * 100;
  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{title}</span>
        <span className="font-bold text-sm">{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full mb-3" style={{ backgroundColor: '#E2E8F0' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct < 33 ? '#EF4444' : pct < 66 ? '#F59E0B' : '#10B981' }} />
      </div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
