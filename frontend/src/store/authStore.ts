import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

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

    // Simulation d'authentification - à remplacer par l'API réelle
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          email: email,
          name: 'Utilisateur Démo',
          role: 'admin'
        };
        
        set({
          user: mockUser,
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