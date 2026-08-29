import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { authKeys, User } from './queries';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;
      
      return {
        id: user.uid,
        name: user.displayName || 'Admin',
        email: user.email,
      };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};
