// mock 단계에서 쓰는 예시 데이터 (간호학 연구·수업 자료 예시). Firebase 연동 후에는 삭제합니다.
import type { AppUser, Comment, Material, Research } from './types';

export const MOCK_USERS: AppUser[] = [
  {
    uid: 'mock-admin',
    displayName: '김교수',
    email: 'professor@example.ac.kr',
    photoURL: null,
    role: 'admin',
  },
  {
    uid: 'mock-member',
    displayName: '이대학원생',
    email: 'student@example.ac.kr',
    photoURL: null,
    role: 'member',
  },
];

export const SEED_RESEARCHES: Research[] = [
  {
    id: 'r1',
    title: '유전성 유방암 고위험군 여성의 유전상담 경험',
    summary:
      'BRCA1/2 변이 보유 여성이 유전상담 및 예방적 의사결정 과정에서 겪는 경험을 질적 연구로 탐색한다. 간호사 주도 유전상담 프로그램 개발의 기초자료로 활용한다.',
    tags: ['유전간호', '종양간호'],
    status: 'ongoing',
    links: [
      { label: '연구계획서 (OneDrive)', url: 'https://onedrive.live.com/' },
      { label: '참고문헌 목록 (Google Drive)', url: 'https://drive.google.com/' },
    ],
    authorId: 'mock-admin',
    createdAt: '2026-09-02T01:00:00.000Z',
    updatedAt: '2026-10-10T01:00:00.000Z',
  },
  {
    id: 'r2',
    title: '간호·의학·약학 전공생 대상 IPE 시뮬레이션 교육의 효과',
    summary:
      '패혈증 환자 시나리오 기반 다학제 시뮬레이션이 팀워크 태도와 의사소통 역량에 미치는 효과를 유사실험 설계로 검증한다.',
    tags: ['IPE', '시뮬레이션', '간호교육'],
    status: 'planned',
    links: [{ label: 'TeamSTEPPS 관련 자료', url: 'https://www.ahrq.gov/teamstepps-program/index.html' }],
    authorId: 'mock-admin',
    createdAt: '2026-10-01T01:00:00.000Z',
    updatedAt: '2026-10-01T01:00:00.000Z',
  },
  {
    id: 'r3',
    title: '항암화학요법 환자의 말초신경병증 자가관리 프로그램 개발',
    summary:
      '화학요법 유발 말초신경병증(CIPN) 환자를 위한 모바일 기반 자가관리 프로그램을 개발하고 예비 적용 결과를 분석하였다.',
    tags: ['종양간호'],
    status: 'done',
    links: [
      { label: '게재 논문 (DOI)', url: 'https://doi.org/' },
      { label: '발표 자료 (Google Drive)', url: 'https://drive.google.com/' },
    ],
    authorId: 'mock-admin',
    createdAt: '2026-03-15T01:00:00.000Z',
    updatedAt: '2026-08-20T01:00:00.000Z',
  },
  {
    id: 'r4',
    title: '약물유전체 기반 간호교육 콘텐츠 요구도 조사',
    summary:
      '임상간호사를 대상으로 약물유전체(pharmacogenomics) 지식 수준과 교육 요구도를 조사하여 보수교육 콘텐츠 개발 방향을 제시한다.',
    tags: ['유전간호', '간호교육'],
    status: 'ongoing',
    links: [{ label: '설문 문항 초안 (OneDrive)', url: 'https://onedrive.live.com/' }],
    authorId: 'mock-admin',
    createdAt: '2026-10-20T01:00:00.000Z',
    updatedAt: '2026-10-25T01:00:00.000Z',
  },
];

/** 연구 id → 댓글 목록 (Firestore의 researches/{id}/comments 하위 컬렉션에 해당) */
export const SEED_COMMENTS: Record<string, Comment[]> = {
  r1: [
    {
      id: 'c1',
      authorId: 'mock-member',
      authorName: '이대학원생',
      text: '면담 질문지 3번 문항은 참여자가 이해하기 어려울 수 있어 표현을 조정해 보면 어떨까요?',
      createdAt: '2026-10-12T05:30:00.000Z',
    },
    {
      id: 'c2',
      authorId: 'mock-admin',
      authorName: '김교수',
      text: '좋은 의견입니다. 다음 랩미팅 때 수정안을 함께 검토합시다.',
      createdAt: '2026-10-12T08:10:00.000Z',
    },
  ],
  r2: [
    {
      id: 'c3',
      authorId: 'mock-member',
      authorName: '이대학원생',
      text: '측정도구로 TAQ(TeamSTEPPS Teamwork Attitudes Questionnaire) 한국어판 사용을 제안드립니다.',
      createdAt: '2026-10-05T02:00:00.000Z',
    },
  ],
};

export const SEED_MATERIALS: Material[] = [
  {
    id: 'm1',
    course: '약리학',
    title: '자율신경계 약물 강의 슬라이드',
    description: '콜린성·아드레날린성 약물의 작용기전과 간호 시 유의사항',
    links: [{ label: '강의 슬라이드 (OneDrive)', url: 'https://onedrive.live.com/' }],
    createdAt: '2026-09-05T01:00:00.000Z',
  },
  {
    id: 'm2',
    course: '유전간호',
    title: '가계도(Pedigree) 작성 실습 자료',
    description: '표준 가계도 기호와 3세대 가계도 작성 실습지',
    links: [
      { label: '실습지 (Google Drive)', url: 'https://drive.google.com/' },
      { label: 'NSGC 가계도 표기 지침', url: 'https://www.nsgc.org/' },
    ],
    createdAt: '2026-09-12T01:00:00.000Z',
  },
  {
    id: 'm3',
    course: 'IPE',
    title: '다학제 팀 의사소통(SBAR) 사례 토의',
    description: '간호·의학·약학 학생 공동 토의용 SBAR 사례와 진행 안내',
    links: [{ label: '사례 자료 (OneDrive)', url: 'https://onedrive.live.com/' }],
    createdAt: '2026-10-02T01:00:00.000Z',
  },
  {
    id: 'm4',
    course: '약리학',
    title: '항암제 분류와 부작용 관리 정리표',
    description: '세포독성 항암제·표적치료제·면역항암제 비교 요약',
    links: [{ label: '정리표 (Google Drive)', url: 'https://drive.google.com/' }],
    createdAt: '2026-10-15T01:00:00.000Z',
  },
  {
    id: 'm5',
    course: '간호교육론',
    title: '시뮬레이션 디브리핑 모형 비교',
    description: 'PEARLS, GAS, Plus-Delta 디브리핑 모형의 특징 비교',
    links: [{ label: '읽기 자료 (Google Drive)', url: 'https://drive.google.com/' }],
    createdAt: '2026-10-22T01:00:00.000Z',
  },
];
