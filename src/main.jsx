import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import DebateDetailPage from './pages/debate/DebateDetailPage.jsx'; // 새로 만든 상세 페이지
import DebatePage from './pages/debate/index.jsx'; // 목록 페이지
import NewDebatePage from './pages/debate/NewDebatePage.jsx'; // 새 토론 작성 페이지
import FindTeamPage from './pages/findTeam/index.jsx'; // 팀원찾기 목록 페이지
import NewTeamPostPage from './pages/findTeam/NewTeamPostPage.jsx'; // 팀원찾기 작성 페이지
import TeamDetailPage from './pages/findTeam/TeamDetailPage.jsx'; // 팀원찾기 상세 페이지
import MainPage from './pages/main/index.jsx';
import SummonerPage from './pages/main/SummonerPage.jsx';
import LoginPage from './pages/authentication/LoginPage.jsx';
import SignupPage from './pages/authentication/SignupPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainPage />
      },
      {
        path: '/debate',
        element: <DebatePage />
      },
      {
        path: '/debate/new',
        element: <NewDebatePage />
      },
      // :id는 동적 파라미터로 동작합니다.
      {
        path: '/debate/:id',
        element: <DebateDetailPage />
      },
      {
        path: '/debate/:id/edit',
        element: <NewDebatePage />
      },
      {
        path: '/findTeam',
        element: <FindTeamPage />
      },
      {
        path: '/findTeam/new',
        element: <NewTeamPostPage />
      },
      {
        path: '/findTeam/:id',
        element: <TeamDetailPage />
      },
      {
        path: '/findTeam/:id/edit',
        element: <NewTeamPostPage />
      },
      {
        path: '/summoner/:summonerName',
        element: <SummonerPage />
      },
      {
        path: '/auth/login',
        element: <LoginPage />
      },
      {
        path: '/auth/signup',
        element: <SignupPage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
