// 상단 메뉴: 넓은 화면에서는 가로 메뉴, 좁은 화면(모바일)에서는 '메뉴' 버튼으로 펼침
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SITE_NAME } from '../config';
import { useAuth } from '../hooks/useAuth';
import RoleBadge from './RoleBadge';

const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/research', label: '연구', end: false },
  { to: '/materials', label: '수업 자료', end: false },
  { to: '/discussions', label: '토론', end: false },
  { to: '/about', label: '소개', end: false },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-800'
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // 페이지가 바뀌면 모바일 메뉴를 자동으로 닫음
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-base font-bold text-brand-800 sm:text-lg">
          <span aria-hidden="true" className="inline-block h-6 w-1.5 rounded-full bg-accent-600" />
          {SITE_NAME}
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <nav aria-label="주 메뉴">
            <ul className="flex gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={navClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <UserArea />
        </div>

        <button
          type="button"
          className="btn-secondary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '닫기' : '메뉴'}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page py-3">
            <nav aria-label="주 메뉴">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end} className={navClass}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <UserArea />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function UserArea() {
  const { user, loading, signOut } = useAuth();
  if (loading) return null;
  if (!user) {
    return (
      <Link to="/login" className="btn-primary">
        로그인
      </Link>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-slate-700">{user.name}</span>
      <RoleBadge role={user.role} />
      <button type="button" className="btn-secondary btn-sm" onClick={() => void signOut()}>
        로그아웃
      </button>
    </div>
  );
}
