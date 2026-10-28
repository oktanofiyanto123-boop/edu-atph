'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StudentNavContextType {
  isSidebarHidden: boolean;
  setIsSidebarHidden: (val: boolean) => void;
  toggleSidebar: () => void;
  isIPhoneMenuOpen: boolean;
  setIsIPhoneMenuOpen: (val: boolean) => void;
  toggleIPhoneMenu: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const StudentNavContext = createContext<StudentNavContextType | undefined>(undefined);

const STORAGE_KEY = 'edu_atph_student_menu_hidden';

export function StudentNavProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarHidden, setIsSidebarHiddenState] = useState<boolean>(false);
  const [isIPhoneMenuOpen, setIsIPhoneMenuOpen] = useState<boolean>(false);
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

  const toggleIPhoneMenu = () => {
    setIsIPhoneMenuOpen((prev) => !prev);
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
    <StudentNavContext.Provider
      value={{
        isSidebarHidden,
        setIsSidebarHidden,
        toggleSidebar,
        isIPhoneMenuOpen,
        setIsIPhoneMenuOpen,
        toggleIPhoneMenu,
        isFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </StudentNavContext.Provider>
  );
}

export function useStudentNav() {
  const context = useContext(StudentNavContext);
  return context || null;
}
