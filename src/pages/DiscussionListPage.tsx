// 토론 목록: 최신순 10건씩 "더 보기"로 이어서 불러옴
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MockNotice from '../components/MockNotice';
import PageHeader from '../components/PageHeader';
import PostListItem from '../components/PostListItem';
import { EmptyState, ErrorMessage, Loading } from '../components/StatusMessage';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePagedList } from '../hooks/usePagedList';
import { usePermissions } from '../hooks/usePermissions';
import { discussionService, researchService } from '../services';

export default function DiscussionListPage() {
  useDocumentTitle('토론');
  const { canWrite } = usePermissions();
  const fetchPage = useCallback((cursor: string | null) => discussionService.listPosts({ cursor }), []);
  const { items, loading, error, hasMore, loadMore } = usePagedList(fetchPage);

  // 글에 연결된 연구 제목을 보여 주기 위한 id → 제목 표
  const research = useAsync(useCallback(() => researchService.list(), []));
  const titleById = useMemo(() => new Map((research.data ?? []).map((r) => [r.id, r.title])), [research.data]);

  return (
    <>
      <PageHeader
        title="토론"
        description="연구 결과와 방법론에 대해 대학원생과 자유롭게 의견을 나누는 공간입니다."
        actions={
          canWrite ? (
            <Link to="/discussions/new" className="btn-primary">
              글쓰기
            </Link>
          ) : (
            <Link to="/login" state={{ from: '/discussions/new' }} className="btn-secondary">
              로그인 후 글쓰기
            </Link>
          )
        }
      />
      <MockNotice />

      {error && <ErrorMessage message={error} />}
      {!loading && !error && items.length === 0 && <EmptyState>아직 토론 글이 없습니다.</EmptyState>}
      {items.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white px-5">
          {items.map((p) => (
            <PostListItem key={p.id} post={p} researchTitle={p.researchId ? titleById.get(p.researchId) : undefined} />
          ))}
        </ul>
      )}
      {loading && <Loading />}
      {hasMore && !loading && (
        <div className="mt-4 text-center">
          <button type="button" className="btn-secondary" onClick={loadMore}>
            더 보기
          </button>
        </div>
      )}
    </>
  );
}
