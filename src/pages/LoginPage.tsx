// 로그인: 1차에서는 '구글로 로그인' 모양의 Mock 로그인 (이름·이메일만 입력)
// 2차에서는 같은 버튼이 실제 구글 로그인 창을 띄우게 되며, 입력칸은 사라집니다.
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RoleBadge from '../components/RoleBadge';
import { ErrorMessage } from '../components/StatusMessage';
import { ADMIN_EMAILS, LIMITS } from '../config';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { IS_MOCK } from '../services';

export default function LoginPage() {
  useDocumentTitle('로그인');
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // 로그인 전에 보던 페이지로 돌아가기 (외부 주소로 튕기지 않도록 '/'로 시작하는 경로만 허용)
  const fromState = (location.state as { from?: unknown } | null)?.from;
  const from = typeof fromState === 'string' && fromState.startsWith('/') ? fromState : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn({ name, email });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인하지 못했습니다.');
      setSubmitting(false);
    }
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <h1 className="text-xl font-bold text-brand-900">이미 로그인되어 있습니다</h1>
        <p className="mt-3 flex items-center justify-center gap-2 text-slate-700">
          {user.name} <RoleBadge role={user.role} />
        </p>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/discussions" className="btn-primary">
            토론으로 가기
          </Link>
          <button type="button" className="btn-secondary" onClick={() => void signOut()}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-6">
      <h1 className="text-2xl font-bold text-brand-900">로그인</h1>
      <p className="mt-2 text-sm text-slate-600">로그인하면 토론 글과 댓글을 작성할 수 있습니다. 글 읽기는 로그인 없이 가능합니다.</p>

      <form onSubmit={(e) => void handleSubmit(e)} className="card mt-6 flex flex-col gap-4">
        {IS_MOCK && (
          <>
            <p className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600 ring-1 ring-slate-200">
              <strong>시험용 로그인</strong>입니다. 실제 구글 계정과 연결되지 않으며, 입력한 이름으로 로그인한 것처럼 동작합니다.
              관리자 기능을 시험하려면 이메일에 <code className="text-brand-700">{ADMIN_EMAILS[0]}</code> 를 입력하세요.
            </p>
            <div>
              <label htmlFor="name" className="label">
                이름 <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                className="input"
                value={name}
                maxLength={LIMITS.nameMax}
                autoComplete="name"
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김연구 (박사과정)"
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                이메일 <span className="font-normal text-slate-500">(선택)</span>
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="비워 두면 이름으로 시험용 계정이 만들어집니다"
              />
            </div>
          </>
        )}

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="btn min-h-[44px] border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        >
          <GoogleIcon />
          {submitting ? '로그인 중…' : '구글로 로그인'}
        </button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48" className="mr-1">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.4 5.7c4.3-4 6.9-9.9 6.9-17.2z" />
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.4 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}
