import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../design-system/layouts/AppLayout';
import { LobbyPage } from '../modules/lobby/LobbyPage';
import { AboutPage } from '../modules/about/AboutPage';
import { SkillsPage } from '../modules/skills/SkillsPage';
import { ProjectsPage } from '../modules/projects/ProjectsPage';
import { EducationPage } from '../modules/education/EducationPage';
import { ExperiencePage } from '../modules/experience/ExperiencePage';
import { PrivacyNoticePage } from '../modules/privacy/PrivacyNoticePage';
import { LoginPage } from '../modules/admin/LoginPage';
import { DashboardPage } from '../modules/admin/DashboardPage';
import { AuthGuard } from './guards/AuthGuard';
import { NotFoundPage } from '../modules/NotFoundPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <LobbyPage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'skills', element: <SkillsPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'education', element: <EducationPage /> },
        { path: 'experience', element: <ExperiencePage /> },
        { path: 'privacy', element: <PrivacyNoticePage /> },
        { path: 'dashboard/login', element: <LoginPage /> },
        {
          path: 'dashboard',
          element: (
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          ),
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
