// 404: 없는 주소이거나 삭제된 항목
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage({ message = '요청하신 페이지를 찾을 수 없습니다.' }: { message?: string }) {
  useDocumentTitle('페이지를 찾을 수 없음');
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-5xl font-bold text-brand-100">404</p>
      <h1 className="mt-4 text-xl font-bold text-brand-900">{message}</h1>
      <p className="mt-2 text-sm text-slate-600">주소가 바뀌었거나 삭제되었을 수 있습니다.</p>
      <Link to="/" className="btn-primary mt-6">
        홈으로 가기
      </Link>
    </div>
  );
}
