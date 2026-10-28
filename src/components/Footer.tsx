// 하단 정보 영역
import { Link } from 'react-router-dom';
import lab from '../data/lab.json';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50">
      <div className="container-page flex flex-col gap-2 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {lab.name}. 연구·교육 목적의 비영리 사이트입니다.
        </p>
        <p className="flex gap-4">
          <Link to="/about" className="link">
            연구실 소개
          </Link>
          <a href={`mailto:${lab.contactEmail}`} className="link">
            문의
          </a>
        </p>
      </div>
    </footer>
  );
}
