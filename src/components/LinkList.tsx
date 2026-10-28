// 외부 자료 링크 목록 (새 탭으로 열림). 안전하지 않은 주소는 링크로 만들지 않습니다.
import { isSafeUrl } from '../lib/url';
import type { ResourceLink } from '../services/types';

export default function LinkList({ links }: { links: ResourceLink[] }) {
  if (links.length === 0) return <p className="text-sm text-slate-500">등록된 링크가 없습니다.</p>;
  return (
    <ul className="space-y-1.5">
      {links.map((link, i) => (
        <li key={`${link.url}-${i}`} className="text-sm">
          {isSafeUrl(link.url) ? (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 underline decoration-brand-100 underline-offset-2 hover:decoration-brand-700"
            >
              {link.label} ↗
            </a>
          ) : (
            <span className="text-slate-500">{link.label} (유효하지 않은 주소)</span>
          )}
        </li>
      ))}
    </ul>
  );
}
