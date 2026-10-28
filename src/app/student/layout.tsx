'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentSidebar from '@/components/layout/StudentSidebar';
import IPhoneHomeButton from '@/components/layout/IPhoneHomeButton';
import { StudentNavProvider } from '@/context/StudentNavContext';
import { DataProvider } from '@/lib/data-provider';
import { UserProfile } from '@/types';

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);
    if (!user) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Memuat Ruang Belajar Siswa...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Student Navigation Sidebar (hideable into iPhone Home button) */}
      <StudentSidebar />

      {/* Main Student Page Content (Expands to full screen width when sidebar is hidden) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
        {children}
      </main>

      {/* Floating iPhone Home Button (AssistiveTouch) for quick navigation */}
      <IPhoneHomeButton />
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentNavProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </StudentNavProvider>
  );
}
