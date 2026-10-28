// 수업 자료: 과목별 필터 + 자료 카드
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MaterialCard from '../components/MaterialCard';
import PageHeader from '../components/PageHeader';
import { EmptyState, ErrorMessage, Loading } from '../components/StatusMessage';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { materialService } from '../services';

export default function MaterialsPage() {
  useDocumentTitle('수업 자료');
  const [params, setParams] = useSearchParams();
  const course = params.get('course') ?? '';

  // 과목 버튼 목록은 전체 자료에서 만들고, 화면에 보이는 목록은 선택한 과목으로 서비스에 요청
  const all = useAsync(useCallback(() => materialService.list(), []));
  const courses = useMemo(() => Array.from(new Set((all.data ?? []).map((m) => m.course))), [all.data]);
  const filtered = useAsync(useCallback(() => materialService.list(course ? { course } : undefined), [course]));

  return (
    <>
      <PageHeader
        title="수업 자료"
        description="강의 자료는 OneDrive·Google Drive 공유 링크로 제공합니다. 링크를 누르면 새 창에서 열립니다."
      />

      <div role="group" aria-label="과목 필터" className="mb-6 flex flex-wrap gap-2">
        {['', ...courses].map((c) => (
          <button
            key={c || 'all'}
            type="button"
            aria-pressed={course === c}
            onClick={() => setParams(c ? { course: c } : {})}
            className={course === c ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
          >
            {c || '전체'}
          </button>
        ))}
      </div>

      {filtered.loading && <Loading />}
      {filtered.error && <ErrorMessage message={filtered.error} />}
      {filtered.data && filtered.data.length === 0 && <EmptyState>해당 과목의 자료가 없습니다.</EmptyState>}
      {filtered.data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.data.map((m) => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </div>
      )}
    </>
  );
}
