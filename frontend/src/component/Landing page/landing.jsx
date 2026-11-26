import React from 'react'
import { ArrowRight } from 'lucide-react'
import logoKiky from '../../assets/Images/kiky.png'
import bgImage from '../../assets/Images/background.jpeg'

export default function LandingPage({ onEnterSystem }) {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between bg-cover bg-center bg-no-repeat font-sans selection:bg-teal-500 selection:text-black overflow-x-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark Vignette & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-black/70 to-slate-950/90 pointer-events-none" />

      {/* Bagian Paling Atas: Logo KIKY */}
      <header className="relative z-10 flex w-full justify-center px-4 pt-5 sm:px-8 sm:pt-7">
        <div className="flex items-center justify-center">
          <img
            src={logoKiky}
            alt="Logo KIKY Stationery"
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />
        </div>
      </header>

      {/* Konten Utama */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[760px] p-5 text-center sm:p-8">

          {/* Heading Judul Utama */}
          <h1 className="text-2xl font-bold leading-snug tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-3xl lg:text-[32px]">
            Sistem Terpadu Pergudangan &amp; <br className="hidden sm:inline" />
            Distribusi Logistik <span className="text-[#5eead4]">KIKY</span>
          </h1>

          {/* Deskripsi */}
          <p className="mx-auto mt-4 max-w-lg text-xs font-normal leading-relaxed text-slate-100 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] sm:text-[13px]">
            Portal terpusat untuk monitoring inventori gudang, pengelolaan armada distribusi, dan sinkronisasi pesanan sales secara real-time.
          </p>

          {/* Tombol CTA: Masuk ke Sistem (Menyatu dengan Background) */}
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={onEnterSystem}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20 min-h-[44px] sm:text-sm"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight
                size={16}
                strokeWidth={2.2}
              />
            </button>
          </div>
        </div>
      </main>

      {/* Bagian Bawah: Footer Copyright */}
      <footer className="relative z-10 pb-6 pt-2 text-center px-4">
        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
          &copy; 2026 PT Solo Murni Cab. Bandung. Hak Cipta Dilindungi.
        </p>
      </footer>
    </div>
  )
}
