import { useState } from 'react';

interface Props {
  onSubmit: (info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    sector: string;
    revenue: string;
  }) => void;
}

export default function InfoCollect({ onSubmit }: Props) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    sector: '',
    revenue: '',
  });

  const sectors = [
    'Coaching & Formation', 'Consulting', 'Agence digitale', 'Immobilier',
    'Rénovation & BTP', 'Bien-être & Santé', 'SaaS & Tech', 'E-commerce',
    'Profession libérale', 'Restauration', 'Automobile', 'Autre',
  ];

  const revenues = [
    'Moins de 50 000 €', '50 000 à 100 000 €', '100 000 à 300 000 €',
    '300 000 à 500 000 €', '500 000 à 1 000 000 €', 'Plus de 1 000 000 €',
  ];

  const valid = form.firstName && form.lastName && form.email && form.phone && form.company && form.sector;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (valid) onSubmit(form);
  }

  const inputStyle = "w-full p-3 rounded-lg border-2 outline-none transition-colors focus:border-[var(--color-primary)]";

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
        Dernière étape avant vos résultats
      </h2>
      <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
        Renseignez vos informations pour accéder à votre score de potentiel PVC personnalisé et créer votre espace client.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            className={inputStyle}
            style={{ borderColor: 'var(--color-border)' }}
            placeholder="Prénom *"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
          />
          <input
            className={inputStyle}
            style={{ borderColor: 'var(--color-border)' }}
            placeholder="Nom *"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <input
          className={inputStyle}
          style={{ borderColor: 'var(--color-border)' }}
          type="email"
          placeholder="Email professionnel *"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className={inputStyle}
          style={{ borderColor: 'var(--color-border)' }}
          type="tel"
          placeholder="Téléphone *"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className={inputStyle}
          style={{ borderColor: 'var(--color-border)' }}
          placeholder="Nom de l'entreprise *"
          value={form.company}
          onChange={e => setForm({ ...form, company: e.target.value })}
        />
        <select
          className={inputStyle}
          style={{ borderColor: 'var(--color-border)' }}
          value={form.sector}
          onChange={e => setForm({ ...form, sector: e.target.value })}
        >
          <option value="">Secteur d'activité *</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className={inputStyle}
          style={{ borderColor: 'var(--color-border)' }}
          value={form.revenue}
          onChange={e => setForm({ ...form, revenue: e.target.value })}
        >
          <option value="">Chiffre d'affaires annuel</option>
          {revenues.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
          En soumettant ce formulaire, vous acceptez notre politique de confidentialité conforme au RGPD.
        </p>
        <button
          type="submit"
          disabled={!valid}
          className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all"
          style={{
            backgroundColor: valid ? 'var(--color-accent)' : '#CBD5E1',
            cursor: valid ? 'pointer' : 'not-allowed',
          }}
        >
          Découvrir mon score de potentiel
        </button>
      </form>
    </div>
  );
}
