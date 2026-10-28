// 사이트 전체에서 쓰는 설정값을 한곳에 모아 둡니다.
// 비밀번호·API 키는 절대 여기에 쓰지 않습니다. (2차의 Firebase 값은 .env 파일로 관리)

/** 사이트 이름 (상단 메뉴·브라우저 탭에 표시) */
export const SITE_NAME = '간호학 연구실';

/**
 * 관리자(교수) 이메일 목록.
 * 이 목록에 있는 이메일로 로그인하면 '관리자'가 되어 모든 글·댓글을 삭제할 수 있습니다.
 * ⚠️ 실제 사용 전 교수님의 구글 계정 이메일로 바꿔 주세요.
 * ⚠️ 2차(Firebase)에서는 Firestore 보안 규칙에도 같은 이메일을 적어야 실제로 보호됩니다. (docs/FIREBASE_PLAN.md 참고)
 */
export const ADMIN_EMAILS: string[] = ['professor@example.ac.kr'];

/** 토론 목록 한 페이지에 보여 줄 글 수 (무료 요금제의 읽기 횟수를 아끼기 위해 작게 유지) */
export const POSTS_PAGE_SIZE = 10;

/** 한 번에 불러올 댓글 수 */
export const COMMENTS_PAGE_SIZE = 50;

/** 입력 글자 수 제한 (2차 보안 규칙과 같은 값으로 맞춤) */
export const LIMITS = {
  nameMax: 30,
  postTitleMax: 100,
  postContentMax: 5000,
  commentMax: 1000,
} as const;

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.trim().toLowerCase());
}
