// 목록을 '한 페이지씩' 불러오는 도우미 ("더 보기" 버튼 방식)
// 실시간 구독을 쓰지 않으므로, 글을 쓰거나 지운 뒤에는 reload() 로 처음부터 다시 불러옵니다.
// fetchPage 는 useCallback 으로 감싸서 넘겨야 합니다.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Page } from '../types';

export function usePagedList<T>(fetchPage: (cursor: string | null) => Promise<Page<T>>) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 화면을 떠났거나 다시 불러오기를 시작한 뒤 도착한 '옛 응답'을 무시하기 위한 번호
  const requestId = useRef(0);

  const load = useCallback(
    async (from: string | null, append: boolean) => {
      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const page = await fetchPage(from);
        if (id !== requestId.current) return;
        setItems((prev) => (append ? [...prev, ...page.items] : page.items));
        setCursor(page.nextCursor);
      } catch (err) {
        if (id !== requestId.current) return;
        setError(err instanceof Error ? err.message : '목록을 불러오지 못했습니다.');
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    void load(null, false);
    return () => {
      requestId.current += 1;
    };
  }, [load]);

  return {
    items,
    loading,
    error,
    hasMore: cursor !== null,
    loadMore: () => void load(cursor, true),
    reload: () => void load(null, false),
  };
}
