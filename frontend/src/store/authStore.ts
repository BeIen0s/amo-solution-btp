import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  permissions?: string[];
}

// Comptes de test prédéfinis
const TEST_ACCOUNTS = {
  'admin@demo.com': {
    id: '1',
    email: 'admin@demo.com',
    name: 'Admin Démonstration',
    role: 'admin',
    company: 'A.M.O Solution BTP',
    permissions: ['all']
  },
  'user@demo.com': {
    id: '2', 
    email: 'user@demo.com',
    name: 'Utilisateur Test',
    role: 'user',
    company: 'Entreprise Test',
    permissions: ['read', 'write']
  },
  'manager@demo.com': {
    id: '3',
    email: 'manager@demo.com', 
    name: 'Manager Commercial',
    role: 'manager',
    company: 'BTP Solutions',
    permissions: ['read', 'write', 'manage']
  },
  'comptable@demo.com': {
    id: '4',
    email: 'comptable@demo.com',
    name: 'Comptable Expert',
    role: 'comptable',
    company: 'Cabinet Comptable',
    permissions: ['read', 'invoices', 'reports']
  }
} as const;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    // Simulation d'authentification avec comptes prédéfinis
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Vérifier si c'est un compte de test prédéfini
        const testAccount = TEST_ACCOUNTS[email as keyof typeof TEST_ACCOUNTS];
        
        let user: User;
        
        if (testAccount) {
          // Utiliser le compte prédéfini
          user = testAccount;
        } else {
          // Créer un compte générique pour tout autre email
          user = {
            id: Date.now().toString(),
            email: email,
            name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            role: 'user',
            company: 'Entreprise Démo',
            permissions: ['read', 'write']
          };
        }
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        resolve();
      }, 1000);
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  }
}));