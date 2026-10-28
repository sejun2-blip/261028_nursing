// 연구 주제 태그 목록
export default function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="태그">
      {tags.map((tag) => (
        <li key={tag} className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
          #{tag}
        </li>
      ))}
    </ul>
  );
}
