// 작은 표시 배지들: 태그, 진행 상태, 사용자 역할
import { STATUS_LABELS, type ResearchStatus, type Role } from '../services/types';

export function TagBadge({ tag }: { tag: string }) {
  return <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">#{tag}</span>;
}

const STATUS_STYLES: Record<ResearchStatus, string> = {
  planned: 'bg-slate-100 text-slate-700',
  ongoing: 'bg-emerald-50 text-emerald-700',
  done: 'bg-indigo-50 text-indigo-700',
};

export function StatusBadge({ status }: { status: ResearchStatus }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${
        role === 'admin' ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-700'
      }`}
    >
      {role === 'admin' ? '교수' : '대학원생'}
    </span>
  );
}
