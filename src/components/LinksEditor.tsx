// 추가·수정 폼에서 쓰는 링크 입력 목록 (이름 + 주소). 파일 업로드 없이 외부 링크만 받습니다.
import type { ResourceLink } from '../services/types';

interface Props {
  links: ResourceLink[];
  onChange: (links: ResourceLink[]) => void;
}

export default function LinksEditor({ links, onChange }: Props) {
  const update = (index: number, field: keyof ResourceLink, value: string) =>
    onChange(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)));

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex flex-col gap-2 sm:flex-row">
          <input
            className="input sm:w-1/3"
            placeholder="링크 이름 (예: 연구계획서)"
            value={link.label}
            onChange={(e) => update(i, 'label', e.target.value)}
          />
          <input
            className="input flex-1"
            type="url"
            placeholder="https://..."
            value={link.url}
            onChange={(e) => update(i, 'url', e.target.value)}
          />
          <button type="button" className="btn-danger" onClick={() => onChange(links.filter((_, j) => j !== i))}>
            삭제
          </button>
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={() => onChange([...links, { label: '', url: '' }])}>
        + 링크 추가
      </button>
      <p className="text-xs text-slate-500">OneDrive, Google Drive, 논문 DOI 등 외부 주소만 입력합니다(파일 업로드 없음).</p>
    </div>
  );
}

/** 빈 줄은 제거하고, 주소가 올바른지 검사합니다. 문제가 있으면 오류 문구를 반환합니다. */
export function cleanLinks(links: ResourceLink[], isValid: (url: string) => boolean): ResourceLink[] | string {
  const filled = links
    .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
    .filter((l) => l.label || l.url);
  for (const link of filled) {
    if (!isValid(link.url)) return `링크 주소가 올바르지 않습니다: ${link.url || '(비어 있음)'} — http:// 또는 https:// 로 시작해야 합니다.`;
  }
  return filled.map((l) => ({ label: l.label || l.url, url: l.url }));
}
