// 앱 전체에서 쓰는 공통 데이터 타입 (Firestore 컬렉션 구조와 1:1로 맞춤)
// 날짜는 모두 ISO 문자열(예: "2026-10-28T09:00:00.000Z")로 통일합니다. 변환은 src/lib/date.ts 에서만 합니다.

export type Role = 'admin' | 'member';

/** users/{uid} */
export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: Role;
}

export interface ResourceLink {
  label: string;
  url: string;
}

export type ResearchStatus = 'planned' | 'ongoing' | 'done';

/** researches/{id} */
export interface Research {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  status: ResearchStatus;
  links: ResourceLink[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

/** 연구 추가·수정 시 입력값 (id, 작성자, 날짜는 서비스가 채움) */
export type ResearchInput = Pick<Research, 'title' | 'summary' | 'tags' | 'status' | 'links'>;

/** researches/{id}/comments/{commentId} */
export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

/** materials/{id} */
export interface Material {
  id: string;
  course: string;
  title: string;
  description: string;
  links: ResourceLink[];
  createdAt: string;
}

export type MaterialInput = Pick<Material, 'course' | 'title' | 'description' | 'links'>;

/** 연구 목록 조회 조건 (Firestore 전환 시 where/limit 으로 옮기기 쉬운 형태) */
export interface ResearchQuery {
  tag?: string;
  search?: string;
  limit?: number;
}

export const STATUS_LABELS: Record<ResearchStatus, string> = {
  planned: '계획',
  ongoing: '진행중',
  done: '완료',
};

/** 화면에서 기본으로 제안하는 태그 / 과목 목록 */
export const RESEARCH_TAGS = ['유전간호', '종양간호', 'IPE', '시뮬레이션', '간호교육'];
export const COURSES = ['약리학', '유전간호', 'IPE', '해부학', '간호교육론', '상급종양전문간호학'];
