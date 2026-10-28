// 어느 화면에서든 로그인 정보를 꺼내 쓰는 도우미
import { useContext } from 'react';
import { AuthContext } from '../context/authContextValue';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}
