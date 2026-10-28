// 상단 메뉴: 사이트 이름, 페이지 이동 링크, 로그인 사용자 표시 (모바일에서는 메뉴 버튼으로 접힘)
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AppUser } from '../services/types';
import { RoleBadge } from './Badges';

const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/research', label: '연구', end: false },
  { to: '/teaching', label: '수업 자료', end: false },
];

export default function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-base font-bold text-brand-800 sm:text-lg" onClick={() => setOpen(false)}>
          간호학 연구·교육 아카이브
        </Link>

        <button
          type="button"
          className="btn-secondary sm:hidden"
          aria-expanded={open}
          aria-label="메뉴 열기"
          onClick={() => setOpen((v) => !v)}
        >
          메뉴
        </button>

        <div className="hidden items-center gap-4 sm:flex">
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <UserArea user={user} onSignOut={signOut} />
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 px-4 py-3 sm:hidden">
          <nav className="mb-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <UserArea user={user} onSignOut={signOut} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}

interface UserAreaProps {
  user: AppUser | null;
  onSignOut: () => Promise<void>;
  onNavigate?: () => void;
}

function UserArea({ user, onSignOut, onNavigate }: UserAreaProps) {
  if (!user) {
    return (
      <Link to="/login" className="btn-primary" onClick={onNavigate}>
        로그인
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-slate-700">{user.displayName}</span>
      <RoleBadge role={user.role} />
      <button type="button" className="btn-secondary" onClick={() => void onSignOut()}>
        로그아웃
      </button>
    </div>
  );
}
