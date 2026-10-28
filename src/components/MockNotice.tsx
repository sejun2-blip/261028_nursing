// 1차 시험 버전임을 알리는 안내 (2차 Firebase 연동 후에는 표시되지 않음)
import { IS_MOCK } from '../services';

export default function MockNotice() {
  if (!IS_MOCK) return null;
  return (
    <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
      시험 운영 중: 토론 글과 로그인 정보는 현재 이 브라우저에만 저장되며 다른 사람에게는 보이지 않습니다.
    </p>
  );
}
