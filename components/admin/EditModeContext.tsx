'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { ContentBlock, Project } from '@/lib/types';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  // Content block editor drawer state
  activeBlock: ContentBlock | null;
  openEditor: (block: ContentBlock) => void;
  closeEditor: () => void;
  // Optimistic updates for content blocks
  pendingUpdates: Record<string, ContentBlock>;
  setPendingUpdate: (key: string, block: ContentBlock) => void;
  clearPendingUpdate: (key: string) => void;
  // Project editor drawer state
  activeProject: Project | null;
  isCreatingProject: boolean;
  openProjectEditor: (project: Project | null) => void;
  closeProjectEditor: () => void;
  refreshProjectData: () => void;
  projectRefreshKey: number;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
}

// Safe hook that doesn't throw if outside provider
export function useEditModeOptional() {
  return useContext(EditModeContext);
}

interface EditModeProviderProps {
  children: ReactNode;
  initialIsAdmin?: boolean;
}

export function EditModeProvider({
  children,
  initialIsAdmin = false,
}: EditModeProviderProps) {
  // Initialize edit mode from sessionStorage if admin
  const [isEditMode, setIsEditMode] = useState(() => {
    if (typeof window !== 'undefined' && initialIsAdmin) {
      return sessionStorage.getItem('editMode') === 'true';
    }
    return false;
  });
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [activeBlock, setActiveBlock] = useState<ContentBlock | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, ContentBlock>>({});

  // Project editor state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectRefreshKey, setProjectRefreshKey] = useState(0);

  // Sync isAdmin state when initialIsAdmin prop changes (e.g., on logout)
  useEffect(() => {
    setIsAdmin(initialIsAdmin);
    // If no longer admin, also turn off edit mode
    if (!initialIsAdmin) {
      setIsEditMode(false);
    }
  }, [initialIsAdmin]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => {
      const next = !prev;
      sessionStorage.setItem('editMode', String(next));
      return next;
    });
  }, []);

  const openEditor = useCallback((block: ContentBlock) => {
    setActiveBlock(block);
  }, []);

  const closeEditor = useCallback(() => {
    setActiveBlock(null);
  }, []);

  const setPendingUpdate = useCallback((key: string, block: ContentBlock) => {
    setPendingUpdates((prev) => ({ ...prev, [key]: block }));
  }, []);

  const clearPendingUpdate = useCallback((key: string) => {
    setPendingUpdates((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Project editor functions
  const openProjectEditor = useCallback((project: Project | null) => {
    if (project === null) {
      // Creating new project
      setIsCreatingProject(true);
      setActiveProject(null);
    } else {
      // Editing existing project
      setIsCreatingProject(false);
      setActiveProject(project);
    }
  }, []);

  const closeProjectEditor = useCallback(() => {
    setActiveProject(null);
    setIsCreatingProject(false);
  }, []);

  const refreshProjectData = useCallback(() => {
    setProjectRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <EditModeContext.Provider
      value={{
        isEditMode: isAdmin && isEditMode,
        toggleEditMode,
        isAdmin,
        setIsAdmin,
        activeBlock,
        openEditor,
        closeEditor,
        pendingUpdates,
        setPendingUpdate,
        clearPendingUpdate,
        activeProject,
        isCreatingProject,
        openProjectEditor,
        closeProjectEditor,
        refreshProjectData,
        projectRefreshKey,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
