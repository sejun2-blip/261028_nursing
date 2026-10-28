// 연구 추가·수정 화면 (교수 전용). 주소에 :id 가 있으면 수정, 없으면 새로 추가합니다.
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LinksEditor, { cleanLinks } from '../components/LinksEditor';
import { Message } from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { isSafeUrl } from '../lib/url';
import { dataService } from '../services/dataService';
import { RESEARCH_TAGS, STATUS_LABELS, type ResearchInput, type ResearchStatus } from '../services/types';

const EMPTY: ResearchInput = { title: '', summary: '', tags: [], status: 'planned', links: [] };

export default function ResearchFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<ResearchInput>(EMPTY);
  const [extraTags, setExtraTags] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    dataService.getResearch(id).then((r) => {
      if (!r) setNotFound(true);
      else {
        const { title, summary, tags, status, links } = r;
        setForm({ title, summary, tags: tags.filter((t) => RESEARCH_TAGS.includes(t)), status, links });
        setExtraTags(tags.filter((t) => !RESEARCH_TAGS.includes(t)).join(', '));
      }
      setLoading(false);
    });
  }, [id]);

  function toggleTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) return setError('제목을 입력해 주세요.');
    const links = cleanLinks(form.links, isSafeUrl);
    if (typeof links === 'string') return setError(links);
    const custom = extraTags.split(',').map((t) => t.trim()).filter(Boolean);
    const input: ResearchInput = {
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      tags: Array.from(new Set([...form.tags, ...custom])),
      links,
    };
    setSaving(true);
    setError('');
    try {
      const saved = id ? await dataService.updateResearch(id, input) : await dataService.createResearch(input, user);
      navigate(`/research/${saved.id}`, { replace: true });
    } catch {
      setError('저장하지 못했습니다. 다시 시도해 주세요.');
      setSaving(false);
    }
  }

  if (loading) return <Message>불러오는 중…</Message>;
  if (notFound) return <Message>연구를 찾을 수 없습니다.</Message>;

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
      <h1 className="text-xl font-bold text-slate-900">{isEdit ? '연구 수정' : '연구 추가'}</h1>

      <div>
        <label htmlFor="title" className="label">제목 *</label>
        <input id="title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div>
        <label htmlFor="summary" className="label">요약</label>
        <textarea
          id="summary"
          className="input min-h-[120px]"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="status" className="label">진행 상태</label>
        <select
          id="status"
          className="input sm:w-48"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as ResearchStatus })}
        >
          {(Object.keys(STATUS_LABELS) as ResearchStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="label">태그</legend>
        <div className="mb-2 flex flex-wrap gap-3">
          {RESEARCH_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={form.tags.includes(tag)} onChange={() => toggleTag(tag)} />
              {tag}
            </label>
          ))}
        </div>
        <input
          className="input"
          placeholder="기타 태그 (쉼표로 구분, 예: 약물유전체, 질적연구)"
          value={extraTags}
          onChange={(e) => setExtraTags(e.target.value)}
        />
      </fieldset>

      <div>
        <span className="label">자료 링크</span>
        <LinksEditor links={form.links} onChange={(links) => setForm({ ...form, links })} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? '저장 중…' : '저장'}
        </button>
        <Link to={id ? `/research/${id}` : '/research'} className="btn-secondary">취소</Link>
      </div>
    </form>
  );
}
