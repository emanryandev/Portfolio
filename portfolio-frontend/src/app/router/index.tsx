import { createBrowserRouter, Outlet } from 'react-router-dom';
import React, { Suspense } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { GlobalErrorBoundary } from '@/components/shared/ErrorBoundary';
import { NotFound } from '@/components/shared/NotFound';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import Home from '@/pages/Home';
import { PageLoader } from '@/components/shared/PageLoader';

// Lazy loaded Public Routes
const ProjectsIndex = React.lazy(() => import('@/pages/ProjectsIndex'));
const ProjectDetail = React.lazy(() => import('@/pages/ProjectDetail'));
const TeamIndex = React.lazy(() => import('@/pages/TeamIndex'));
const TeamMember = React.lazy(() => import('@/pages/TeamMember'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const About = React.lazy(() => import('@/pages/About'));
const Packages = React.lazy(() => import('@/pages/Packages'));

// Lazy loaded Admin Routes
const AdminLayout = React.lazy(() => import('@/components/layout/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const Login = React.lazy(() => import('@/pages/admin/Login'));
const ProjectList = React.lazy(() => import('@/pages/admin/projects/ProjectList'));
const ProjectEditor = React.lazy(() => import('@/features/projects/components/editor/ProjectEditor').then(module => ({ default: module.ProjectEditor })));
const TeamList = React.lazy(() => import('@/pages/admin/team/TeamList'));
const TeamForm = React.lazy(() => import('@/pages/admin/team/TeamForm'));
const ServiceList = React.lazy(() => import('@/pages/admin/services/ServiceList'));
const ServiceForm = React.lazy(() => import('@/pages/admin/services/ServiceForm'));
const ContactList = React.lazy(() => import('@/pages/admin/contacts/ContactList'));
const ContactDetail = React.lazy(() => import('@/pages/admin/contacts/ContactDetail'));
const Dashboard = React.lazy(() => import('@/pages/admin/dashboard/Dashboard'));
const SettingsStub = React.lazy(() => import('@/pages/admin/settings/SettingsStub'));

// Development-only Routes
const DesignSystem = React.lazy(() => import('@/pages/DesignSystem'));
const AuthTester = React.lazy(() => import('@/pages/AuthTester'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

const routes = [
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'projects',
        element: <SuspenseWrapper><ProjectsIndex /></SuspenseWrapper>,
      },
      {
        path: 'projects/:slug',
        element: <SuspenseWrapper><ProjectDetail /></SuspenseWrapper>,
      },
      {
        path: 'team',
        element: <SuspenseWrapper><TeamIndex /></SuspenseWrapper>,
      },
      {
        path: 'team/:slug',
        element: <SuspenseWrapper><TeamMember /></SuspenseWrapper>,
      },
      {
        path: 'about',
        element: <SuspenseWrapper><About /></SuspenseWrapper>,
      },
      {
        path: 'packages',
        element: <SuspenseWrapper><Packages /></SuspenseWrapper>,
      },
      {
        path: 'contact',
        element: <SuspenseWrapper><Contact /></SuspenseWrapper>,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <SuspenseWrapper><Login /></SuspenseWrapper>,
  },
  {
    path: '/admin',
    element: <RequireAuth />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: '',
        element: <SuspenseWrapper><AdminLayout /></SuspenseWrapper>,
        children: [
          { index: true, element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
          { path: 'projects', element: <SuspenseWrapper><ProjectList /></SuspenseWrapper> },
          { path: 'projects/new', element: <SuspenseWrapper><ProjectEditor /></SuspenseWrapper> },
          { path: 'projects/:id/edit', element: <SuspenseWrapper><ProjectEditor /></SuspenseWrapper> },
          { path: 'team', element: <SuspenseWrapper><TeamList /></SuspenseWrapper> },
          { path: 'team/new', element: <SuspenseWrapper><TeamForm /></SuspenseWrapper> },
          { path: 'team/:id/edit', element: <SuspenseWrapper><TeamForm /></SuspenseWrapper> },
          { path: 'services', element: <SuspenseWrapper><ServiceList /></SuspenseWrapper> },
          { path: 'services/new', element: <SuspenseWrapper><ServiceForm /></SuspenseWrapper> },
          { path: 'services/:id/edit', element: <SuspenseWrapper><ServiceForm /></SuspenseWrapper> },
          { path: 'contacts', element: <SuspenseWrapper><ContactList /></SuspenseWrapper> },
          { path: 'contacts/:id', element: <SuspenseWrapper><ContactDetail /></SuspenseWrapper> },
          { path: 'settings', element: <SuspenseWrapper><SettingsStub /></SuspenseWrapper> },
        ],
      },
    ],
  },
];

// Add dev-only routes if in development
if (import.meta.env.DEV) {
  routes.push({
    path: '/design-system',
    element: <SuspenseWrapper><DesignSystem /></SuspenseWrapper>,
  } as any);
  routes.push({
    path: '/auth-test',
    element: <SuspenseWrapper><AuthTester /></SuspenseWrapper>,
  } as any);
}

export const router = createBrowserRouter(routes as any);
