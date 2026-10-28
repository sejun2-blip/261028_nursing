// 수업 자료 추가·수정 화면 (교수 전용). 주소에 :id 가 있으면 수정, 없으면 새로 추가합니다.
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LinksEditor, { cleanLinks } from '../components/LinksEditor';
import { Message } from '../components/Message';
import { isSafeUrl } from '../lib/url';
import { dataService } from '../services/dataService';
import { COURSES, type MaterialInput } from '../services/types';

const EMPTY: MaterialInput = { course: COURSES[0], title: '', description: '', links: [{ label: '', url: '' }] };

export default function MaterialFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<MaterialInput>(EMPTY);
  const [loading, setLoading] = useState(Boolean(id));
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    dataService.getMaterial(id).then((m) => {
      if (!m) setNotFound(true);
      else setForm({ course: m.course, title: m.title, description: m.description, links: m.links });
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.course.trim() || !form.title.trim()) return setError('과목과 제목을 입력해 주세요.');
    const links = cleanLinks(form.links, isSafeUrl);
    if (typeof links === 'string') return setError(links);
    const input: MaterialInput = {
      course: form.course.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      links,
    };
    setSaving(true);
    setError('');
    try {
      if (id) await dataService.updateMaterial(id, input);
      else await dataService.createMaterial(input);
      navigate('/teaching', { replace: true });
    } catch {
      setError('저장하지 못했습니다. 다시 시도해 주세요.');
      setSaving(false);
    }
  }

  if (loading) return <Message>불러오는 중…</Message>;
  if (notFound) return <Message>자료를 찾을 수 없습니다.</Message>;

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
      <h1 className="text-xl font-bold text-slate-900">{id ? '수업 자료 수정' : '수업 자료 추가'}</h1>

      <div>
        <label htmlFor="course" className="label">과목 *</label>
        <input
          id="course"
          className="input sm:w-64"
          list="course-options"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <datalist id="course-options">
          {COURSES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <p className="mt-1 text-xs text-slate-500">목록에서 고르거나 새 과목명을 직접 입력할 수 있습니다.</p>
      </div>

      <div>
        <label htmlFor="title" className="label">제목 *</label>
        <input id="title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div>
        <label htmlFor="description" className="label">설명</label>
        <textarea
          id="description"
          className="input min-h-[80px]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <span className="label">자료 링크</span>
        <LinksEditor links={form.links} onChange={(links) => setForm({ ...form, links })} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? '저장 중…' : '저장'}
        </button>
        <Link to="/teaching" className="btn-secondary">취소</Link>
      </div>
    </form>
  );
}
