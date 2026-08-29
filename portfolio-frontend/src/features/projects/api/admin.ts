import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, storage } from '@/lib/firebase/config';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProjectFormValues } from '../schemas/projectSchema';

export interface AdminProject {
  id: string;
  name: string;
  slug: string;
  client_name: string | null;
  summary?: string;
  description: string;
  cover_image: string | null;
  live_url: string | null;
  github_url: string | null;
  technologies: string[];
  team_contributions?: any[];
  is_featured: boolean;
  published_at: string | null;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export const adminProjectKeys = {
  all: ['admin', 'projects'] as const,
  lists: () => [...adminProjectKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminProjectKeys.lists(), filters] as const,
  details: () => [...adminProjectKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminProjectKeys.details(), id] as const,
};

export const useAdminProjects = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminProject[], meta?: any }, Error>({
    queryKey: adminProjectKeys.list(filters),
    queryFn: async () => {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminProject[];
      
      return { data: projects };
    },
  });
};

export const useAdminProject = (id: string) => {
  return useQuery<{ data: AdminProject }, Error>({
    queryKey: adminProjectKeys.detail(id),
    queryFn: async () => {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Project not found');
      }
      
      return { data: { id: docSnap.id, ...docSnap.data() } as AdminProject };
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminProject }, Error, ProjectFormValues>({
    mutationFn: async (data) => {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      return { data: { id: docRef.id, ...data } as AdminProject };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.lists() });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminProject }, Error, { id: string, data: ProjectFormValues }>({
    mutationFn: async ({ id, data }) => {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      
      return { data: { id, ...data } as AdminProject };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.detail(id) });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.lists() });
    },
  });
};

export const useUploadMedia = () => {
  return useMutation<{ url: string }, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('https://api.imgbb.com/1/upload?key=212da2ee1fc1c4f3c96b9e46458aa61b', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return { url: data.data.url };
    },
  });
};
