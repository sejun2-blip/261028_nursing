// 수업 자료 한 건 표시 (홈·수업 자료 화면 공용)
import type { ReactNode } from 'react';
import { formatDate } from '../lib/date';
import type { Material } from '../services/types';
import LinkList from './LinkList';

export default function MaterialItem({ material, actions }: { material: Material; actions?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-brand-700">{material.course}</span>
        <span className="text-xs text-slate-500">{formatDate(material.createdAt)}</span>
      </div>
      <h3 className="font-semibold text-slate-900">{material.title}</h3>
      {material.description && <p className="mt-1 text-sm text-slate-600">{material.description}</p>}
      <div className="mt-3">
        <LinkList links={material.links} />
      </div>
      {actions && <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">{actions}</div>}
    </div>
  );
}
