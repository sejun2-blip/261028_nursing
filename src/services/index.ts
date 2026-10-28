// ★ 데이터 연결 '스위치' 파일 ★
// 화면 코드는 오직 이 파일에서 내보내는 객체만 사용합니다.
// 2차(Firebase)에서는 아래 import 경로를 './firebase/...' 로 바꾸기만 하면 전체가 교체됩니다.

import { mockAuthService } from './mock/mockAuthService';
import { mockDiscussionService } from './mock/mockDiscussionService';
import { mockMaterialService } from './mock/mockMaterialService';
import { mockResearchService } from './mock/mockResearchService';
import type { AuthService, DiscussionService, MaterialService, ResearchService } from './types';

export const authService: AuthService = mockAuthService;
export const researchService: ResearchService = mockResearchService;
export const materialService: MaterialService = mockMaterialService;
export const discussionService: DiscussionService = mockDiscussionService;

/** 화면에 '시험용(Mock) 모드' 안내를 띄울지 판단하는 데 사용 */
export const IS_MOCK = true;

export type * from './types';
