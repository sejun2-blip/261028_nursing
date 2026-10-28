// 없는 주소로 들어왔을 때 보여주는 화면
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="card p-8 text-center">
      <h1 className="mb-2 text-xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
      <p className="mb-4 text-sm text-slate-600">주소가 바뀌었거나 삭제된 페이지일 수 있습니다.</p>
      <Link to="/" className="btn-primary">홈으로</Link>
    </div>
  );
}
