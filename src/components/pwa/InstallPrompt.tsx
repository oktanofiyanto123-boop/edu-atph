'use client';

import { useEffect } from 'react';

export default function PWAInstallPrompt() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.warn('SW registration failed:', err));
    }
  }, []);

  // Return null to completely remove the intrusive floating install notification popup
  return null;
}
