// localStorage 읽기/쓰기 도우미
// 브라우저 설정(사생활 보호 모드 등)에 따라 localStorage 가 막힐 수 있어, 실패해도 앱이 멈추지 않게 감쌉니다.

const PREFIX = 'nursing-lab:v1:';

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // 저장 공간이 꽉 찼거나 막힌 경우: 이번 화면에서만 유지되고 새로고침 시 사라짐
    console.warn('브라우저 저장소에 저장하지 못했습니다.');
  }
}

export function hasKey(key: string): boolean {
  try {
    return window.localStorage.getItem(PREFIX + key) !== null;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // 무시
  }
}

/** 겹치지 않는 문서 ID 생성 (Firestore 자동 ID 와 같은 역할) */
export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** 최신순 정렬 (createdAt 내림차순, 같으면 id 로 고정 순서 유지) */
export function byNewest<T extends { createdAt: string; id: string }>(a: T, b: T): number {
  if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
  return a.id < b.id ? 1 : -1;
}
