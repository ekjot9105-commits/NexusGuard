import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  reducedMotion: boolean;
  language: string;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setReducedMotion: (val: boolean) => void;
  setLanguage: (val: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isDarkMode: true,
  reducedMotion: false,
  language: 'en',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setReducedMotion: (val) => set({ reducedMotion: val }),
  setLanguage: (val) => set({ language: val }),
}));
