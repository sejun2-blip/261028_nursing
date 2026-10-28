// 데이터 서비스: 화면은 DataService 인터페이스만 사용하고, 현재는 mock 구현(메모리 + localStorage)을 내보냅니다.
// 다음 단계에서 mockDataService 대신 Firestore 구현으로 교체합니다. 모든 함수는 Promise를 반환합니다.
import { byNewest, nowIso } from '../lib/date';
import { SEED_COMMENTS, SEED_MATERIALS, SEED_RESEARCHES } from './mockData';
import type { AppUser, Comment, Material, MaterialInput, Research, ResearchInput, ResearchQuery } from './types';

export interface DataService {
  // 연구
  listResearches(query?: ResearchQuery): Promise<Research[]>;
  getResearch(id: string): Promise<Research | null>;
  createResearch(input: ResearchInput, author: AppUser): Promise<Research>;
  updateResearch(id: string, input: ResearchInput): Promise<Research>;
  deleteResearch(id: string): Promise<void>;
  // 댓글 (연구 하위 컬렉션)
  listComments(researchId: string): Promise<Comment[]>;
  addComment(researchId: string, text: string, author: AppUser): Promise<Comment>;
  deleteComment(researchId: string, commentId: string): Promise<void>;
  // 수업 자료
  listMaterials(query?: { limit?: number }): Promise<Material[]>;
  getMaterial(id: string): Promise<Material | null>;
  createMaterial(input: MaterialInput): Promise<Material>;
  updateMaterial(id: string, input: MaterialInput): Promise<Material>;
  deleteMaterial(id: string): Promise<void>;
}

// ---------------- mock 구현 ----------------

interface MockDb {
  researches: Research[];
  comments: Record<string, Comment[]>;
  materials: Material[];
}

const DB_KEY = 'nursing-archive:mock-db-v1';

function loadDb(): MockDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    // 손상된 데이터는 무시하고 예시 데이터로 다시 시작
  }
  return structuredClone({ researches: SEED_RESEARCHES, comments: SEED_COMMENTS, materials: SEED_MATERIALS });
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function createMockDataService(): DataService {
  const db = loadDb();

  function save(): void {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      // 저장 실패 시 메모리에만 유지
    }
  }

  // 호출하는 쪽이 원본을 직접 바꾸지 못하도록 복사본을 돌려줌 (Firestore와 동일한 동작)
  const copy = <T>(value: T): T => structuredClone(value);

  return {
    async listResearches(query = {}) {
      const search = query.search?.trim().toLowerCase();
      let result = [...db.researches].sort(byNewest);
      if (query.tag) result = result.filter((r) => r.tags.includes(query.tag as string));
      if (search) result = result.filter((r) => r.title.toLowerCase().includes(search));
      if (query.limit) result = result.slice(0, query.limit);
      return copy(result);
    },
    async getResearch(id) {
      const found = db.researches.find((r) => r.id === id);
      return found ? copy(found) : null;
    },
    async createResearch(input, author) {
      const now = nowIso();
      const research: Research = { ...input, id: newId('r'), authorId: author.uid, createdAt: now, updatedAt: now };
      db.researches.push(research);
      save();
      return copy(research);
    },
    async updateResearch(id, input) {
      const index = db.researches.findIndex((r) => r.id === id);
      if (index < 0) throw new Error('연구를 찾을 수 없습니다.');
      db.researches[index] = { ...db.researches[index], ...input, updatedAt: nowIso() };
      save();
      return copy(db.researches[index]);
    },
    async deleteResearch(id) {
      db.researches = db.researches.filter((r) => r.id !== id);
      delete db.comments[id];
      save();
    },

    async listComments(researchId) {
      // 댓글은 오래된 순(대화 흐름 순)으로 표시
      const list = db.comments[researchId] ?? [];
      return copy([...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    },
    async addComment(researchId, text, author) {
      const comment: Comment = {
        id: newId('c'),
        authorId: author.uid,
        authorName: author.displayName,
        text,
        createdAt: nowIso(),
      };
      db.comments[researchId] = [...(db.comments[researchId] ?? []), comment];
      save();
      return copy(comment);
    },
    async deleteComment(researchId, commentId) {
      db.comments[researchId] = (db.comments[researchId] ?? []).filter((c) => c.id !== commentId);
      save();
    },

    async listMaterials(query = {}) {
      let result = [...db.materials].sort(byNewest);
      if (query.limit) result = result.slice(0, query.limit);
      return copy(result);
    },
    async getMaterial(id) {
      const found = db.materials.find((m) => m.id === id);
      return found ? copy(found) : null;
    },
    async createMaterial(input) {
      const material: Material = { ...input, id: newId('m'), createdAt: nowIso() };
      db.materials.push(material);
      save();
      return copy(material);
    },
    async updateMaterial(id, input) {
      const index = db.materials.findIndex((m) => m.id === id);
      if (index < 0) throw new Error('자료를 찾을 수 없습니다.');
      db.materials[index] = { ...db.materials[index], ...input };
      save();
      return copy(db.materials[index]);
    },
    async deleteMaterial(id) {
      db.materials = db.materials.filter((m) => m.id !== id);
      save();
    },
  };
}

export const dataService: DataService = createMockDataService();
