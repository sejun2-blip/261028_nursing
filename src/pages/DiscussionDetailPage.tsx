// 토론 글 상세: 본문 + 관련 연구 링크 + 삭제(본인·관리자) + 댓글
import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import DateText from '../components/DateText';
import { ErrorMessage, Loading } from '../components/StatusMessage';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePermissions } from '../hooks/usePermissions';
import { discussionService, researchService } from '../services';
import NotFoundPage from './NotFoundPage';

export default function DiscussionDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user, canDelete } = usePermissions();
  const post = useAsync(useCallback(() => discussionService.getPost(id), [id]));
  const researchId = post.data?.researchId;
  const research = useAsync(
    useCallback(() => (researchId ? researchService.getById(researchId) : Promise.resolve(null)), [researchId]),
  );
  const [deleting, setDeleting] = useState(false);
  useDocumentTitle(post.data?.title ?? '토론');

  if (post.loading) return <Loading />;
  if (post.error) return <ErrorMessage message={post.error} />;
  if (!post.data) return <NotFoundPage message="글을 찾을 수 없습니다. 삭제되었을 수 있습니다." />;
  const p = post.data;

  async function handleDelete() {
    if (!user || !window.confirm('이 글과 달린 댓글을 모두 삭제할까요? 되돌릴 수 없습니다.')) return;
    setDeleting(true);
    try {
      await discussionService.deletePost(p.id, user);
      navigate('/discussions', { replace: true });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '삭제하지 못했습니다.');
      setDeleting(false);
    }
  }

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="이동 경로" className="mb-4 text-sm">
        <Link to="/discussions" className="link">
          ← 토론 목록
        </Link>
      </nav>

      <header className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold leading-snug text-brand-900">{p.title}</h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="flex flex-wrap gap-x-3 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{p.authorName}</span>
            <DateText value={p.createdAt} />
          </p>
          {canDelete(p.authorId) && (
            <button type="button" className="btn-danger btn-sm" disabled={deleting} onClick={() => void handleDelete()}>
              {deleting ? '삭제 중…' : '글 삭제'}
            </button>
          )}
        </div>
        {research.data && (
          <p className="mt-3 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
            관련 연구:{' '}
            <Link to={`/research/${research.data.id}`} className="font-medium underline-offset-2 hover:underline">
              {research.data.title}
            </Link>
          </p>
        )}
      </header>

      {/* 입력한 글을 HTML 로 해석하지 않고 글자 그대로 보여 줌 (보안상 안전) */}
      <div className="whitespace-pre-wrap py-6 leading-relaxed text-slate-800">{p.content}</div>

      <CommentSection postId={p.id} />
    </article>
  );
}
