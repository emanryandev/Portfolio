import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { SettingsFormValues } from '../schemas/settingsSchema';

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, data, { merge: true });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
