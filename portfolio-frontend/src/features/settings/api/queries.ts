import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GlobalSettings } from '../types';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const settingsRef = doc(db, 'settings', 'general');
      const settingsSnap = await getDoc(settingsRef);
      
      if (!settingsSnap.exists()) {
        // Return default values if doc doesn't exist yet
        return {
          site_name: 'Synapse',
          site_tagline: 'Full Stack Developers & Designers',
          contact_email: 'hello@synapse.com',
          contact_phone: '+1 (555) 000-0000',
          contact_location: 'Alexandria, Egypt',
          seo_default_description: 'A specialized trio of developers combining deep expertise across the entire stack to build products that perform.',
          logo_url: '/images/logo/logo.jpeg'
        } as GlobalSettings;
      }
      
      return settingsSnap.data() as GlobalSettings;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since settings rarely change
  });
};
