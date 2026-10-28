// 라우트(주소 ↔ 화면) 정의. 관리자 전용 화면은 RequireAdmin으로 감쌉니다.
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAdmin from './components/RequireAdmin';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MaterialFormPage from './pages/MaterialFormPage';
import NotFoundPage from './pages/NotFoundPage';
import ResearchDetailPage from './pages/ResearchDetailPage';
import ResearchFormPage from './pages/ResearchFormPage';
import ResearchListPage from './pages/ResearchListPage';
import TeachingPage from './pages/TeachingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="research" element={<ResearchListPage />} />
            <Route path="research/new" element={<RequireAdmin><ResearchFormPage /></RequireAdmin>} />
            <Route path="research/:id" element={<ResearchDetailPage />} />
            <Route path="research/:id/edit" element={<RequireAdmin><ResearchFormPage /></RequireAdmin>} />
            <Route path="teaching" element={<TeachingPage />} />
            <Route path="teaching/new" element={<RequireAdmin><MaterialFormPage /></RequireAdmin>} />
            <Route path="teaching/:id/edit" element={<RequireAdmin><MaterialFormPage /></RequireAdmin>} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
