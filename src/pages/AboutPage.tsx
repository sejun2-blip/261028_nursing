// 소개: 연구실 소개, 연구 분야, 구성원, 연구윤리 안내
import EthicsNotice from '../components/EthicsNotice';
import PageHeader from '../components/PageHeader';
import lab from '../data/lab.json';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function AboutPage() {
  useDocumentTitle('소개');
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="연구실 소개" description={lab.tagline} />

      <section>
        <p className="leading-relaxed text-slate-700">{lab.intro}</p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-brand-900">연구 분야</h2>
        <ul className="flex flex-wrap gap-2">
          {lab.researchAreas.map((area) => (
            <li key={area} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
              {area}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-brand-900">구성원</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {lab.members.map((m) => (
            <li key={m.name} className="card">
              <p className="font-semibold text-brand-900">{m.name}</p>
              <p className="text-sm text-accent-700">{m.position}</p>
              <p className="mt-2 text-sm text-slate-600">관심 분야: {m.interests}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-brand-900">이용 안내</h2>
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>연구·수업 자료와 토론 글은 누구나 읽을 수 있습니다.</li>
          <li>토론 글과 댓글은 로그인한 구성원만 작성할 수 있으며, 본인 글은 직접 삭제할 수 있습니다.</li>
          <li>파일은 OneDrive·Google Drive 공유 링크로만 공유합니다.</li>
        </ul>
        <EthicsNotice />
      </section>

      <section className="mt-10 text-sm text-slate-600">
        문의:{' '}
        <a href={`mailto:${lab.contactEmail}`} className="link">
          {lab.contactEmail}
        </a>
      </section>
    </div>
  );
}
