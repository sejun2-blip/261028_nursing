// 관리자(교수) 전용 화면 보호: 권한이 없으면 안내 문구를 보여줍니다.
// (실제 보안은 다음 단계의 Firestore 보안 규칙에서 처리합니다. 이 컴포넌트는 화면 표시용입니다.)
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Message } from './Message';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Message>불러오는 중…</Message>;
  if (!isAdmin) {
    return (
      <Message>
        교수(관리자) 계정만 사용할 수 있는 화면입니다.{' '}
        <Link to="/login" className="text-brand-700 underline">
          로그인
        </Link>
      </Message>
    );
  }
  return <>{children}</>;
}
