import React from 'react'
import { Shield, ArrowRight } from 'lucide-react'
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
      <header className="relative z-10 flex w-full justify-center pt-8 sm:pt-10 px-4">
        <div className="flex items-center justify-center transition-transform duration-300 hover:scale-105">
          <img
            src={logoKiky}
            alt="KIKY Stationery Logo"
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />
        </div>
      </header>

      {/* Konten Utama: Card Frosted Glass Tengah */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[620px] rounded-3xl border border-white/20 bg-black/40 p-8 sm:p-11 text-center shadow-2xl backdrop-blur-md">

          {/* Heading Judul Utama */}
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-white leading-snug">
            Sistem Terpadu Pergudangan &amp; <br className="hidden sm:inline" />
            Distribusi Logistik <span className="text-[#5eead4]">KIKY</span>
          </h1>

          {/* Deskripsi */}
          <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-slate-200/90 max-w-lg mx-auto font-normal">
            Portal terpusat untuk monitoring inventori gudang, pengelolaan armada distribusi, dan sinkronisasi pesanan sales secara real-time.
          </p>

          {/* Tombol CTA: Masuk ke Sistem */}
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={onEnterSystem}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#5eead4] hover:bg-[#2dd4bf] px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight
                size={16}
                strokeWidth={2.4}
                className="transition-transform duration-200 group-hover:translate-x-1"
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

