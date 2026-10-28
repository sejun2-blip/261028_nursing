// 로그인 서비스: 화면은 AuthService 인터페이스만 사용하고, 현재는 mock 구현을 내보냅니다.
// 다음 단계에서 mockAuthService 대신 Firebase Authentication(Google 로그인) 구현으로 교체합니다.
import { MOCK_USERS } from './mockData';
import type { AppUser } from './types';

export interface AuthService {
  /** mock 모드 여부 (true이면 로그인 화면에 임시 계정 선택 버튼 표시) */
  readonly isMock: boolean;
  /** mock 모드에서 고를 수 있는 임시 계정 목록 (Firebase 구현에서는 빈 배열) */
  getMockAccounts(): AppUser[];
  /** Google 로그인. mock 모드에서는 mockUid로 임시 계정을 선택합니다. */
  signInWithGoogle(mockUid?: string): Promise<AppUser>;
  signOut(): Promise<void>;
  /** 로그인 상태 변화를 구독. 반환값을 호출하면 구독 해제 */
  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void;
}

const STORAGE_KEY = 'nursing-archive:mock-auth-uid';

function readStoredUser(): AppUser | null {
  try {
    const uid = localStorage.getItem(STORAGE_KEY);
    return MOCK_USERS.find((u) => u.uid === uid) ?? null;
  } catch {
    return null;
  }
}

function createMockAuthService(): AuthService {
  let currentUser: AppUser | null = readStoredUser();
  const listeners = new Set<(user: AppUser | null) => void>();

  function setUser(user: AppUser | null): void {
    currentUser = user;
    try {
      if (user) localStorage.setItem(STORAGE_KEY, user.uid);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 메모리에만 유지
    }
    listeners.forEach((cb) => cb(user));
  }

  return {
    isMock: true,
    getMockAccounts: () => MOCK_USERS,
    async signInWithGoogle(mockUid) {
      const user = MOCK_USERS.find((u) => u.uid === mockUid) ?? MOCK_USERS[0];
      setUser(user);
      return user;
    },
    async signOut() {
      setUser(null);
    },
    onAuthStateChanged(callback) {
      listeners.add(callback);
      callback(currentUser);
      return () => {
        listeners.delete(callback);
      };
    },
  };
}

export const authService: AuthService = createMockAuthService();
