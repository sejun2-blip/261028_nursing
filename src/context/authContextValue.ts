// 로그인 상태를 앱 전체에 나눠 주는 '통로'(Context) 정의
// (화면 새로고침 기능과 충돌하지 않도록 Provider 컴포넌트와 파일을 분리)
import { createContext } from 'react';
import type { SignInOptions } from '../services';
import type { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  /** 첫 로그인 상태 확인이 끝나기 전에는 true (깜빡임 방지) */
  loading: boolean;
  signIn: (options?: SignInOptions) => Promise<User>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
