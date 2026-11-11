import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChartNoAxesCombined,
  Users,
  Settings2,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
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
  }

  return (
    <aside
      className={`sticky top-0 z-20 flex h-fit shrink-0 self-start flex-col border-r border-b border-[#e8e3d9] bg-[#fbfaf7] text-[#26332d] shadow-xs transition-[width] duration-200 rounded-br-2xl ${collapsed ? 'w-[76px]' : 'w-[252px]'}`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        className="absolute -right-3 top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#e8e3d9] bg-[#fbfaf7] text-[#748078] shadow-sm transition-colors hover:text-[#315643]"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        <div className={`flex h-[80px] items-center border-b border-[#eeeae2] ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'}`}>
          <div className={`flex shrink-0 items-center justify-center rounded-xl bg-black shadow-xs border border-neutral-900/10 overflow-hidden transition-all ${collapsed ? 'h-9 w-12 px-1' : 'h-10 w-[64px] px-1.5'}`}>
            <img
              src={logoHitamKiky}
              alt="Logo KIKY"
              className="h-full w-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[14px] font-bold tracking-tight text-[#0f2b48] leading-tight">
                PT SOLO MURNI
              </p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
                Cabang Bandung
              </p>
            </div>
          )}
        </div>

        <nav aria-label="Navigasi utama" className={`pt-7 ${collapsed ? 'px-2.5' : 'px-3.5'}`}>
          {!collapsed && (
            <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a1a39a]">
              Menu utama
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
                  title={collapsed ? label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex w-full items-center rounded-lg py-[10px] text-[13px] transition-colors ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive ? 'bg-[#e9eee8] font-semibold text-[#315643]' : 'text-[#727a73] hover:bg-[#f1f0eb] hover:text-[#34483a]'}`}
                >
                  {isActive && !collapsed && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-[#52745b]" />}
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.7} className="shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      <div className="mt-4 border-t border-[#eeeae2] p-3">
        <button
          type="button"
          onClick={() => handleMenuClick('profile')}
          title={collapsed ? `${user.name} (Lihat Profil)` : 'Lihat Profil'}
          className={`group mb-2 flex w-full items-center rounded-lg py-2 transition-colors cursor-pointer text-left ${collapsed ? 'justify-center px-0' : 'gap-3 px-2'
            } ${currentActive === 'profile'
              ? 'bg-[#e9eee8] font-semibold text-[#315643]'
              : 'hover:bg-[#f1f0eb]'
            }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4e9df] text-[11px] font-bold text-[#315643]">
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#354239] group-hover:text-[#315643] transition-colors">{user.name}</p>
              <p className="mt-0.5 truncate text-[10px] text-[#92968e]">{user.role}</p>
            </div>
          )}
        </button>
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? 'Keluar' : undefined}
          className={`flex w-full items-center rounded-lg py-2 text-xs font-medium text-[#9a6257] transition-colors hover:bg-[#f5ebe7] hover:text-[#82483e] ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}
        >
          <LogOut size={16} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  )
}
export { Sidebar }

