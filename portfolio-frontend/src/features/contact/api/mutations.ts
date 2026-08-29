import { useMutation } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ContactRequest } from '../types';

export const useSubmitContactRequest = () => {
  return useMutation({
    mutationFn: async (payload: Omit<ContactRequest, 'id'>) => {
      const docRef = await addDoc(collection(db, 'contact_requests'), {
        ...payload,
        status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { ...payload, id: docRef.id };
    },
  });
};
