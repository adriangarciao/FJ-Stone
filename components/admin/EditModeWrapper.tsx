'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  EditModeProvider,
  AdminEditToggle,
  EditorDrawer,
  ProjectEditorDrawer,
} from '@/components/admin';

interface EditModeWrapperProps {
  children: ReactNode;
}

export default function EditModeWrapper({ children }: EditModeWrapperProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient();

      // Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // User logged out - reset admin state and clear edit mode
        setIsAdmin(false);
        sessionStorage.removeItem('editMode');
        setIsLoading(false);
        return;
      }

      // Check if user is admin
      const { data: isAdminResult } = await supabase.rpc('is_admin');
      const adminStatus = !!isAdminResult;
      setIsAdmin(adminStatus);
      
      // If not admin, also clear edit mode from session
      if (!adminStatus) {
        sessionStorage.removeItem('editMode');
      }
      
      setIsLoading(false);
    }

    checkAdmin();

    // Listen for auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // On sign out, immediately clear admin state
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        sessionStorage.removeItem('editMode');
      }
      checkAdmin();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't show edit UI while checking auth
  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <EditModeProvider initialIsAdmin={isAdmin}>
      {children}
      <AdminEditToggle />
      <EditorDrawer />
      <ProjectEditorDrawer />
    </EditModeProvider>
  );
}
