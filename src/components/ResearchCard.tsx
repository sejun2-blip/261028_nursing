// 연구 목록에 쓰이는 카드
import { Link } from 'react-router-dom';
import type { Research } from '../types';
import StatusBadge from './StatusBadge';
import TagList from './TagList';

export default function ResearchCard({ research }: { research: Research }) {
  return (
    <article className="card flex h-full flex-col gap-3 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <StatusBadge status={research.status} />
        <span>{research.year}년</span>
      </div>
      <h3 className="text-lg font-semibold leading-snug text-brand-900">
        {/* 카드 전체가 아니라 제목을 링크로 두어, 화면낭독기에서 링크 문구가 명확하게 읽히도록 함 */}
        <Link to={`/research/${research.id}`} className="hover:text-accent-700 hover:underline">
          {research.title}
        </Link>
      </h3>
      <p className="line-clamp-3 text-sm text-slate-600">{research.summary}</p>
      <div className="mt-auto pt-1">
        <TagList tags={research.tags} />
      </div>
    </article>
  );
}
