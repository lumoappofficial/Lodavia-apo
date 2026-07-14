import { useApp } from '../contexts/AppContext';
import { authService } from '../services/auth.service';

export function useAuth() {
  const { currentUser, setCurrentUser } = useApp();
  
  return {
    currentUser,
    setCurrentUser,
    login: authService.login,
    signup: authService.signup,
    signInWithGoogle: authService.signInWithGoogle,
    signInWithApple: authService.signInWithApple,
    signInWithPhone: authService.signInWithPhone,
    signInAsGuest: authService.signInAsGuest,
    logout: async () => {
      await authService.logout();
    }
  };
}
