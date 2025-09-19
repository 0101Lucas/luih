import { create } from 'zustand';
import { Project } from '@/lib/types';

interface AppState {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
}));