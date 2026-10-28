// 로그인 상태를 앱 전체에 공유하는 Context. 화면에서는 useAuth()로 사용자·권한을 확인합니다.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AppUser } from '../services/types';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (mockUid?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 구독은 앱 전체에서 이 한 곳에서만 합니다.
    const unsubscribe = authService.onAuthStateChanged((next) => {
      setUser(next);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    signIn: async (mockUid) => {
      await authService.signInWithGoogle(mockUid);
    },
    signOut: () => authService.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}
