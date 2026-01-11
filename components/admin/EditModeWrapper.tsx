'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  EditModeProvider,
  AdminEditToggle,
  EditorDrawer,
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
        setIsLoading(false);
        return;
      }

      // Check if user is admin
      const { data: isAdminResult } = await supabase.rpc('is_admin');
      setIsAdmin(!!isAdminResult);
      setIsLoading(false);
    }

    checkAdmin();

    // Listen for auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
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
    </EditModeProvider>
  );
}
