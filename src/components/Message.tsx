// 불러오는 중 / 비어 있음 / 오류 등 간단한 안내 문구 상자
import type { ReactNode } from 'react';

export function Message({ children }: { children: ReactNode }) {
  return <p className="card px-4 py-6 text-center text-sm text-slate-500">{children}</p>;
}
