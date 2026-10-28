// 연구 상세 화면의 토론(댓글) 영역: 목록 보기, 작성, 본인 댓글 삭제
// 댓글은 이 화면을 열 때 한 번만 불러옵니다(실시간 구독 없음 → Firestore 읽기 횟수 절약).
import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../lib/date';
import { dataService } from '../services/dataService';
import type { Comment } from '../services/types';

const MAX_LENGTH = 1000;

export default function CommentSection({ researchId }: { researchId: string }) {
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    dataService
      .listComments(researchId)
      .then((list) => active && setComments(list))
      .catch(() => active && setError('댓글을 불러오지 못했습니다.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [researchId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!user || !trimmed) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await dataService.addComment(researchId, trimmed, user);
      setComments((prev) => [...prev, created]);
      setText('');
    } catch {
      setError('댓글을 저장하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!window.confirm('이 댓글을 삭제할까요?')) return;
    try {
      await dataService.deleteComment(researchId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError('댓글을 삭제하지 못했습니다.');
    }
  }

  return (
    <section className="card p-5" aria-labelledby="discussion-title">
      <h2 id="discussion-title" className="mb-4 text-lg font-semibold text-slate-900">
        토론 <span className="text-sm font-normal text-slate-500">({comments.length})</span>
      </h2>

      {loading ? (
        <p className="text-sm text-slate-500">댓글을 불러오는 중…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500">아직 댓글이 없습니다. 첫 의견을 남겨 주세요.</p>
      ) : (
        <ul className="mb-4 divide-y divide-slate-100">
          {comments.map((c) => {
            // 본인 댓글은 삭제 가능. 교수(관리자)는 운영을 위해 모든 댓글 삭제 가능.
            const canDelete = !!user && (user.uid === c.authorId || isAdmin);
            return (
              <li key={c.id} className="py-3">
                <div className="mb-1 flex flex-wrap items-center gap-x-2 text-sm">
                  <span className="font-semibold text-slate-800">{c.authorName}</span>
                  <time className="text-xs text-slate-500" dateTime={c.createdAt}>
                    {formatDateTime(c.createdAt)}
                  </time>
                  {canDelete && (
                    <button
                      type="button"
                      className="ml-auto text-xs text-red-600 hover:underline"
                      onClick={() => void handleDelete(c.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-slate-700">{c.text}</p>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor="comment-text" className="sr-only">
            댓글 입력
          </label>
          <textarea
            id="comment-text"
            className="input min-h-[90px]"
            placeholder="의견을 입력하세요. (환자 개인정보·미발표 원자료는 적지 마세요)"
            maxLength={MAX_LENGTH}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {text.length}/{MAX_LENGTH}
            </span>
            <button type="submit" className="btn-primary" disabled={submitting || !text.trim()}>
              {submitting ? '등록 중…' : '댓글 등록'}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
          로그인 후 작성 가능합니다.{' '}
          <Link to="/login" className="font-medium text-brand-700 underline">
            로그인하기
          </Link>
        </div>
      )}
    </section>
  );
}
