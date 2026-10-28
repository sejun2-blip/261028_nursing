// 수업 자료 화면: 과목별로 묶어서 자료 링크 목록을 보여줍니다. 교수만 추가·수정·삭제 버튼이 보입니다.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MaterialItem from '../components/MaterialItem';
import { Message } from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import type { Material } from '../services/types';

export default function TeachingPage() {
  const { isAdmin } = useAuth();
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [course, setCourse] = useState('');

  useEffect(() => {
    void dataService.listMaterials().then(setMaterials);
  }, []);

  // 과목 이름 → 자료 목록
  const grouped = useMemo(() => {
    const map = new Map<string, Material[]>();
    for (const m of materials ?? []) map.set(m.course, [...(map.get(m.course) ?? []), m]);
    return map;
  }, [materials]);
  const courses = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b, 'ko'));
  const visible = course ? courses.filter((c) => c === course) : courses;

  async function handleDelete(m: Material) {
    if (!window.confirm(`"${m.title}" 자료를 삭제할까요?`)) return;
    await dataService.deleteMaterial(m.id);
    setMaterials((prev) => (prev ?? []).filter((x) => x.id !== m.id));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">수업 자료</h1>
        {isAdmin && (
          <Link to="/teaching/new" className="btn-primary">
            + 자료 추가
          </Link>
        )}
      </div>

      {materials === null ? (
        <Message>불러오는 중…</Message>
      ) : materials.length === 0 ? (
        <Message>등록된 수업 자료가 없습니다.</Message>
      ) : (
        <>
          <div className="mb-6 sm:w-64">
            <label htmlFor="course-filter" className="label">과목 선택</label>
            <select id="course-filter" className="input" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">전체 과목</option>
              {courses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-8">
            {visible.map((c) => (
              <section key={c}>
                <h2 className="mb-3 border-b border-slate-200 pb-1 text-lg font-semibold text-brand-800">
                  {c} <span className="text-sm font-normal text-slate-500">({grouped.get(c)?.length})</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {grouped.get(c)?.map((m) => (
                    <MaterialItem
                      key={m.id}
                      material={m}
                      actions={
                        isAdmin && (
                          <>
                            <Link to={`/teaching/${m.id}/edit`} className="btn-secondary">수정</Link>
                            <button type="button" className="btn-danger" onClick={() => void handleDelete(m)}>
                              삭제
                            </button>
                          </>
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
