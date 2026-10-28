// 서비스 인터페이스(약속) 정의
// 화면(컴포넌트)은 이 약속만 알고, 실제 데이터가 어디서 오는지(mock / Firebase)는 모릅니다.
// 그래서 2차에서 Firebase 구현체를 만들어 끼워 넣어도 화면 코드는 고칠 필요가 없습니다.

import type { Comment, Material, NewPostInput, Page, PageOptions, Post, Research, User } from '../types';

/** 1차 Mock 로그인에서만 쓰는 값. Firebase(구글 로그인)에서는 구글 계정 정보를 쓰므로 무시됩니다. */
export interface SignInOptions {
  name?: string;
  email?: string;
}

export interface AuthService {
  /** 현재 로그인한 사용자 (없으면 null) */
  readonly currentUser: User | null;
  signIn(options?: SignInOptions): Promise<User>;
  signOut(): Promise<void>;
  /** 로그인 상태가 바뀔 때마다 알려 줍니다. 돌려받은 함수를 호출하면 알림이 중단됩니다. */
  onAuthChange(callback: (user: User | null) => void): () => void;
}

export interface ResearchService {
  /** 최신순 목록. limit 를 주면 그 개수만 가져옵니다. */
  list(options?: { limit?: number }): Promise<Research[]>;
  getById(id: string): Promise<Research | null>;
}

export interface MaterialFilter {
  course?: string;
  limit?: number;
}

export interface MaterialService {
  list(filter?: MaterialFilter): Promise<Material[]>;
}

export interface PostListOptions extends PageOptions {
  /** 특정 연구에 연결된 글만 보고 싶을 때 */
  researchId?: string;
}

/**
 * 토론 서비스.
 * 쓰기/삭제 함수는 '누가 하는지(actor)'를 함께 받습니다.
 * Mock 에서는 이 값으로 권한을 검사하고, Firebase 에서는 보안 규칙이 한 번 더 검사합니다.
 */
export interface DiscussionService {
  listPosts(options?: PostListOptions): Promise<Page<Post>>;
  getPost(id: string): Promise<Post | null>;
  createPost(input: NewPostInput, actor: User): Promise<Post>;
  deletePost(id: string, actor: User): Promise<void>;
  listComments(postId: string, options?: PageOptions): Promise<Page<Comment>>;
  addComment(postId: string, content: string, actor: User): Promise<Comment>;
  deleteComment(postId: string, commentId: string, actor: User): Promise<void>;
}
