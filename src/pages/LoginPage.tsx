// 로그인 화면: "Google로 로그인" 버튼. mock 단계에서는 교수/대학원생 임시 계정 중 하나를 골라 로그인합니다.
import { Link, useNavigate } from 'react-router-dom';
import { RoleBadge } from '../components/Badges';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function LoginPage() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const mockAccounts = authService.getMockAccounts();

  async function handleSignIn(mockUid?: string) {
    await signIn(mockUid);
    // 사이트 안에서 이동해 왔으면 이전 화면으로, 주소로 바로 들어왔으면 홈으로
    const cameFromSite = (window.history.state as { idx?: number } | null)?.idx;
    if (cameFromSite) navigate(-1);
    else navigate('/', { replace: true });
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6 sm:p-8">
        <h1 className="mb-2 text-xl font-bold text-slate-900">로그인</h1>
        <p className="mb-6 text-sm text-slate-600">
          연구실 구성원은 학교 또는 개인 Google 계정으로 로그인합니다. 로그인하면 연구 토론에 댓글을 남길 수 있습니다.
        </p>

        {user && (
          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm">
            현재 <strong>{user.displayName}</strong>
            <RoleBadge role={user.role} /> 으로 로그인되어 있습니다.
            <button type="button" className="ml-auto text-xs text-slate-500 underline" onClick={() => void signOut()}>
              로그아웃
            </button>
          </div>
        )}

        {authService.isMock ? (
          <div className="space-y-3">
            <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              현재는 <strong>시험용(mock) 로그인</strong>입니다. 실제 Google 계정 연결은 다음 단계(Firebase 연동)에서
              적용됩니다. 아래에서 임시 계정을 선택하세요.
            </p>
            {mockAccounts.map((account) => (
              <button
                key={account.uid}
                type="button"
                className="btn-secondary w-full justify-between py-2.5"
                onClick={() => void handleSignIn(account.uid)}
              >
                <span className="flex items-center gap-2">
                  <GoogleIcon /> Google로 로그인
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  {account.displayName} <RoleBadge role={account.role} />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <button type="button" className="btn-secondary w-full py-2.5" onClick={() => void handleSignIn()}>
            <GoogleIcon /> Google로 로그인
          </button>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          로그인하지 않아도 <Link to="/research" className="underline">연구</Link>와{' '}
          <Link to="/teaching" className="underline">수업 자료</Link> 목록은 볼 수 있습니다.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}
