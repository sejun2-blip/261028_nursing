// 토론 글 목록의 한 줄
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import DateText from './DateText';

interface Props {
  post: Post;
  /** 연결된 연구 제목 (있을 때만 표시) */
  researchTitle?: string;
}

export default function PostListItem({ post, researchTitle }: Props) {
  return (
    <li className="py-4">
      <h3 className="font-semibold text-brand-900">
        <Link to={`/discussions/${post.id}`} className="hover:text-accent-700 hover:underline">
          {post.title}
        </Link>
      </h3>
      {researchTitle && <p className="mt-1 line-clamp-1 text-xs text-accent-700">관련 연구: {researchTitle}</p>}
      <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
        <span>{post.authorName}</span>
        <DateText value={post.createdAt} />
        <span>댓글 {post.commentCount}</span>
      </p>
    </li>
  );
}
