// Mock 연구 서비스: src/data/research.json 샘플 데이터를 읽어 돌려줍니다.

import researchData from '../../data/research.json';
import type { Research, ResearchStatus } from '../../types';
import type { ResearchService } from '../types';
import { byNewest } from './storage';

// JSON 은 status 를 일반 문자열로 인식하므로, 허용 값만 통과시키며 타입을 맞춤
const all: Research[] = researchData
  .map((r) => ({ ...r, status: (r.status === 'completed' ? 'completed' : 'ongoing') as ResearchStatus }))
  .sort(byNewest);

export const mockResearchService: ResearchService = {
  async list(options) {
    return options?.limit ? all.slice(0, options.limit) : [...all];
  },
  async getById(id) {
    return all.find((r) => r.id === id) ?? null;
  },
};
