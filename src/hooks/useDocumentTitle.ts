// 브라우저 탭 제목을 페이지마다 바꿔 줌 (화면낭독기 사용자도 현재 페이지를 알 수 있음)
import { useEffect } from 'react';
import { SITE_NAME } from '../config';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
