import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { ApiCollectionResponse, ApiSingleResponse } from '@/types/api';
import { Project } from '../types';

export const useProjects = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      let constraints: QueryConstraint[] = [orderBy('order', 'asc')];
      
      if (params?.is_featured) {
        constraints.push(where('is_featured', '==', true));
      }
      
      if (params?.category_slug) {
        constraints.push(where('category_slug', '==', params.category_slug));
      }

      const q = query(collection(db, 'projects'), ...constraints);
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      
      return { data: projects } as ApiCollectionResponse<Project>;
    },
  });
};

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: async () => {
      const q = query(collection(db, 'projects'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Project not found');
      }
      
      const projectData = querySnapshot.docs[0].data();
      const project = {
        id: querySnapshot.docs[0].id,
        ...projectData
      } as Project;
      
      // Fetch team members data if there are contributions
      if (project.team_contributions && project.team_contributions.length > 0) {
        const teamPromises = project.team_contributions.map(async (contribution: any) => {
          if (!contribution.team_member_id) return contribution;
          
          try {
            const { getDoc, doc } = await import('firebase/firestore');
            const memberRef = doc(db, 'team', contribution.team_member_id);
            const memberSnap = await getDoc(memberRef);
            
            if (memberSnap.exists()) {
              return {
                ...contribution,
                team_member: {
                  id: memberSnap.id,
                  ...memberSnap.data()
                }
              };
            }
          } catch (e) {
            console.error('Failed to fetch team member', e);
          }
          return contribution;
        });
        
        project.team_contributions = await Promise.all(teamPromises);
      }
      
      return { data: project } as ApiSingleResponse<Project>;
    },
    enabled: !!slug,
  });
};
