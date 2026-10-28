// 연구 목록: 상태(진행중/완료) 필터 + 카드 목록
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ResearchCard from '../components/ResearchCard';
import { EmptyState, ErrorMessage, Loading } from '../components/StatusMessage';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { researchService } from '../services';
import type { ResearchStatus } from '../types';

const STATUS_FILTERS: { value: ResearchStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completed', label: '완료' },
];

export default function ResearchListPage() {
  useDocumentTitle('연구');
  // 선택한 필터를 주소(?status=)에 남겨, 새로고침하거나 링크를 공유해도 유지되게 함
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? 'all';
  const { data, loading, error } = useAsync(useCallback(() => researchService.list(), []));

  const filtered = useMemo(
    () => (data ?? []).filter((r) => status === 'all' || r.status === status),
    [data, status],
  );

  return (
    <>
      <PageHeader title="연구" description="연구실에서 수행 중이거나 완료한 연구를 소개합니다." />

      <div role="group" aria-label="연구 상태 필터" className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={status === f.value}
            onClick={() => setParams(f.value === 'all' ? {} : { status: f.value })}
            className={status === f.value ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && filtered.length === 0 && <EmptyState>해당하는 연구가 없습니다.</EmptyState>}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((r) => (
          <ResearchCard key={r.id} research={r} />
        ))}
      </div>
    </>
  );
}
