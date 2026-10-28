// 토론 글쓰기 (로그인 사용자만)
import { useCallback, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import EthicsNotice from '../components/EthicsNotice';
import PageHeader from '../components/PageHeader';
import { ErrorMessage } from '../components/StatusMessage';
import { LIMITS } from '../config';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePermissions } from '../hooks/usePermissions';
import { discussionService, researchService } from '../services';

export default function DiscussionNewPage() {
  useDocumentTitle('토론 글쓰기');
  const { user } = usePermissions();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const research = useAsync(useCallback(() => researchService.list(), []));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 연구 상세에서 '이 연구로 글쓰기'를 누르면 해당 연구가 미리 선택됨
  const [researchId, setResearchId] = useState(params.get('researchId') ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <h1 className="text-xl font-bold text-brand-900">로그인이 필요합니다</h1>
        <p className="mt-2 text-sm text-slate-600">토론 글은 로그인한 구성원만 작성할 수 있습니다.</p>
        <Link to="/login" state={{ from: '/discussions/new' }} className="btn-primary mt-6">
          로그인하러 가기
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const post = await discussionService.createPost({ title, content, researchId: researchId || undefined }, user);
      navigate(`/discussions/${post.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '글을 저장하지 못했습니다.');
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="토론 글쓰기" />
      <EthicsNotice />

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="research" className="label">
            관련 연구 <span className="font-normal text-slate-500">(선택)</span>
          </label>
          <select id="research" className="input" value={researchId} onChange={(e) => setResearchId(e.target.value)}>
            <option value="">연결하지 않음</option>
            {(research.data ?? []).map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="label">
            제목 <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            className="input"
            value={title}
            maxLength={LIMITS.postTitleMax}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="content" className="label">
            내용 <span className="text-red-600">*</span>
          </label>
          <textarea
            id="content"
            className="input min-h-[240px]"
            value={content}
            maxLength={LIMITS.postContentMax}
            required
            aria-describedby="content-help"
            onChange={(e) => setContent(e.target.value)}
          />
          <p id="content-help" className="mt-1 text-xs text-slate-500">
            {content.length}/{LIMITS.postContentMax}자 · 파일은 OneDrive/Google Drive 공유 링크를 본문에 붙여 넣어 주세요.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}
        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '등록 중…' : '등록'}
          </button>
          <Link to="/discussions" className="btn-secondary">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
