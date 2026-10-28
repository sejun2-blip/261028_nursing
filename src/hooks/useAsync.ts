// 서비스에서 데이터를 '한 번' 불러오는 공통 도우미 (로딩·오류 상태 포함)
// 실시간 구독 대신 1회 조회 방식을 쓰고, 필요할 때 reload() 로 다시 불러옵니다.
// fn 은 useCallback 으로 감싸서 넘겨야 불필요한 재조회가 일어나지 않습니다.
import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let alive = true; // 화면을 떠난 뒤 도착한 응답은 무시
    setState((s) => ({ ...s, loading: true, error: null }));
    fn().then(
      (data) => alive && setState({ data, loading: false, error: null }),
      (err: unknown) =>
        alive &&
        setState({ data: undefined, loading: false, error: err instanceof Error ? err.message : '불러오지 못했습니다.' }),
    );
    return () => {
      alive = false;
    };
  }, [fn, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
