// 홈 화면: 사이트 소개 + 최근 연구 3건 + 최근 수업 자료 3건
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MaterialItem from '../components/MaterialItem';
import { Message } from '../components/Message';
import ResearchCard from '../components/ResearchCard';
import { dataService } from '../services/dataService';
import type { Material, Research } from '../services/types';

export default function HomePage() {
  const [researches, setResearches] = useState<Research[] | null>(null);
  const [materials, setMaterials] = useState<Material[] | null>(null);

  useEffect(() => {
    // 최근 3건만 요청 (Firestore 전환 시 orderBy + limit 쿼리로 대응)
    void dataService.listResearches({ limit: 3 }).then(setResearches);
    void dataService.listMaterials({ limit: 3 }).then(setMaterials);
  }, []);

  return (
    <div className="space-y-10">
      <section className="card p-6 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold text-brand-800 sm:text-3xl">간호학 연구·교육 아카이브</h1>
        <p className="max-w-2xl text-slate-600">
          유전간호, 종양간호, 다학제 교육(IPE), 시뮬레이션 교육 분야의 연구 진행 현황과 수업 자료를 모아 두고,
          대학원생과 함께 연구에 관해 토론하는 연구실 내부 공간입니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/research" className="btn-primary">
            연구 둘러보기
          </Link>
          <Link to="/teaching" className="btn-secondary">
            수업 자료 보기
          </Link>
        </div>
      </section>

      <section>
        <SectionHeader title="최근 연구" to="/research" />
        {researches === null ? (
          <Message>불러오는 중…</Message>
        ) : researches.length === 0 ? (
          <Message>등록된 연구가 없습니다.</Message>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {researches.map((r) => (
              <ResearchCard key={r.id} research={r} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="최근 수업 자료" to="/teaching" />
        {materials === null ? (
          <Message>불러오는 중…</Message>
        ) : materials.length === 0 ? (
          <Message>등록된 수업 자료가 없습니다.</Message>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m) => (
              <MaterialItem key={m.id} material={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <Link to={to} className="text-sm text-brand-700 hover:underline">
        전체 보기 →
      </Link>
    </div>
  );
}
