import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../data/store';
import { Prospect } from '../../types';
import ClientTimeline from './ClientTimeline';
import ClientDocuments from './ClientDocuments';
import ClientResources from './ClientResources';

type Tab = 'dashboard' | 'documents' | 'resources';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  const [tab, setTab] = useState<Tab>('dashboard');

  if (!user || user.role !== 'prospect') {
    navigate('/login');
    return null;
  }

  const prospect = store.getProspect(user.id);
  if (!prospect) {
    navigate('/');
    return null;
  }

  const consultant = prospect.consultantId ? store.getConsultant(prospect.consultantId) : null;

  function handleLogout() {
    store.logout();
    navigate('/login');
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Tableau de bord' },
    { key: 'documents', label: 'Mes Documents' },
    { key: 'resources', label: 'Ressources' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="shadow-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white">Leads.fr</span>
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">
              {prospect.firstName} {prospect.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              Déconnexion
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
              style={{
                backgroundColor: tab === t.key ? 'var(--color-bg)' : 'transparent',
                color: tab === t.key ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        {tab === 'dashboard' && (
          <DashboardView prospect={prospect} consultant={consultant} />
        )}
        {tab === 'documents' && (
          <ClientDocuments prospect={prospect} />
        )}
        {tab === 'resources' && (
          <ClientResources />
        )}
      </main>
    </div>
  );
}

function DashboardView({ prospect, consultant }: { prospect: Prospect; consultant: any }) {
  const report = store.getReportByProspect(prospect.id);

  function getScoreColor(score: number) {
    if (score <= 20) return '#EF4444';
    if (score <= 40) return '#F59E0B';
    if (score <= 60) return '#3B82F6';
    return '#10B981';
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
          Bienvenue, {prospect.firstName} !
        </h1>
        <p style={{ color: 'var(--color-text-light)' }}>
          Voici le suivi de votre parcours d'audit PVC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score card */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-light)' }}>Score de Potentiel PVC</h3>
          <div className="flex items-center gap-4">
            <div className="relative" style={{ width: 80, height: 80 }}>
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke={getScoreColor(prospect.score)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(prospect.score / 75) * 201} 201`}
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{prospect.score}</span>
              </div>
            </div>
            <div>
              <p className="font-semibold" style={{ color: getScoreColor(prospect.score) }}>
                {prospect.score <= 20 ? 'Inexploité' : prospect.score <= 40 ? 'En Construction' : prospect.score <= 60 ? 'Intermédiaire' : 'Avancé'}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>sur 75 points</p>
            </div>
          </div>
        </div>

        {/* Consultant */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-light)' }}>Votre Consultant</h3>
          {consultant ? (
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
                {consultant.firstName} {consultant.lastName}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{consultant.email}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-light)' }}>Attribution en cours...</p>
          )}
        </div>

        {/* Stage */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-light)' }}>Étape Actuelle</h3>
          <p className="font-bold text-lg" style={{ color: 'var(--color-accent)' }}>
            {getStageLabel(prospect.stage)}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
            {getStageDescription(prospect.stage)}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <h3 className="font-semibold mb-6" style={{ color: 'var(--color-primary)' }}>Votre Parcours</h3>
        <ClientTimeline prospect={prospect} />
      </div>

      {/* Report CTA */}
      {report && report.sharedWithProspect && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
          <h3 className="text-xl font-bold mb-2">Votre rapport d'audit est disponible !</h3>
          <p className="text-white/80 mb-4">
            Votre consultant a finalisé l'analyse de votre situation. Consultez votre rapport personnalisé.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-bold"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Consulter mon rapport
          </button>
        </div>
      )}
    </div>
  );
}

function getStageLabel(stage: string) {
  const labels: Record<string, string> = {
    'pre-audit': 'Diagnostic complété',
    'rdv1-pending': 'RDV 1 planifié',
    'rdv1-done': 'Audit en cours',
    'rdv2-pending': 'RDV 2 planifié',
    'rdv2-done': 'Rapport disponible',
    'rdv3-pending': 'RDV 3 planifié',
    'rdv3-done': 'Décision',
    'converted': 'Client accompagné',
    'lost': 'Non converti',
  };
  return labels[stage] || stage;
}

function getStageDescription(stage: string) {
  const desc: Record<string, string> = {
    'pre-audit': 'Votre consultant va prendre contact avec vous pour planifier votre premier rendez-vous.',
    'rdv1-pending': 'Préparez-vous ! Votre consultant va réaliser un audit complet de votre situation.',
    'rdv1-done': 'Votre consultant prépare votre rapport d\'audit personnalisé.',
    'rdv2-pending': 'Votre rapport est prêt. Il vous sera présenté lors du prochain rendez-vous.',
    'rdv2-done': 'Vous avez consulté votre rapport. Un dernier RDV pour discuter de la suite.',
    'rdv3-pending': 'Dernier rendez-vous pour présenter le plan d\'action et l\'offre d\'accompagnement.',
    'rdv3-done': 'Merci pour votre temps !',
    'converted': 'Bienvenue dans l\'accompagnement Leads.fr !',
    'lost': '',
  };
  return desc[stage] || '';
}
