import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, doc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

export interface AdminContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name: string | null;
  project_type: string;
  budget_range?: string | null;
  budget?: string;
  service_id?: string;
  message: string;
  recipients?: string[];
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export const adminContactKeys = {
  all: ['admin', 'contacts'] as const,
  lists: () => [...adminContactKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminContactKeys.lists(), filters] as const,
  details: () => [...adminContactKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminContactKeys.details(), id] as const,
};

export const useAdminContactRequests = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminContactRequest[], meta?: any }, Error>({
    queryKey: adminContactKeys.list(filters),
    queryFn: async () => {
      let q = query(collection(db, 'contact_requests'), orderBy('created_at', 'desc'));
      
      if (filters.status) {
        q = query(collection(db, 'contact_requests'), where('status', '==', filters.status), orderBy('created_at', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const contacts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminContactRequest[];
      
      return { data: contacts };
    },
  });
};

export const useAdminContactRequest = (id: string) => {
  return useQuery<{ data: AdminContactRequest }, Error>({
    queryKey: adminContactKeys.detail(id),
    queryFn: async () => {
      const docRef = doc(db, 'contact_requests', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Contact request not found');
      }
      
      return { data: { id: docSnap.id, ...docSnap.data() } as AdminContactRequest };
    },
    enabled: !!id,
  });
};

// Optimistic Update for status toggle
export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: AdminContactRequest }, Error, { id: string, status: string }>({
    mutationFn: async ({ id, status }) => {
      const docRef = doc(db, 'contact_requests', id);
      await updateDoc(docRef, {
        status,
        updated_at: new Date().toISOString(),
      });
      return { data: { id, status } as any }; // Partial return for optimistic update
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: adminContactKeys.lists() });
      await queryClient.cancelQueries({ queryKey: adminContactKeys.detail(id) });

      // Snapshot the previous value
      const previousLists = queryClient.getQueriesData({ queryKey: adminContactKeys.lists() });
      
      // Optimistically update lists
      queryClient.setQueriesData({ queryKey: adminContactKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((contact: AdminContactRequest) => 
            contact.id === id ? { ...contact, status } : contact
          )
        };
      });

      // Optimistically update detail
      queryClient.setQueryData(adminContactKeys.detail(id), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, status }
        };
      });

      return { previousLists };
    },
    onError: (_err, variables, context: any) => {
      // Rollback
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: adminContactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminContactKeys.detail(variables.id) });
    },
  });
};

export const useDeleteContactRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const docRef = doc(db, 'contact_requests', id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminContactKeys.lists() });
    },
  });
};
