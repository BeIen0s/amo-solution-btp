import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useInitializeAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulation de vérification du token au démarrage
    // Dans la vraie version, on vérifierait le JWT stocké
    setTimeout(() => {
      setIsInitialized(true);
    }, 500);
  }, []);

  return { isInitialized };
};

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser
  };
};