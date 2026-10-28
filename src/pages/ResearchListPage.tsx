// 연구 목록 화면: 카드형 목록 + 태그 필터 + 제목 검색 (필터 상태는 주소창 ?tag=&q= 에 저장)
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Message } from '../components/Message';
import ResearchCard from '../components/ResearchCard';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { RESEARCH_TAGS, type Research } from '../services/types';

export default function ResearchListPage() {
  const { isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag') ?? '';
  const search = params.get('q') ?? '';
  const [researches, setResearches] = useState<Research[] | null>(null);

  useEffect(() => {
    let active = true;
    dataService.listResearches({ tag: tag || undefined, search }).then((list) => {
      if (active) setResearches(list);
    });
    return () => {
      active = false;
    };
  }, [tag, search]);

  function updateParam(key: 'tag' | 'q', value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">연구</h1>
        {isAdmin && (
          <Link to="/research/new" className="btn-primary">
            + 연구 추가
          </Link>
        )}
      </div>

      <div className="card mb-5 space-y-3 p-4">
        <label htmlFor="research-search" className="sr-only">
          제목 검색
        </label>
        <input
          id="research-search"
          type="search"
          className="input"
          placeholder="연구 제목으로 검색"
          value={search}
          onChange={(e) => updateParam('q', e.target.value)}
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="태그 필터">
          <FilterChip active={!tag} onClick={() => updateParam('tag', '')}>
            전체
          </FilterChip>
          {RESEARCH_TAGS.map((t) => (
            <FilterChip key={t} active={tag === t} onClick={() => updateParam('tag', tag === t ? '' : t)}>
              #{t}
            </FilterChip>
          ))}
        </div>
      </div>

      {researches === null ? (
        <Message>불러오는 중…</Message>
      ) : researches.length === 0 ? (
        <Message>조건에 맞는 연구가 없습니다.</Message>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {researches.map((r) => (
            <ResearchCard key={r.id} research={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string | string[] }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm ${
        active ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}
