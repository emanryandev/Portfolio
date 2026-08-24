import { create } from 'zustand';

type Theme = 'dark' | 'light' | 'system';

interface UIState {
  theme: Theme;
  isMobileMenuOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  isMobileMenuOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
