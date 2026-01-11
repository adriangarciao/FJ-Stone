'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { ContentBlock } from '@/lib/types';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  // Editor drawer state
  activeBlock: ContentBlock | null;
  openEditor: (block: ContentBlock) => void;
  closeEditor: () => void;
  // Optimistic updates
  pendingUpdates: Record<string, ContentBlock>;
  setPendingUpdate: (key: string, block: ContentBlock) => void;
  clearPendingUpdate: (key: string) => void;
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
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
