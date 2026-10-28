// 전 페이지 상단에 항상 표시되는 연구윤리 고지 배너
export default function EthicsBanner() {
  return (
    <div role="note" className="border-b border-amber-200 bg-amber-50">
      <p className="mx-auto max-w-5xl px-4 py-2 text-xs text-amber-900 sm:text-sm">
        <strong className="font-semibold">연구윤리 고지</strong> · 환자 개인정보, IRB 비공개 자료, 미발표 원자료는
        업로드·게시하지 마세요.
      </p>
    </div>
  );
}
