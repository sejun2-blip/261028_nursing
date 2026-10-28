// 데이터 모델 정의
// 각 타입은 2차에서 만들 Firestore 컬렉션과 1:1로 대응합니다.
// (id 는 Firestore 문서 ID이므로 문서 본문에는 저장하지 않고, 읽을 때 붙여서 돌려줍니다.)

/** 날짜는 ISO 8601 문자열로 다룹니다. Firestore 연동 시 Timestamp ↔ 문자열 변환만 하면 되도록 통일 */
export type ISODateString = string;

export type Role = 'admin' | 'member';

export interface LinkItem {
  label: string;
  url: string;
}

/** users/{uid} */
export interface User {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: ISODateString;
}

export type ResearchStatus = 'ongoing' | 'completed';

/** research/{id} */
export interface Research {
  id: string;
  title: string;
  summary: string;
  abstract: string;
  /** 상세 페이지의 '연구 방법' 영역 (명세의 상세 화면 요구에 맞춰 추가한 필드) */
  methods: string;
  /** 상세 페이지의 '결과 요약' 영역 (진행 중인 연구는 비워 둘 수 있음) */
  results: string;
  tags: string[];
  year: number;
  status: ResearchStatus;
  links: LinkItem[];
  createdAt: ISODateString;
}

/** materials/{id} */
export interface Material {
  id: string;
  title: string;
  description: string;
  course: string;
  links: LinkItem[];
  createdAt: ISODateString;
}

/** posts/{id} */
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  /** 어느 연구에 대한 토론인지 (선택) */
  researchId?: string;
  createdAt: ISODateString;
  /** 댓글 수를 글 문서에 함께 저장해, 목록에서 댓글을 따로 세지 않도록 함(읽기 횟수 절약) */
  commentCount: number;
}

/** posts/{id}/comments/{cid} */
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: ISODateString;
}

// ---- 서비스 입출력용 보조 타입 ----

/**
 * 목록을 '한 페이지씩' 가져오기 위한 결과 형식.
 * nextCursor 가 null 이면 더 가져올 항목이 없다는 뜻입니다.
 * (Firestore 의 limit + startAfter 방식과 그대로 대응)
 */
export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface PageOptions {
  limit?: number;
  cursor?: string | null;
}

export interface NewPostInput {
  title: string;
  content: string;
  researchId?: string;
}
