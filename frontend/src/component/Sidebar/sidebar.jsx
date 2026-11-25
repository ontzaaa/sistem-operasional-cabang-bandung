import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChartNoAxesCombined,
  Settings2,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import logoHitamKiky from '../../assets/Images/logo hitam kiky.png'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'barang', label: 'Gudang', icon: Package },
  { id: 'penjualan', label: 'Penjualan', icon: ShoppingCart },
  { id: 'rekap insentif', label: 'Rekap Insentif', icon: ChartNoAxesCombined },
  { id: 'reminder', label: 'Reminder', icon: Bell },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings2 },
]

export default function Sidebar({
  activeMenu = 'dashboard',
  onSelectMenu,
  onLogout,
  user = { name: 'Admin Kiky', role: 'Administrator' },
  mobileOpen = false,
  onCloseMobile,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const currentActive = activeMenu
  const initials = user.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U'

  const handleMenuClick = (id) => {
    onSelectMenu?.(id)
    onCloseMobile?.()
  }

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className={`flex h-[76px] items-center border-b border-slate-200 dark:border-slate-800 ${(!isMobile && collapsed) ? 'justify-center px-2' : 'justify-between px-4'}`}>
          <div className="flex items-center gap-3">
            <div className={`flex shrink-0 items-center justify-center rounded-xl bg-black shadow-xs border border-neutral-900/10 overflow-hidden transition-all ${(!isMobile && collapsed) ? 'h-9 w-12 px-1' : 'h-10 w-[64px] px-1.5'}`}>
              <img
                src={logoHitamKiky}
                alt="Logo KIKY"
                className="h-full w-full object-contain"
              />
            </div>
            {(isMobile || !collapsed) && (
              <div className="min-w-0">
                <p className="text-[14px] font-bold tracking-tight text-[#0f2b48] dark:text-sky-400 leading-tight">
                  PT SOLO MURNI
                </p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Cabang Bandung
                </p>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {isMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav aria-label="Navigasi utama" className={`pt-4 ${(!isMobile && collapsed) ? 'px-2' : 'px-3'}`}>
          {(isMobile || !collapsed) && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu Utama
            </p>
          )}
          <div className="space-y-1">
            {menuItems.map(({ id, label, icon: Icon }) => {
              const isActive = currentActive === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleMenuClick(id)}
                  title={(!isMobile && collapsed) ? label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex w-full items-center rounded-md text-xs font-medium transition-colors cursor-pointer min-h-[40px] ${
                    (!isMobile && collapsed) ? 'justify-center px-0' : 'gap-3 px-3'
                  } ${
                    isActive
                      ? 'bg-[#1b2b44] dark:bg-sky-600 font-semibold text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.7} className="shrink-0" />
                  {(isMobile || !collapsed) && <span className="truncate">{label}</span>}
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-3">
        <button
          type="button"
          onClick={() => handleMenuClick('profile')}
          title={(!isMobile && collapsed) ? `${user.name} (Lihat Profil)` : 'Lihat Profil'}
          className={`group mb-2 flex w-full items-center rounded-md p-2 transition-colors cursor-pointer text-left min-h-[40px] ${
            (!isMobile && collapsed) ? 'justify-center px-0' : 'gap-3 px-2'
          } ${
            currentActive === 'profile'
              ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
            {initials}
          </div>
          {(isMobile || !collapsed) && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
                {user.role}
              </p>
            </div>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            onCloseMobile?.()
            onLogout?.()
          }}
          title={(!isMobile && collapsed) ? 'Keluar' : undefined}
          className={`flex w-full items-center rounded-md py-2 text-xs font-medium text-rose-600 dark:text-rose-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer min-h-[38px] ${
            (!isMobile && collapsed) ? 'justify-center px-0' : 'gap-3 px-3'
          }`}
        >
          <LogOut size={16} strokeWidth={1.8} className="shrink-0" />
          {(isMobile || !collapsed) && <span>Keluar</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Mobile Drawer Sidebar (Tampil saat tombol menu diklik di HP) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay gelap */}
          <div
            className="fixed inset-0 bg-slate-900/50 transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-[260px] max-w-[85vw] h-full bg-white dark:bg-[#0c1e33] text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
            {renderNavContent(true)}
          </aside>
        </div>
      )}

      {/* 2. Desktop Sticky Sidebar (Layar Tablet & Desktop ≥ md) */}
      <aside
        className={`hidden md:flex sticky top-0 z-20 h-screen shrink-0 self-start flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] text-slate-800 dark:text-slate-100 transition-[width] duration-150 ${
          collapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
      >
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0c1e33] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {renderNavContent(false)}
      </aside>
    </>
  )
}
export { Sidebar }
