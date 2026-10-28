// 연구 상세: 초록, 방법, 결과 요약, 관련 자료 링크, 이 연구에 대한 토론
import { useCallback, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import LinkList from '../components/LinkList';
import PostListItem from '../components/PostListItem';
import StatusBadge from '../components/StatusBadge';
import { ErrorMessage, Loading } from '../components/StatusMessage';
import TagList from '../components/TagList';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePermissions } from '../hooks/usePermissions';
import { discussionService, researchService } from '../services';
import NotFoundPage from './NotFoundPage';

export default function ResearchDetailPage() {
  const { id = '' } = useParams();
  const { canWrite } = usePermissions();
  const research = useAsync(useCallback(() => researchService.getById(id), [id]));
  const posts = useAsync(useCallback(() => discussionService.listPosts({ researchId: id, limit: 5 }), [id]));
  useDocumentTitle(research.data?.title ?? '연구');

  if (research.loading) return <Loading />;
  if (research.error) return <ErrorMessage message={research.error} />;
  if (!research.data) return <NotFoundPage message="요청하신 연구를 찾을 수 없습니다." />;
  const r = research.data;

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="이동 경로" className="mb-4 text-sm">
        <Link to="/research" className="link">
          ← 연구 목록
        </Link>
      </nav>

      <header className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <StatusBadge status={r.status} />
          <span>{r.year}년</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold leading-snug text-brand-900 sm:text-3xl">{r.title}</h1>
        <p className="mt-3 text-slate-600">{r.summary}</p>
        <div className="mt-4">
          <TagList tags={r.tags} />
        </div>
      </header>

      <DetailSection title="초록">{r.abstract}</DetailSection>
      <DetailSection title="연구 방법">{r.methods}</DetailSection>
      <DetailSection title="결과 요약">
        {r.results || <span className="text-slate-500">연구가 진행 중이며, 결과는 완료 후 공개됩니다.</span>}
      </DetailSection>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-brand-900">관련 자료</h2>
        <LinkList links={r.links} />
      </section>

      <section className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-brand-900">이 연구에 대한 토론</h2>
          {canWrite && (
            <Link to={`/discussions/new?researchId=${r.id}`} className="btn-primary btn-sm">
              이 연구로 글쓰기
            </Link>
          )}
        </div>
        {posts.loading && <Loading />}
        {posts.data && posts.data.items.length === 0 && <p className="mt-3 text-sm text-slate-500">아직 연결된 토론 글이 없습니다.</p>}
        {posts.data && posts.data.items.length > 0 && (
          <ul className="mt-2 divide-y divide-slate-200">
            {posts.data.items.map((p) => (
              <PostListItem key={p.id} post={p} />
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-lg font-semibold text-brand-900">{title}</h2>
      <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{children}</p>
    </section>
  );
}
