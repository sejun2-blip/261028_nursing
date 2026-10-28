// 연구윤리 안내: 환자 정보·IRB 대상 원자료 게시 금지
// (토론 글쓰기 화면과 소개 페이지에 표시)
export default function EthicsNotice() {
  return (
    <aside
      aria-label="연구윤리 안내"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
    >
      <p className="font-semibold">⚠️ 연구윤리 안내</p>
      <p className="mt-1">
        <strong>환자 개인정보</strong>(이름, 등록번호, 생년월일, 사진 등)와 <strong>IRB 승인 대상 원자료</strong>(설문 원자료, 검체·유전 정보, 의무기록 등)는
        이 사이트에 올리지 마십시오. 요약된 결과와 비식별화된 정보만 공유하고, 원자료는 연구실 보안 저장소에서 관리합니다.
      </p>
    </aside>
  );
}
