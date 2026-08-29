import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export interface AdminService {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'global' | 'backend' | 'devops' | 'pentesting';
  price_type: 'fixed' | 'starting_at' | 'custom';
  price: string | null;
  features: string[];
  is_active: boolean;
  is_featured: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export const adminServiceKeys = {
  all: ['admin', 'services'] as const,
  lists: () => [...adminServiceKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminServiceKeys.lists(), filters] as const,
  details: () => [...adminServiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminServiceKeys.details(), id] as const,
};

export const useAdminServices = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminService[], meta?: any }, Error>({
    queryKey: adminServiceKeys.list(filters),
    queryFn: async () => {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const services = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminService[];
      
      return { data: services };
    },
  });
};

export const useAdminService = (id: string) => {
  return useQuery<{ data: AdminService }, Error>({
    queryKey: adminServiceKeys.detail(id),
    queryFn: async () => {
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Service not found');
      }
      
      return { data: { id: docSnap.id, ...docSnap.data() } as AdminService };
    },
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminService }, Error, Partial<AdminService>>({
    mutationFn: async (data) => {
      const docRef = await addDoc(collection(db, 'services'), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      return { data: { id: docRef.id, ...data } as AdminService };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.lists() });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminService }, Error, { id: string, data: Partial<AdminService> }>({
    mutationFn: async ({ id, data }) => {
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      
      return { data: { id, ...data } as AdminService };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.detail(id) });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const docRef = doc(db, 'services', id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.lists() });
    },
  });
};
