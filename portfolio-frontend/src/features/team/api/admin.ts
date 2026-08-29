import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export interface AdminTeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  department: 'backend' | 'devops' | 'pentesting' | 'none';
  email: string;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export const adminTeamKeys = {
  all: ['admin', 'team'] as const,
  lists: () => [...adminTeamKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminTeamKeys.lists(), filters] as const,
  details: () => [...adminTeamKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminTeamKeys.details(), id] as const,
};

export const useAdminTeamMembers = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminTeamMember[], meta?: any }, Error>({
    queryKey: adminTeamKeys.list(filters),
    queryFn: async () => {
      const q = query(collection(db, 'team'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminTeamMember[];
      
      return { data: members };
    },
  });
};

export const useAdminTeamMember = (id: string) => {
  return useQuery<{ data: AdminTeamMember }, Error>({
    queryKey: adminTeamKeys.detail(id),
    queryFn: async () => {
      const docRef = doc(db, 'team', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Team member not found');
      }
      
      return { data: { id: docSnap.id, ...docSnap.data() } as AdminTeamMember };
    },
    enabled: !!id,
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminTeamMember }, Error, Partial<AdminTeamMember>>({
    mutationFn: async (data) => {
      const docRef = await addDoc(collection(db, 'team'), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      return { data: { id: docRef.id, ...data } as AdminTeamMember };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminTeamMember }, Error, { id: string, data: Partial<AdminTeamMember> }>({
    mutationFn: async ({ id, data }) => {
      const docRef = doc(db, 'team', id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      
      return { data: { id, ...data } as AdminTeamMember };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.detail(id) });
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const docRef = doc(db, 'team', id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
};
