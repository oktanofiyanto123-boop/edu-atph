import React from 'react';
import Link from 'next/link';
import { Sprout, Mail, Phone, MapPin, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">EduATPH</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform Pembelajaran Digital Agribisnis Tanaman Pangan dan Hortikultura (ATPH) khusus siswa SMK, mendukung kemandirian pangan dan teknologi pertanian presisi masa depan.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Sistem Manajemen Pembelajaran Resmi</span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Navigasi Utama</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Masuk ke Portal
                </Link>
              </li>
              <li>
                <Link href="#kategori" className="hover:text-emerald-400 transition-colors">
                  15 Modul ATPH
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-emerald-400 transition-colors">
                  Fitur Interaktif
                </Link>
              </li>
            </ul>
          </div>

          {/* Kompetensi ATPH */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Fokus Keahlian</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-emerald-400 transition-colors">Pertanian Presisi & Hidroponik</li>
              <li className="hover:text-emerald-400 transition-colors">Budidaya Hortikultura & Tanaman Pangan</li>
              <li className="hover:text-emerald-400 transition-colors">Pengendalian Hama Terpadu (PHT)</li>
              <li className="hover:text-emerald-400 transition-colors">Penanganan Panen & Rantai Dingin</li>
              <li className="hover:text-emerald-400 transition-colors">Agripreneurship Digital</li>
            </ul>
          </div>

          {/* Administrator Attribution */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Administrator & Pengampu</h3>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Okta Nofiyanto</span>
              </div>
              <p className="text-xs text-slate-400">
                Pendidik & Administrator Tunggal Platform EduATPH. Bertanggung jawab penuh atas materi, tugas, dan evaluasi.
              </p>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>okta.nofiyanto@eduatph.sch.id</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EduATPH. Hak Cipta Dilindungi. Dikelola oleh Okta Nofiyanto.</p>
          <p className="flex items-center gap-1">
            Membangun generasi petani muda cerdas Indonesia bersama SMK Pertanian.
          </p>
        </div>
      </div>
    </footer>
  );
}
