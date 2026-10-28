'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Smartphone, Monitor, Apple } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type InstallPlatform = 'android' | 'ios' | 'desktop' | null;

function detectPlatform(): InstallPlatform {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isInStandalone =
    (navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;

  if (isInStandalone) return null;
  if (isIos) return 'ios';
  if (isAndroid) return 'android';
  return 'desktop';
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.warn('SW registration failed:', err));
    }
  }, []);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (p === 'ios') {
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = useCallback(async () => {
    if (platform === 'ios') {
      setShowIosGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
      setDeferredPrompt(null);
    }
    setInstalling(false);
  }, [deferredPrompt, platform]);

  const handleDismiss = () => {
    setVisible(false);
    setShowIosGuide(false);
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  };

  if (!visible || !platform) return null;

  const PlatformIcon = platform === 'ios' ? Apple : platform === 'android' ? Smartphone : Monitor;
  const platformLabel =
    platform === 'ios' ? 'iPhone / iPad' : platform === 'android' ? 'Android' : 'Komputer / Laptop';

  return (
    <>
      <div
        role="dialog"
        aria-label="Install EduATPH"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300"
      >
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-700/40 shadow-2xl shadow-slate-950/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <img
                src="/icon-192.png"
                alt="EduATPH"
                className="w-12 h-12 rounded-xl border-2 border-emerald-600/40 shadow-md"
              />
              <div>
                <p className="text-white font-black text-sm leading-tight">EduATPH</p>
                <p className="text-emerald-400 text-[10px] font-semibold leading-tight">
                  Pembelajaran Agribisnis Digital
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 pb-2">
            <p className="text-slate-300 text-xs leading-relaxed">
              Pasang <strong className="text-white">EduATPH</strong> di{' '}
              <span className="text-emerald-400 font-bold">{platformLabel}</span> — akses offline,
              buka langsung dari homescreen, tanpa perlu browser.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {['⚡ Akses Cepat', '📴 Bisa Offline', '📱 Seperti App Asli'].map((f) => (
                <span
                  key={f}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 font-medium border border-slate-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 pb-4 pt-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              Nanti Saja
            </button>
            <button
              id="pwa-install-btn"
              onClick={handleInstall}
              disabled={installing}
              className="flex-[2] py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-md shadow-emerald-900/40 flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
            >
              {installing ? (
                <span className="animate-pulse">Memasang...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Pasang Sekarang</span>
                  <PlatformIcon className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showIosGuide && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-300" />
                <h3 className="text-white font-bold text-sm">Pasang di iPhone / iPad</h3>
              </div>
              <button
                onClick={() => { setShowIosGuide(false); handleDismiss(); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-slate-400 text-xs">
                Safari di iPhone/iPad tidak mendukung tombol install otomatis. Ikuti langkah berikut:
              </p>
              {[
                { icon: '⬆️', title: 'Ketuk ikon "Share"', desc: 'Tombol kotak dengan panah ke atas di toolbar bawah Safari', color: 'bg-blue-900/40 border-blue-700/50' },
                { icon: '➕', title: 'Pilih "Add to Home Screen"', desc: 'Geser ke bawah menu, cari "Tambahkan ke Layar Utama"', color: 'bg-emerald-900/40 border-emerald-700/50' },
                { icon: '✅', title: 'Ketuk "Add" / "Tambahkan"', desc: 'EduATPH akan muncul di homescreen seperti aplikasi biasa!', color: 'bg-emerald-900/60 border-emerald-600/50' },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className={`flex items-start gap-3 p-3 rounded-2xl border ${color}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm">{icon}</div>
                  <div>
                    <p className="text-white text-xs font-bold">{title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => { setShowIosGuide(false); handleDismiss(); }}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Mengerti, Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
