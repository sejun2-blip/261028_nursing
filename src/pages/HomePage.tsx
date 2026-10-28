// 홈: 연구실 소개 + 최근 연구·수업 자료·토론 각 3건
import { useCallback, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import MaterialCard from '../components/MaterialCard';
import PostListItem from '../components/PostListItem';
import ResearchCard from '../components/ResearchCard';
import { EmptyState, ErrorMessage, Loading } from '../components/StatusMessage';
import lab from '../data/lab.json';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { discussionService, materialService, researchService } from '../services';

const RECENT_COUNT = 3;

export default function HomePage() {
  useDocumentTitle();
  // 필요한 개수(3건)만 요청해, 2차에서 Firestore 읽기 횟수를 최소화
  const research = useAsync(useCallback(() => researchService.list({ limit: RECENT_COUNT }), []));
  const materials = useAsync(useCallback(() => materialService.list({ limit: RECENT_COUNT }), []));
  const posts = useAsync(useCallback(() => discussionService.listPosts({ limit: RECENT_COUNT }), []));

  return (
    <div className="flex flex-col gap-14">
      <section className="rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-sm font-medium text-accent-100">{lab.name}</p>
        <h1 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">{lab.tagline}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-brand-100 sm:text-base">{lab.intro}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/research" className="btn bg-white text-brand-800 hover:bg-brand-50">
            연구 보기
          </Link>
          <Link to="/discussions" className="btn border border-white/40 text-white hover:bg-white/10">
            토론 참여하기
          </Link>
        </div>
      </section>

      <HomeSection title="최근 연구" moreTo="/research">
        {research.loading && <Loading />}
        {research.error && <ErrorMessage message={research.error} />}
        {research.data && (
          <div className="grid gap-4 md:grid-cols-3">
            {research.data.map((r) => (
              <ResearchCard key={r.id} research={r} />
            ))}
          </div>
        )}
      </HomeSection>

      <HomeSection title="최근 수업 자료" moreTo="/materials">
        {materials.loading && <Loading />}
        {materials.error && <ErrorMessage message={materials.error} />}
        {materials.data && (
          <div className="grid gap-4 md:grid-cols-3">
            {materials.data.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        )}
      </HomeSection>

      <HomeSection title="최근 토론" moreTo="/discussions">
        {posts.loading && <Loading />}
        {posts.error && <ErrorMessage message={posts.error} />}
        {posts.data && posts.data.items.length === 0 && <EmptyState>아직 토론 글이 없습니다.</EmptyState>}
        {posts.data && posts.data.items.length > 0 && (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white px-5">
            {posts.data.items.map((p) => (
              <PostListItem key={p.id} post={p} />
            ))}
          </ul>
        )}
      </HomeSection>
    </div>
  );
}

function HomeSection({ title, moreTo, children }: { title: string; moreTo: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-bold text-brand-900">{title}</h2>
        <Link to={moreTo} className="link text-sm">
          전체 보기<span className="sr-only"> ({title})</span> →
        </Link>
      </div>
      {children}
    </section>
  );
}
