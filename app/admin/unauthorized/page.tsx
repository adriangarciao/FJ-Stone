'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldX } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-red-100 flex items-center justify-center mx-auto mb-6 rounded-full">
          <ShieldX size={40} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Your account does not have admin privileges. Please contact the site
          administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleSignOut}
            className="bg-[#1a1a2e] hover:bg-[#2d2d44] text-white px-6 py-3 font-semibold transition-colors"
          >
            Sign Out
          </button>
          <Link
            href="/"
            className="border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white px-6 py-3 font-semibold transition-all"
          >
            Go to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
