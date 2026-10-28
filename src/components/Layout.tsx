// 모든 페이지 공통 틀: 상단 메뉴 + 연구윤리 고지 배너 + 본문 + 하단 정보
import { Outlet } from 'react-router-dom';
import EthicsBanner from './EthicsBanner';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EthicsBanner />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        간호학 연구·교육 아카이브 · 연구실 내부용
      </footer>
    </div>
  );
}
