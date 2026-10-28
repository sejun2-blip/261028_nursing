// 주소(URL)와 페이지를 연결하는 라우팅 표
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import DiscussionDetailPage from './pages/DiscussionDetailPage';
import DiscussionListPage from './pages/DiscussionListPage';
import DiscussionNewPage from './pages/DiscussionNewPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MaterialsPage from './pages/MaterialsPage';
import NotFoundPage from './pages/NotFoundPage';
import ResearchDetailPage from './pages/ResearchDetailPage';
import ResearchListPage from './pages/ResearchListPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="research" element={<ResearchListPage />} />
        <Route path="research/:id" element={<ResearchDetailPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="discussions" element={<DiscussionListPage />} />
        <Route path="discussions/new" element={<DiscussionNewPage />} />
        <Route path="discussions/:id" element={<DiscussionDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
