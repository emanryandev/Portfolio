import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, limit, getCountFromServer, where } from 'firebase/firestore';
import { AdminProject } from '@/features/projects/api/admin';
import { AdminContactRequest } from '@/features/contact/api/admin';

export interface DashboardMetrics {
  projects: number;
  team_members: number;
  services: number;
  new_contact_requests: number;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  recent_projects: AdminProject[];
  recent_contact_requests: AdminContactRequest[];
}

export const dashboardKeys = {
  all: ['admin', 'dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

export const useDashboardSummary = () => {
  return useQuery<{ data: DashboardSummary }, Error>({
    queryKey: dashboardKeys.summary(),
    queryFn: async () => {
      // Fetch Metrics using getCountFromServer
      const projectsCountSnap = await getCountFromServer(collection(db, 'projects'));
      const teamCountSnap = await getCountFromServer(collection(db, 'team'));
      const servicesCountSnap = await getCountFromServer(collection(db, 'services'));
      const newContactsCountSnap = await getCountFromServer(
        query(collection(db, 'contact_requests'), where('status', '==', 'new'))
      );

      // Fetch Recent Projects (last 5 based on order or created_at)
      const recentProjectsSnap = await getDocs(
        query(collection(db, 'projects'), orderBy('order', 'asc'), limit(5))
      );
      const recentProjects = recentProjectsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminProject[];

      // Fetch Recent Contact Requests (last 5)
      const recentContactsSnap = await getDocs(
        query(collection(db, 'contact_requests'), orderBy('created_at', 'desc'), limit(5))
      );
      const recentContacts = recentContactsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminContactRequest[];

      return {
        data: {
          metrics: {
            projects: projectsCountSnap.data().count,
            team_members: teamCountSnap.data().count,
            services: servicesCountSnap.data().count,
            new_contact_requests: newContactsCountSnap.data().count,
          },
          recent_projects: recentProjects,
          recent_contact_requests: recentContacts,
        }
      };
    },
  });
};
