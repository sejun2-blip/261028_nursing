// 모든 페이지의 공통 틀: 본문 바로가기 → 상단 메뉴 → 본문 → 푸터
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function Layout() {
  const { pathname } = useLocation();

  // 페이지를 옮기면 맨 위에서 시작 (SPA 는 기본적으로 스크롤 위치가 유지되기 때문)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 키보드 사용자가 메뉴를 건너뛰고 바로 본문으로 갈 수 있게 함 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        본문 바로가기
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="container-page flex-1 py-8 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
