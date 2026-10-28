// 외부 자료 링크 목록 (OneDrive/Google Drive 공유 링크 등)
import type { LinkItem } from '../types';

/** http/https 주소만 링크로 만들어, 잘못된 형식(javascript: 등)이 실행되지 않게 함 */
function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

export default function LinkList({ links }: { links: LinkItem[] }) {
  const safe = links.filter((l) => isSafeUrl(l.url));
  if (safe.length === 0) return <p className="text-sm text-slate-500">등록된 자료 링크가 없습니다.</p>;
  return (
    <ul className="flex flex-col gap-1.5">
      {safe.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="link text-sm">
            {l.label}
            <span aria-hidden="true"> ↗</span>
            <span className="sr-only"> (새 창에서 열림)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
