// 앱 시작점: 라우터와 로그인 상태 공급자를 감싼 뒤 화면을 그립니다.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root 요소를 찾을 수 없습니다.');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
