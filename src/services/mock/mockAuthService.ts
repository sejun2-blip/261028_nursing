// Mock 로그인: 실제 구글 인증 없이 '이름(+이메일)'만 받아 로그인한 것처럼 흉내 냅니다.
// 로그인 상태는 localStorage 에 저장되어 새로고침해도 유지됩니다.

import { isAdminEmail } from '../../config';
import type { User } from '../../types';
import type { AuthService, SignInOptions } from '../types';
import { readJson, removeKey, writeJson } from './storage';

const KEY = 'auth';
const listeners = new Set<(user: User | null) => void>();
let current: User | null = readJson<User | null>(KEY, null);

/** 같은 이메일이면 같은 uid 가 나오도록 해서, 다시 로그인해도 '내 글'로 인식되게 함 */
function uidFromEmail(email: string): string {
  let h = 0;
  for (const ch of email.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return `mock-${(h >>> 0).toString(36)}`;
}

function notify(): void {
  listeners.forEach((cb) => cb(current));
}

export const mockAuthService: AuthService = {
  get currentUser() {
    return current;
  },

  async signIn(options?: SignInOptions) {
    const name = options?.name?.trim();
    if (!name) throw new Error('이름을 입력해 주세요.');
    // 이메일을 비우면 이름으로 시험용 주소를 만듦 (같은 이름 = 같은 사용자)
    const email = (options?.email?.trim() || `${encodeURIComponent(name)}@mock.local`).toLowerCase();
    current = {
      uid: uidFromEmail(email),
      name,
      email,
      role: isAdminEmail(email) ? 'admin' : 'member',
      createdAt: new Date().toISOString(),
    };
    writeJson(KEY, current);
    notify();
    return current;
  },

  async signOut() {
    current = null;
    removeKey(KEY);
    notify();
  },

  onAuthChange(callback) {
    listeners.add(callback);
    // Firebase 와 동일하게, 등록 즉시 현재 상태를 한 번 알려 줌
    callback(current);
    return () => {
      listeners.delete(callback);
    };
  },
};
