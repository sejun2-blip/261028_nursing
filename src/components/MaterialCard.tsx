// 수업 자료 카드 (파일은 외부 공유 링크로만 연결)
import type { Material } from '../types';
import DateText from './DateText';
import LinkList from './LinkList';

export default function MaterialCard({ material }: { material: Material }) {
  return (
    <article className="card flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="rounded bg-accent-50 px-2 py-0.5 font-medium text-accent-700">{material.course}</span>
        <DateText value={material.createdAt} />
      </div>
      <h3 className="text-base font-semibold leading-snug text-brand-900">{material.title}</h3>
      <p className="text-sm text-slate-600">{material.description}</p>
      <div className="mt-auto border-t border-slate-100 pt-3">
        <LinkList links={material.links} />
      </div>
    </article>
  );
}
