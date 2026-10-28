// 연구 진행 상태 표시 (진행중/완료)
import type { ResearchStatus } from '../types';

export default function StatusBadge({ status }: { status: ResearchStatus }) {
  return status === 'ongoing' ? (
    <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700 ring-1 ring-accent-100">
      진행중
    </span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
      완료
    </span>
  );
}
