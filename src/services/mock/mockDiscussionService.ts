// Mock 토론 서비스: 글과 댓글을 브라우저 localStorage 에 저장합니다.
// ⚠️ 이 브라우저에서만 보입니다. 다른 사람과 실제로 공유되려면 2차(Firebase) 연동이 필요합니다.

import { COMMENTS_PAGE_SIZE, POSTS_PAGE_SIZE } from '../../config';
import type { Comment, Page, Post, User } from '../../types';
import type { DiscussionService } from '../types';
import { byNewest, hasKey, newId, readJson, writeJson } from './storage';

const POSTS_KEY = 'posts';
/** 댓글은 Firestore 하위 컬렉션(posts/{id}/comments)처럼 글 ID 별로 묶어서 저장 */
const COMMENTS_KEY = 'comments';
type CommentStore = Record<string, Comment[]>;

/** 처음 방문했을 때 화면이 비어 보이지 않도록 예시 글 2건을 넣어 둠 */
function seedIfEmpty(): void {
  if (hasKey(POSTS_KEY)) return;
  const posts: Post[] = [
    {
      id: 'sample-post-1',
      title: '말초신경병증 증상 클러스터 분석 방법에 대한 의견을 구합니다',
      content:
        '잠재계층분석(LCA)과 군집분석 중 어떤 방법이 우리 자료(n=180)에 더 적합할지 고민 중입니다.\n표본 크기를 고려하면 LCA 의 모형 적합도 지표 해석에 주의가 필요할 것 같습니다. 의견 부탁드립니다.',
      authorId: 'sample-member',
      authorName: '김연구 (박사과정)',
      researchId: 'cipn-genetic-2026',
      createdAt: '2026-10-20T09:00:00.000Z',
      commentCount: 1,
    },
    {
      id: 'sample-post-2',
      title: 'IPE 시뮬레이션 디브리핑 질문지 공유',
      content: '지난 학기에 사용한 PEARLS 기반 디브리핑 질문 목록을 정리했습니다. 개선할 점이 있으면 댓글로 남겨 주세요.',
      authorId: 'sample-member-2',
      authorName: '이간호 (석사과정)',
      researchId: 'ipe-simulation-2025',
      createdAt: '2026-10-15T05:30:00.000Z',
      commentCount: 0,
    },
  ];
  const comments: CommentStore = {
    'sample-post-1': [
      {
        id: 'sample-comment-1',
        content: 'BIC 와 엔트로피를 함께 보고, 임상적 해석 가능성도 기준에 넣으면 좋겠습니다.',
        authorId: 'sample-member-2',
        authorName: '이간호 (석사과정)',
        createdAt: '2026-10-20T12:00:00.000Z',
      },
    ],
  };
  writeJson(POSTS_KEY, posts);
  writeJson(COMMENTS_KEY, comments);
}

function loadPosts(): Post[] {
  seedIfEmpty();
  return readJson<Post[]>(POSTS_KEY, []);
}

function loadComments(): CommentStore {
  seedIfEmpty();
  return readJson<CommentStore>(COMMENTS_KEY, {});
}

/** 본인 또는 관리자만 삭제 가능 (2차 보안 규칙과 같은 조건) */
function canDelete(actor: User, authorId: string): boolean {
  return actor.role === 'admin' || actor.uid === authorId;
}

/** cursor(마지막으로 받은 항목의 id) 다음부터 limit 개를 잘라 한 페이지를 만듦 */
function paginate<T extends { id: string }>(sorted: T[], limit: number, cursor?: string | null): Page<T> {
  const start = cursor ? sorted.findIndex((x) => x.id === cursor) + 1 : 0;
  const items = sorted.slice(start, start + limit);
  const hasMore = start + limit < sorted.length;
  return { items, nextCursor: hasMore && items.length > 0 ? items[items.length - 1].id : null };
}

export const mockDiscussionService: DiscussionService = {
  async listPosts(options) {
    let posts = loadPosts().sort(byNewest);
    if (options?.researchId) posts = posts.filter((p) => p.researchId === options.researchId);
    return paginate(posts, options?.limit ?? POSTS_PAGE_SIZE, options?.cursor);
  },

  async getPost(id) {
    return loadPosts().find((p) => p.id === id) ?? null;
  },

  async createPost(input, actor) {
    const post: Post = {
      id: newId(),
      title: input.title.trim(),
      content: input.content.trim(),
      authorId: actor.uid,
      authorName: actor.name,
      ...(input.researchId ? { researchId: input.researchId } : {}),
      createdAt: new Date().toISOString(),
      commentCount: 0,
    };
    writeJson(POSTS_KEY, [post, ...loadPosts()]);
    return post;
  },

  async deletePost(id, actor) {
    const posts = loadPosts();
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    if (!canDelete(actor, target.authorId)) throw new Error('이 글을 삭제할 권한이 없습니다.');
    writeJson(POSTS_KEY, posts.filter((p) => p.id !== id));
    // 글이 지워지면 딸린 댓글도 함께 정리
    const comments = loadComments();
    delete comments[id];
    writeJson(COMMENTS_KEY, comments);
  },

  async listComments(postId, options) {
    // 댓글은 대화 흐름대로 오래된 순으로 보여 줌
    const list = [...(loadComments()[postId] ?? [])].sort(byNewest).reverse();
    return paginate(list, options?.limit ?? COMMENTS_PAGE_SIZE, options?.cursor);
  },

  async addComment(postId, content, actor) {
    const posts = loadPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('글을 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.');
    const comment: Comment = {
      id: newId(),
      content: content.trim(),
      authorId: actor.uid,
      authorName: actor.name,
      createdAt: new Date().toISOString(),
    };
    const comments = loadComments();
    comments[postId] = [...(comments[postId] ?? []), comment];
    writeJson(COMMENTS_KEY, comments);
    post.commentCount += 1;
    writeJson(POSTS_KEY, posts);
    return comment;
  },

  async deleteComment(postId, commentId, actor) {
    const comments = loadComments();
    const list = comments[postId] ?? [];
    const target = list.find((c) => c.id === commentId);
    if (!target) return;
    if (!canDelete(actor, target.authorId)) throw new Error('이 댓글을 삭제할 권한이 없습니다.');
    comments[postId] = list.filter((c) => c.id !== commentId);
    writeJson(COMMENTS_KEY, comments);
    const posts = loadPosts();
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      writeJson(POSTS_KEY, posts);
    }
  },
};
