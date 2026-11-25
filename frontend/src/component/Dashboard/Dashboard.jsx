import { useState, useMemo, useEffect } from 'react'
import Sidebar from '../Sidebar/sidebar'
import Pengaturan from '../Setting/Pengaturan'
import ProfilePengguna from '../Profile/Profil pengguna'
import Reminder from '../Reminder/Reminder'
import Penjualan from '../Penjualan/penjualan'
import Pergudangan from '../Gudang/Pergudangan'
import {
  Download,
  Plus,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Package,
  RotateCcw,
  Search,
  Check,
  X,
  FileSpreadsheet,
  LogOut,
  Menu,
  ShoppingCart,
  Users,
  Store,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Folder,
  FolderOpen,
  FileText
} from 'lucide-react'

// Data operasional pesanan penjualan KIKY untuk wilayah Cabang Bandung
const defaultSalesOrders = [
  {
    id: 'SO-2026-005',
    customerId: 'CUST-005',
    customer: 'Toko Buku Merauke',
    city: 'Astana Anyar, Bandung',
    invoice: 'INV-2026-005',
    date: '16 Okt 2026',
    salesperson: 'Rina Kusuma',
    itemNo: 'BRG-005',
    itemDesc: 'Buku Tulis KIKY 38 Lembar',
    box: 40,
    total: 'Rp 48.000.000',
    totalValue: 48000000,
    status: 'Pending',
    warehouseStatus: 'Menunggu diterima'
  },
  {
    id: 'SO-2026-004',
    customerId: 'CUST-004',
    customer: 'TB Harapan Baru',
    city: 'Kopo, Bandung',
    invoice: 'INV-2026-004',
    date: '15 Okt 2026',
    salesperson: 'Andi Wijaya',
    itemNo: 'BRG-004',
    itemDesc: 'Buku Gambar KIKY A4',
    box: 40,
    total: 'Rp 52.400.000',
    totalValue: 52400000,
    status: 'Dikonfirmasi',
    warehouseStatus: 'Dalam pengiriman'
  },
  {
    id: 'SO-2026-003',
    customerId: 'CUST-003',
    customer: 'CV Sumber Rezeki',
    city: 'Cimahi',
    invoice: 'INV-2026-003',
    date: '14 Okt 2026',
    salesperson: 'Doni Prasetyo',
    itemNo: 'BRG-003',
    itemDesc: 'Kertas HVS KIKY 70gr',
    box: 12,
    total: 'Rp 14.800.000',
    totalValue: 14800000,
    status: 'Retur',
    warehouseStatus: 'Pemeriksaan retur'
  },
  {
    id: 'SO-2026-002',
    customerId: 'CUST-002',
    customer: 'UD Barokah ATK',
    city: 'Soreang, Kab. Bandung',
    invoice: 'INV-2026-002',
    date: '13 Okt 2026',
    salesperson: 'Rina Kusuma',
    itemNo: 'BRG-002',
    itemDesc: 'Buku Kotak KIKY',
    box: 28,
    total: 'Rp 36.250.000',
    totalValue: 36250000,
    status: 'Pending',
    warehouseStatus: 'Disiapkan gudang'
  },
  {
    id: 'SO-2026-001',
    customerId: 'CUST-001',
    customer: 'Toko Buku Singgalang',
    city: 'Cicadas, Bandung',
    invoice: 'INV-2026-001',
    date: '12 Okt 2026',
    salesperson: 'Andi Wijaya',
    itemNo: 'BRG-001',
    itemDesc: 'Buku Kas Folio KIKY',
    box: 15,
    total: 'Rp 19.500.000',
    totalValue: 19500000,
    status: 'Dikonfirmasi',
    warehouseStatus: 'Siap kirim'
  },
  {
    id: 'SO-2026-000',
    customerId: 'CUST-000',
    customer: 'Toko Agung Stationery',
    city: 'Buahbatu, Bandung',
    invoice: 'INV-2026-000',
    date: '11 Okt 2026',
    salesperson: 'Rina Kusuma',
    itemNo: 'BRG-000',
    itemDesc: 'Buku Tulis KIKY 58 Lembar',
    box: 50,
    total: 'Rp 65.000.000',
    totalValue: 65000000,
    status: 'Dikonfirmasi',
    warehouseStatus: 'Terkirim'
  },
  {
    id: 'SO-2025-099',
    customerId: 'CUST-099',
    customer: 'Toko Buku Togamas Supratman',
    city: 'Cibeunying, Bandung',
    invoice: 'INV-2025-099',
    date: '10 Okt 2026',
    salesperson: 'Doni Prasetyo',
    itemNo: 'BRG-099',
    itemDesc: 'Spiral Notebook KIKY',
    box: 35,
    total: 'Rp 42.100.000',
    totalValue: 42100000,
    status: 'Dikonfirmasi',
    warehouseStatus: 'Terkirim'
  }
]

export default function Dashboard({
  user = { name: 'Andi Wijaya', role: 'Operasional Gudang & Penjualan' },
  initialMenu = 'dashboard',
  onLogout
}) {
  const [activeMenu, setActiveMenu] = useState(initialMenu)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const requestLogout = () => setShowLogoutConfirm(true)
  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    onLogout?.()
  }

  // State Modal Ekspor Rekap
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('Folder Unduhan (Downloads)')
  const [exportFormat, setExportFormat] = useState('excel')
  const [exportSuccess, setExportSuccess] = useState('')

  // State Filter & Pencarian
  const [salesSearch, setSalesSearch] = useState('')
  const [salesFilter, setSalesFilter] = useState('semua')

  // Sinkronisasi data Penjualan dari localStorage
  const [salesOrders, setSalesOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('kiky_excel_penjualan')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            ...item,
            id: item.id || item.invoice || `SO-2026-${String(idx + 1).padStart(3, '0')}`,
            date: item.detailDate || item.date || 'Terbaru',
            salesperson: item.salesman || item.salesperson || 'Tim Sales KIKY',
            box: Number(item.carton) || Number(item.box) || (item.quantity ? Math.max(1, Math.round(Number(item.quantity) / 10)) : 10),
            status: item.status || item.salesStatus || 'Pending',
            total: item.total || (item.totalValue ? `Rp ${(item.totalValue).toLocaleString('id-ID')}` : 'Rp 25.000.000'),
            totalValue: item.totalValue || (Number(item.carton || 10) * 1250000),
            customer: item.customer || item.customerName || 'Toko Pelanggan',
            city: item.city || 'Bandung',
            warehouseStatus: item.warehouseStatus || (item.status === 'Dikonfirmasi' ? 'Diproses' : item.status === 'Retur' ? 'Retur' : 'Menunggu')
          }))
        }
      }
    } catch (e) {
      console.error('Gagal membaca data penjualan:', e)
    }
    return defaultSalesOrders
  })

  // Sinkronisasi realtime
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('kiky_excel_penjualan')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSalesOrders(parsed.map((item, idx) => ({
              ...item,
              id: item.id || item.invoice || `SO-2026-${String(idx + 1).padStart(3, '0')}`,
              date: item.detailDate || item.date || 'Terbaru',
              salesperson: item.salesman || item.salesperson || 'Tim Sales KIKY',
              box: Number(item.carton) || Number(item.box) || (item.quantity ? Math.max(1, Math.round(Number(item.quantity) / 10)) : 10),
              status: item.status || item.salesStatus || 'Pending',
              total: item.total || (item.totalValue ? `Rp ${(item.totalValue).toLocaleString('id-ID')}` : 'Rp 25.000.000'),
              totalValue: item.totalValue || (Number(item.carton || 10) * 1250000),
              customer: item.customer || item.customerName || 'Toko Pelanggan',
              city: item.city || 'Bandung',
              warehouseStatus: item.warehouseStatus || (item.status === 'Dikonfirmasi' ? 'Diproses' : item.status === 'Retur' ? 'Retur' : 'Menunggu')
            })))
          }
        }
      } catch (err) {
        console.error('Gagal sinkron data:', err)
      }
    }

    window.addEventListener('storage', handleSync)
    window.addEventListener('kiky-excel-imported', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('kiky-excel-imported', handleSync)
    }
  }, [])

  // Metrik Penjualan Riil
  const metrics = useMemo(() => {
    const totalOrders = salesOrders.length
    const confirmed = salesOrders.filter(o => o.status === 'Dikonfirmasi')
    const pending = salesOrders.filter(o => o.status === 'Pending')
    const retur = salesOrders.filter(o => o.status === 'Retur')
    const totalBox = salesOrders.reduce((sum, o) => sum + (Number(o.box) || 10), 0)

    const rawRevenue = salesOrders.reduce((sum, o) => {
      if (typeof o.totalValue === 'number' && o.totalValue > 0) return sum + o.totalValue
      if (typeof o.total === 'string') {
        const parsed = Number(o.total.replace(/[^0-9]/g, ''))
        if (!isNaN(parsed) && parsed > 0) return sum + parsed
      }
      return sum + ((Number(o.box) || 10) * 1350000)
    }, 0)

    const revenueJuta = (rawRevenue / 1000000).toLocaleString('id-ID', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    })

    return {
      totalOrders,
      confirmedCount: confirmed.length,
      pendingCount: pending.length,
      returCount: retur.length,
      totalBox,
      rawRevenue,
      revenueJuta
    }
  }, [salesOrders])

  // Top Sales Performance Leaderboard
  const topSalespeople = useMemo(() => {
    const map = {}
    salesOrders.forEach(o => {
      const name = o.salesperson || 'Tim Sales'
      if (!map[name]) {
        map[name] = { name, count: 0, box: 0 }
      }
      map[name].count += 1
      map[name].box += Number(o.box || 10)
    })
    return Object.values(map).sort((a, b) => b.box - a.box).slice(0, 3)
  }, [salesOrders])

  // Kategori Produk KIKY Terlaris
  const topCategories = useMemo(() => {
    const map = {
      'Buku Tulis Sekolah': { name: 'Buku Tulis KIKY (38/58 Hal)', box: 0, pct: 45 },
      'Buku Gambar & Warna': { name: 'Buku Gambar & Mewarnai A4', box: 0, pct: 25 },
      'Kertas HVS & Folio': { name: 'Kertas HVS 70gr & Folio KIKY', box: 0, pct: 18 },
      'Buku Kas & Agenda': { name: 'Buku Kas & Hardcover Folio', box: 0, pct: 12 },
    }
    salesOrders.forEach(o => {
      const desc = (o.itemDesc || '').toLowerCase()
      if (desc.includes('hvs')) map['Kertas HVS & Folio'].box += Number(o.box || 10)
      else if (desc.includes('gambar')) map['Buku Gambar & Warna'].box += Number(o.box || 10)
      else if (desc.includes('kas') || desc.includes('hardcover') || desc.includes('kotak')) map['Buku Kas & Agenda'].box += Number(o.box || 10)
      else map['Buku Tulis Sekolah'].box += Number(o.box || 10)
    })
    return Object.values(map)
  }, [salesOrders])

  // Filter Data untuk Tabel
  const displayedOrders = useMemo(() => {
    return salesOrders.filter(ord => {
      const matchSearch =
        (ord.customer || '').toLowerCase().includes(salesSearch.toLowerCase()) ||
        (ord.id || '').toLowerCase().includes(salesSearch.toLowerCase()) ||
        (ord.salesperson || '').toLowerCase().includes(salesSearch.toLowerCase()) ||
        (ord.city || '').toLowerCase().includes(salesSearch.toLowerCase())

      if (salesFilter === 'semua') return matchSearch
      return matchSearch && (ord.status || '').toLowerCase() === salesFilter.toLowerCase()
    }).slice(0, 8)
  }, [salesOrders, salesSearch, salesFilter])

  // Aksi Eksekusi Ekspor Rekap Laporan Penjualan (Excel, CSV, PDF)
  const handleExecuteExport = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    if (exportFormat === 'pdf') {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Laporan Rekap Penjualan KIKY - ${today}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 28px; color: #1e293b; }
              .header { border-bottom: 2px solid #0f2b48; padding-bottom: 12px; margin-bottom: 20px; }
              .company { font-size: 20px; font-weight: 800; color: #0f2b48; margin: 0; }
              .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
              .kpi-row { display: flex; gap: 16px; margin-bottom: 20px; }
              .kpi-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; }
              .kpi-label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }
              .kpi-val { font-size: 16px; font-weight: 800; color: #0f2b48; margin-top: 4px; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 12px; }
              th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
              th { background-color: #f1f5f9; font-weight: 700; color: #334155; }
              .text-center { text-align: center; }
              .footer { margin-top: 24px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
              @media print { body { padding: 12px; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="company">PT SOLO MURNI - KIKY CABANG BANDUNG</h1>
              <div class="sub">Laporan Rekapitulasi Operasional Penjualan &bull; Periode: ${today} &bull; Petugas: ${user.name || 'Andi Wijaya'}</div>
            </div>

            <div class="kpi-row">
              <div class="kpi-card">
                <div class="kpi-label">Total Omzet Penjualan</div>
                <div class="kpi-val">Rp ${metrics.revenueJuta} Juta</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Total Sales Order</div>
                <div class="kpi-val">${metrics.totalOrders} Transaksi</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Volume Terdistribusi</div>
                <div class="kpi-val">${metrics.totalBox} Dus / Karton</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Status Retur Toko</div>
                <div class="kpi-val">${metrics.returCount} Nota Retur</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 32px;" class="text-center">No</th>
                  <th>No. Sales Order</th>
                  <th>Tanggal</th>
                  <th>Pelanggan & Wilayah</th>
                  <th>Salesperson</th>
                  <th class="text-center">Dus</th>
                  <th>Nilai Transaksi</th>
                  <th class="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                ${salesOrders.map((o, idx) => `
                  <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.date || '-'}</td>
                    <td>${o.customer} (${o.city || 'Bandung'})</td>
                    <td>${o.salesperson || '-'}</td>
                    <td class="text-center"><strong>${o.box || 0}</strong></td>
                    <td>${o.total || '-'}</td>
                    <td class="text-center">${o.status || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <div>Dicetak otomatis melalui Sistem Operasional KIKY Cabang Bandung</div>
              <div>Halaman 1 dari 1</div>
            </div>

            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
          </html>
        `)
        printWindow.document.close()
        setExportSuccess(`Dokumen PDF rekap berhasil disiapkan dan dialog cetak telah dibuka!`)
      }
    } else {
      // Excel / CSV dengan UTF-8 BOM
      const headers = 'No,No Sales Order,Tanggal,Pelanggan,Kota/Wilayah,Salesperson,Volume Dus/Box,Nilai Transaksi,Status Penjualan\n'
      const rows = salesOrders
        .map(
          (o, idx) => `${idx + 1},"${o.id}","${o.date || ''}","${o.customer}","${o.city || 'Bandung'}","${o.salesperson || ''}",${o.box || 0},"${o.total || ''}","${o.status || ''}"`
        )
        .join('\n')

      const summaryRow = `\nTotal Ringkasan,,,"${salesOrders.length} Transaksi",,${metrics.totalBox},"Rp ${metrics.revenueJuta} Juta",\n`
      const content = '\uFEFF' + headers + rows + summaryRow
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const fileName = `Rekap_Penjualan_KIKY_Bandung_${new Date().toISOString().slice(0, 10)}.csv`
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportSuccess(`Rekap ${exportFormat.toUpperCase()} berhasil diunduh (${salesOrders.length} transaksi) ke "${selectedFolder}"!`)
    }

    setTimeout(() => {
      setShowExportModal(false)
      setExportSuccess('')
    }, 2200)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f3f5f9] dark:bg-[#081524] font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-[#1b2b44] selection:text-white transition-colors duration-200">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] px-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Buka navigasi menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-[#111e33] dark:text-white">KIKY Cabang Bandung</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 capitalize bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          {activeMenu}
        </span>
      </header>

      {/* Sidebar Navigasi KIKY */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(menuId) => setActiveMenu(menuId)}
        onLogout={requestLogout}
        user={user}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Konten Area Utama */}
      <main className={`flex-1 min-w-0 overflow-y-auto ${activeMenu === 'penjualan' || activeMenu === 'barang' || activeMenu === 'gudang' ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
        {/* =========================================================================
            TAMPILAN DASHBOARD UTAMA OPERASIONAL KIKY (BERSIH, PROFESIONAL & HUMANIS)
           ========================================================================= */}
        {activeMenu === 'dashboard' ? (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Kop Operasional Resmi PT Solo Murni */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <span>PT SOLO MURNI</span>
                    <span>&bull;</span>
                    <span className="text-[#1b2b44] dark:text-sky-400 font-bold">CABANG BANDUNG</span>
                    <span>&bull;</span>
                    <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Dashboard Operasional Cabang
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Aktivitas pesanan masuk, pergerakan dus ATK KIKY, dan omzet berjalan wilayah Bandung Raya.
                  </p>
                </div>

                {/* Tombol Aksi Nyata */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081524] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span>Ekspor Rekap Laporan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMenu('penjualan')}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1b2b44] dark:bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-[#243856] dark:hover:bg-sky-500 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Buat Sales Order</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Kartu KPI Utama Operasional */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Card 1: Nilai Penjualan */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>NILAI PENJUALAN</span>
                    <Wallet className="h-4 w-4 text-[#1b2b44] dark:text-sky-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Rp {metrics.revenueJuta}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Juta</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Target Cabang: Rp 225 Jt</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    81,9%
                  </span>
                </div>
              </div>

              {/* Card 2: Sales Order Masuk */}
              <div
                onClick={() => setActiveMenu('penjualan')}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>SALES ORDER MASUK</span>
                    <ShoppingCart className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {metrics.totalOrders}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Transaksi</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{metrics.confirmedCount} Dikonfirmasi</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{metrics.pendingCount} Pending</span>
                </div>
              </div>

              {/* Card 3: Fisik Terdistribusi */}
              <div
                onClick={() => setActiveMenu('penjualan')}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>FISIK TERDISTRIBUSI</span>
                    <Package className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {metrics.totalBox}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dus / Karton</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Produk Buku &amp; Kertas</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Area Bandung</span>
                </div>
              </div>

              {/* Card 4: Klaim Retur Toko */}
              <div
                onClick={() => setActiveMenu('penjualan')}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>KLAIM RETUR TOKO</span>
                    <RotateCcw className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {metrics.returCount}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nota Retur</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Pemeriksaan Fisik Gudang</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">12 Dus</span>
                </div>
              </div>
            </div>

            {/* Layout Operasional 2 Kolom (8 : 4 Grid) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Kolom Kiri: Tabel Transaksi Sales Order Terkini (8 cols) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] shadow-xs lg:col-span-8 flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          Daftar Sales Order Terkini
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Order penjualan wilayah Bandung yang terdaftar di sistem operasional
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveMenu('penjualan')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b2b44] dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        <span>Buka Modul Penjualan</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Filter Tab & Kolom Pencarian */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#081524] rounded-lg text-xs border border-slate-200/50 dark:border-slate-800">
                        {['semua', 'dikonfirmasi', 'pending', 'retur'].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setSalesFilter(f)}
                            className={`px-3 py-1 rounded-md font-semibold capitalize transition-all cursor-pointer ${
                              salesFilter === f
                                ? 'bg-white dark:bg-[#0c1e33] text-slate-900 dark:text-white shadow-2xs'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            {f === 'semua' ? `Semua (${salesOrders.length})` : f}
                          </button>
                        ))}
                      </div>

                      <div className="relative min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari No SO, toko, sales..."
                          value={salesSearch}
                          onChange={(e) => setSalesSearch(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#081524] py-1.5 pr-3 pl-8 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#081524] focus:border-[#1b2b44] dark:focus:border-sky-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tabel Data Penjualan */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                      <thead className="bg-slate-50 dark:bg-[#081524]/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="py-3 px-4">No. Sales Order</th>
                          <th className="py-3 px-3">Tanggal</th>
                          <th className="py-3 px-4">Pelanggan &amp; Wilayah</th>
                          <th className="py-3 px-3">Salesperson</th>
                          <th className="py-3 px-3 text-center">Dus</th>
                          <th className="py-3 px-4">Nilai Transaksi</th>
                          <th className="py-3 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {displayedOrders.length > 0 ? (
                          displayedOrders.map((ord) => {
                            const isConfirmed = ord.status === 'Dikonfirmasi'
                            const isRetur = ord.status === 'Retur'

                            return (
                              <tr
                                key={ord.id}
                                onClick={() => setActiveMenu('penjualan')}
                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                              >
                                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                  {ord.id}
                                </td>
                                <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                                  {ord.date}
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                                  <div>{ord.customer}</div>
                                  <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">{ord.city || 'Bandung'}</span>
                                </td>
                                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                                  {ord.salesperson}
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                                  {ord.box}
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                                  {ord.total}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                                      isConfirmed
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                        : isRetur
                                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                    }`}
                                  >
                                    {ord.status}
                                  </span>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                              Tidak ada data pesanan yang sesuai dengan pencarian.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 p-3.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>Menampilkan {displayedOrders.length} dari {salesOrders.length} pesanan</span>
                  <button
                    type="button"
                    onClick={() => setActiveMenu('penjualan')}
                    className="font-semibold text-[#1b2b44] dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    Buka seluruh data di Modul Penjualan &rarr;
                  </button>
                </div>
              </div>

              {/* Kolom Kanan: Kategori Terlaris & Tim Sales Lapangan (4 cols) */}
              <div className="space-y-6 lg:col-span-4">
                {/* Panel 1: Produk KIKY Terlaris */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kategori Produk KIKY</h3>
                    <span className="text-[11px] text-slate-400 font-medium">Bulan Berjalan</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {topCategories.map((cat, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.name}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{cat.box > 0 ? `${cat.box} Dus` : `${cat.pct}%`}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-[#1b2b44] dark:bg-sky-500 rounded-full"
                            style={{ width: `${cat.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 2: Kontribusi Sales Lapangan Area Bandung */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Salesperson Lapangan</h3>
                    <span className="text-[11px] text-slate-400 font-medium">Bandung Raya</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {topSalespeople.map((sp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#081524] border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b2b44] dark:bg-sky-600 text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{sp.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{sp.box} Dus ({sp.count} SO)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Sistem */}
            <footer className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center rounded-full border border-slate-900 dark:border-slate-400 px-2 py-0.5">
                  <span className="text-[9px] font-black tracking-widest text-slate-900 dark:text-slate-200">KIKY</span>
                </div>
                <span className="font-medium text-slate-600 dark:text-slate-400">Sistem Operasional Cabang Bandung</span>
              </div>
              <div>PT Solo Murni &bull; Hak Cipta Dilindungi</div>
            </footer>
          </div>
        ) : (activeMenu === 'barang' || activeMenu === 'gudang') ? (
          <Pergudangan user={user} onBack={() => setActiveMenu('dashboard')} />
        ) : activeMenu === 'penjualan' ? (
          <Penjualan user={user} onBack={() => setActiveMenu('dashboard')} />
        ) : activeMenu === 'reminder' ? (
          <Reminder />
        ) : activeMenu === 'profile' ? (
          <ProfilePengguna user={user} />
        ) : activeMenu === 'pengaturan' ? (
          <Pengaturan user={user} onLogout={requestLogout} />
        ) : (
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <button
                type="button"
                onClick={() => setActiveMenu('dashboard')}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Operasional
              </button>
              <span className="text-slate-300 font-semibold">&gt;</span>
              <span className="font-semibold text-slate-800">
                {activeMenu === 'rekap insentif' && 'Rekap Insentif'}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">
                {activeMenu === 'rekap insentif' && 'Rekapitulasi Insentif Sales'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Laporan perolehan insentif dan komisi tim penjualan PT Solo Murni Cabang Bandung berdasarkan target bulanan.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setActiveMenu('dashboard')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1b2b44] px-4 py-2 text-xs font-semibold text-white hover:bg-[#243856] cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Kembali ke Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Dialog: Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Konfirmasi Keluar</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Anda perlu memasukkan kembali akun Anda untuk membuka sistem.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="rounded-lg bg-rose-700 hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-700 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog: Ekspor Rekap Laporan Penjualan */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setShowExportModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1b2b44]/10 dark:bg-sky-500/10 text-[#1b2b44] dark:text-sky-400">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Ekspor Laporan Penjualan</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">PT Solo Murni Cabang Bandung</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Pilihan Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Format Laporan:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
                  { id: 'pdf', label: 'Dokumen PDF', icon: FileText },
                  { id: 'csv', label: 'Data CSV', icon: FileText },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id)}
                    className={`p-2.5 rounded-lg border font-semibold text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      exportFormat === fmt.id
                        ? 'border-[#1b2b44] dark:border-sky-500 bg-[#1b2b44] dark:bg-sky-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081524] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <fmt.icon className="h-4 w-4" />
                    <span>{fmt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Data Rekap */}
            <div className="rounded-lg bg-slate-50 dark:bg-[#081524] p-3 text-xs text-slate-600 dark:text-slate-400 space-y-1 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Total Data Terpilih:</span>
                <span className="font-bold text-slate-900 dark:text-white">{salesOrders.length} Transaksi</span>
              </div>
              <div className="flex justify-between">
                <span>Nilai Total Omzet:</span>
                <span className="font-bold text-slate-900 dark:text-white">Rp {metrics.revenueJuta} Juta</span>
              </div>
            </div>

            {exportSuccess && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {exportSuccess}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteExport}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1b2b44] hover:bg-[#243856] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Laporan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
