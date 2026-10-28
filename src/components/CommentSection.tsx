// 글 상세 아래의 댓글 영역: 목록, 작성(로그인 시), 삭제(본인·관리자)
import { useCallback, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LIMITS } from '../config';
import { usePagedList } from '../hooks/usePagedList';
import { usePermissions } from '../hooks/usePermissions';
import { discussionService } from '../services';
import DateText from './DateText';
import { EmptyState, ErrorMessage, Loading } from './StatusMessage';

export default function CommentSection({ postId }: { postId: string }) {
  const { user, canWrite, canDelete } = usePermissions();
  const location = useLocation();
  const fetchPage = useCallback((cursor: string | null) => discussionService.listComments(postId, { cursor }), [postId]);
  const { items, loading, error, hasMore, loadMore, reload } = usePagedList(fetchPage);

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!content.trim()) {
      setFormError('댓글 내용을 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await discussionService.addComment(postId, content, user);
      setContent('');
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '댓글을 저장하지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!user || !window.confirm('이 댓글을 삭제할까요? 되돌릴 수 없습니다.')) return;
    try {
      await discussionService.deleteComment(postId, commentId, user);
      reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '삭제하지 못했습니다.');
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <h2 id="comments-heading" className="mb-4 text-lg font-semibold text-brand-900">
        댓글 <span className="text-accent-700">{items.length}</span>
      </h2>

      {error && <ErrorMessage message={error} />}
      {!error && items.length === 0 && !loading && <EmptyState>아직 댓글이 없습니다. 첫 의견을 남겨 주세요.</EmptyState>}

      {items.length > 0 && (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {items.map((c) => (
            <li key={c.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{c.authorName}</span> · <DateText value={c.createdAt} />
                </p>
                {canDelete(c.authorId) && (
                  <button type="button" className="btn-danger btn-sm" onClick={() => void handleDelete(c.id)}>
                    삭제<span className="sr-only"> ({c.authorName}님의 댓글)</span>
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
      {loading && <Loading />}
      {hasMore && !loading && (
        <button type="button" className="btn-secondary mt-3" onClick={loadMore}>
          댓글 더 보기
        </button>
      )}

      {canWrite ? (
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-col gap-2">
          <label htmlFor="comment" className="label">
            댓글 작성
          </label>
          <textarea
            id="comment"
            className="input min-h-[96px]"
            value={content}
            maxLength={LIMITS.commentMax}
            onChange={(e) => setContent(e.target.value)}
            aria-describedby="comment-help"
          />
          <p id="comment-help" className="text-xs text-slate-500">
            {content.length}/{LIMITS.commentMax}자 · 환자 정보나 원자료는 적지 마세요.
          </p>
          {formError && <ErrorMessage message={formError} />}
          <div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? '등록 중…' : '댓글 등록'}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-6 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
          댓글을 쓰려면{' '}
          <Link to="/login" state={{ from: location.pathname }} className="link font-medium">
            로그인
          </Link>
          해 주세요.
        </p>
      )}
    </section>
  );
}
