import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
      toast.success('Connexion réussie ! Bienvenue.');
      navigate('/app');
    } catch (error) {
      toast.error('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
        <p className="mt-2 text-gray-600">
          Accédez à votre espace de gestion BTP
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="admin@amo-solution.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>

          <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connexion...
            </div>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Créer un compte
          </Link>
        </p>
      </div>

      {/* Demo accounts */}
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-3">🚀 Comptes de Test Disponibles :</p>
          
          <div className="grid gap-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <div>
                <span className="font-medium text-blue-900">admin@demo.com</span>
                <span className="text-blue-700 ml-2">(Administrateur)</span>
              </div>
              <button 
                onClick={() => { setEmail('admin@demo.com'); setPassword('demo123'); }}
                className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200"
              >
                Utiliser
              </button>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <div>
                <span className="font-medium text-green-900">user@demo.com</span>
                <span className="text-green-700 ml-2">(Utilisateur)</span>
              </div>
              <button 
                onClick={() => { setEmail('user@demo.com'); setPassword('demo123'); }}
                className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200"
              >
                Utiliser
              </button>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <div>
                <span className="font-medium text-purple-900">manager@demo.com</span>
                <span className="text-purple-700 ml-2">(Manager)</span>
              </div>
              <button 
                onClick={() => { setEmail('manager@demo.com'); setPassword('demo123'); }}
                className="text-purple-600 hover:text-purple-800 text-xs px-2 py-1 rounded bg-purple-100 hover:bg-purple-200"
              >
                Utiliser
              </button>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <div>
                <span className="font-medium text-orange-900">comptable@demo.com</span>
                <span className="text-orange-700 ml-2">(Comptable)</span>
              </div>
              <button 
                onClick={() => { setEmail('comptable@demo.com'); setPassword('demo123'); }}
                className="text-orange-600 hover:text-orange-800 text-xs px-2 py-1 rounded bg-orange-100 hover:bg-orange-200"
              >
                Utiliser
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-800">
            ✨ <strong>Ou utilisez n'importe quel email + mot de passe</strong> - Un compte sera créé automatiquement !
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;