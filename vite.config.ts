// Vite 빌드 설정 파일 (React 플러그인만 사용)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
