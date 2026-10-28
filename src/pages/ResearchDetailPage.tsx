// 연구 상세 화면: 제목·요약·태그·상태·작성일, 자료 링크, 토론(댓글) 영역
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StatusBadge, TagBadge } from '../components/Badges';
import CommentSection from '../components/CommentSection';
import LinkList from '../components/LinkList';
import { Message } from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/date';
import { dataService } from '../services/dataService';
import type { Research } from '../services/types';

export default function ResearchDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  // undefined = 불러오는 중, null = 없음
  const [research, setResearch] = useState<Research | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    setResearch(undefined);
    dataService.getResearch(id).then((r) => {
      if (active) setResearch(r);
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!research || !window.confirm(`"${research.title}" 연구를 삭제할까요? 댓글도 함께 삭제됩니다.`)) return;
    await dataService.deleteResearch(research.id);
    navigate('/research', { replace: true });
  }

  if (research === undefined) return <Message>불러오는 중…</Message>;
  if (research === null) {
    return (
      <Message>
        연구를 찾을 수 없습니다.{' '}
        <Link to="/research" className="text-brand-700 underline">
          목록으로
        </Link>
      </Message>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/research" className="text-sm text-brand-700 hover:underline">
        ← 연구 목록
      </Link>

      <article className="card p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={research.status} />
          {research.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
        <h1 className="mb-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{research.title}</h1>
        <p className="mb-5 text-xs text-slate-500">
          작성일 {formatDate(research.createdAt)}
          {research.updatedAt !== research.createdAt && ` · 수정일 ${formatDate(research.updatedAt)}`}
        </p>

        <h2 className="mb-1 text-sm font-semibold text-slate-700">요약</h2>
        <p className="mb-6 whitespace-pre-wrap text-slate-700">{research.summary}</p>

        <h2 className="mb-2 text-sm font-semibold text-slate-700">자료 링크</h2>
        <LinkList links={research.links} />

        {isAdmin && (
          <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">
            <Link to={`/research/${research.id}/edit`} className="btn-secondary">
              수정
            </Link>
            <button type="button" className="btn-danger" onClick={() => void handleDelete()}>
              삭제
            </button>
          </div>
        )}
      </article>

      <CommentSection researchId={research.id} />
    </div>
  );
}
