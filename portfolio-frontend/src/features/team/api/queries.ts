import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { ApiCollectionResponse, ApiSingleResponse } from '@/types/api';
import { TeamMember } from '../types';

export const useTeam = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const q = query(collection(db, 'team'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      
      return { data: members } as ApiCollectionResponse<TeamMember>;
    },
  });
};

export const useTeamMember = (slug: string) => {
  return useQuery({
    queryKey: ['team', slug],
    queryFn: async () => {
      const q = query(collection(db, 'team'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Team member not found');
      }
      
      const member = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as TeamMember;
      
      return { data: member } as ApiSingleResponse<TeamMember>;
    },
    enabled: !!slug,
  });
};
