import { useQuery } from '@tanstack/react-query';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export interface User {
  id: string;
  name: string;
  email: string | null;
}

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const useUser = () => {
  return useQuery<User | null, Error>({
    queryKey: authKeys.user(),
    queryFn: () => {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            unsubscribe();
            if (user) {
              resolve({
                id: user.uid,
                name: user.displayName || 'Admin',
                email: user.email,
              });
            } else {
              reject(new Error('Not authenticated'));
            }
          },
          (error) => {
            unsubscribe();
            reject(error);
          }
        );
      });
    },
    retry: false, // Don't retry if 401
    staleTime: Infinity, // Rely on Firebase listener or manual invalidation
  });
};
