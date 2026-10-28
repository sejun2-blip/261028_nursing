// 로그인 상태 공급자: authService 의 상태 변화를 구독해 화면에 반영합니다.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services';
import type { User } from '../types';
import { AuthContext, type AuthContextValue } from './authContextValue';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authService.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return authService.onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: (options) => authService.signIn(options),
      signOut: () => authService.signOut(),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
