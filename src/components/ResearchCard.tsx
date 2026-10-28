// 연구 목록·홈 화면에서 쓰는 연구 카드
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/date';
import type { Research } from '../services/types';
import { StatusBadge, TagBadge } from './Badges';

export default function ResearchCard({ research }: { research: Research }) {
  return (
    <Link
      to={`/research/${research.id}`}
      className="card flex h-full flex-col p-4 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-600"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <StatusBadge status={research.status} />
        <span className="text-xs text-slate-500">{formatDate(research.createdAt)}</span>
      </div>
      <h3 className="mb-2 font-semibold leading-snug text-slate-900">{research.title}</h3>
      <p className="mb-3 line-clamp-3 flex-1 text-sm text-slate-600">{research.summary}</p>
      <div className="flex flex-wrap gap-1">
        {research.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </Link>
  );
}
