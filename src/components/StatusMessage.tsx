// 불러오는 중 / 오류 / 비어 있음 상태를 같은 모양으로 보여 줌
import type { ReactNode } from 'react';

export function Loading({ label = '불러오는 중입니다…' }: { label?: string }) {
  return (
    <p role="status" className="py-6 text-sm text-slate-500">
      {label}
    </p>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">{children}</div>;
}
