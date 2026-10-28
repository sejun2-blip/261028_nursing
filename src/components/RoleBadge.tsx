// 사용자 권한 표시 (관리자/대학원생)
import type { Role } from '../types';

export default function RoleBadge({ role }: { role: Role }) {
  return role === 'admin' ? (
    <span className="rounded bg-brand-700 px-2 py-0.5 text-xs font-medium text-white">관리자</span>
  ) : (
    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">구성원</span>
  );
}
