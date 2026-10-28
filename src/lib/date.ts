// 날짜 변환을 한 곳에서 처리하는 도우미 함수 모음
// (Firestore 전환 시 Timestamp ↔ ISO 문자열 변환도 이 파일에 추가합니다)

/** 현재 시각을 ISO 문자열로 반환 */
export function nowIso(): string {
  return new Date().toISOString();
}

/** Date 또는 ISO 문자열을 ISO 문자열로 통일 */
export function toIso(value: Date | string): string {
  return typeof value === 'string' ? new Date(value).toISOString() : value.toISOString();
}

/** "2026. 10. 28." 형식 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

/** "2026. 10. 28. 오후 3:20" 형식 (댓글 시간 표시용) */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** 최신순 정렬용 비교 함수 */
export function byNewest<T extends { createdAt: string }>(a: T, b: T): number {
  return b.createdAt.localeCompare(a.createdAt);
}
