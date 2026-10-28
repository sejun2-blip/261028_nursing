// Mock 수업 자료 서비스: src/data/materials.json 샘플 데이터를 읽어 돌려줍니다.

import materialData from '../../data/materials.json';
import type { Material } from '../../types';
import type { MaterialService } from '../types';
import { byNewest } from './storage';

const all: Material[] = [...materialData].sort(byNewest);

export const mockMaterialService: MaterialService = {
  async list(filter) {
    const filtered = filter?.course ? all.filter((m) => m.course === filter.course) : all;
    return filter?.limit ? filtered.slice(0, filter.limit) : [...filtered];
  },
};
