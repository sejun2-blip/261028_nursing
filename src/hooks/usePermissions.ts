// 권한 판단을 한곳에 모아, 화면마다 조건이 달라지는 실수를 막습니다.
// 비로그인: 읽기만 / 로그인(member): 작성 + 본인 글 삭제 / 관리자(admin): 모든 글 삭제
import { useAuth } from './useAuth';

export function usePermissions() {
  const { user } = useAuth();
  return {
    user,
    canWrite: user !== null,
    isAdmin: user?.role === 'admin',
    canDelete: (authorId: string) => user !== null && (user.role === 'admin' || user.uid === authorId),
  };
}
