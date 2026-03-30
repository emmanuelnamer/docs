import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../data/store';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const user = store.login(email, password);
    if (!user) {
      setError('Email non reconnu. Vérifiez vos identifiants.');
      return;
    }
    switch (user.role) {
      case 'prospect': navigate('/client'); break;
      case 'consultant': navigate('/consultant'); break;
      case 'manager': navigate('/manager'); break;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Leads.fr</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Connectez-vous à votre espace</p>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-light)' }}>Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-lg border-2 outline-none transition-colors focus:border-[var(--color-primary)]"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-light)' }}>Mot de passe</label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border-2 outline-none transition-colors focus:border-[var(--color-primary)]"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}>{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold text-lg"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--color-text-light)' }}>
              Comptes de démonstration :
            </p>
            <div className="space-y-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
              <p><strong>Consultant :</strong> thomas@leads.fr</p>
              <p><strong>Consultant :</strong> marie@leads.fr</p>
              <p><strong>Manager :</strong> manager@leads.fr</p>
              <p className="italic">Tout mot de passe est accepté pour la démo.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Faire le diagnostic PVC →
          </button>
        </div>
      </div>
    </div>
  );
}
