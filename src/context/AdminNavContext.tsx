'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminNavContextType {
  isSidebarHidden: boolean;
  setIsSidebarHidden: (val: boolean) => void;
  toggleSidebar: () => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (val: boolean) => void;
  toggleMobileDrawer: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const AdminNavContext = createContext<AdminNavContextType | undefined>(undefined);

const STORAGE_KEY = 'edu_atph_admin_sidebar_hidden';

export function AdminNavProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarHidden, setIsSidebarHiddenState] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setIsSidebarHiddenState(saved === 'true');
      }
    } catch {
      // Ignore localStorage errors
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const setIsSidebarHidden = (val: boolean) => {
    setIsSidebarHiddenState(val);
    try {
      localStorage.setItem(STORAGE_KEY, String(val));
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <AdminNavContext.Provider
      value={{
        isSidebarHidden,
        setIsSidebarHidden,
        toggleSidebar,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        toggleMobileDrawer,
        isFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </AdminNavContext.Provider>
  );
}

export function useAdminNav() {
  const context = useContext(AdminNavContext);
  return context || null;
}

