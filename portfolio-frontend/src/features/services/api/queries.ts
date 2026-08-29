import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ApiCollectionResponse } from '@/types/api';
import { ServicePackage } from '../types';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const services = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServicePackage[];
      
      return { data: services } as ApiCollectionResponse<ServicePackage>;
    },
  });
};
