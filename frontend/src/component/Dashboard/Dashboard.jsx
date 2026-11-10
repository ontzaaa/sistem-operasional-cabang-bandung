import { useState } from 'react'
import Sidebar from '../Sidebar/sidebar'
import Pengaturan from '../Setting/Pengaturan'
import ProfilePengguna from '../Profile/Profil pengguna'
import {
  Calendar,
  ChevronDown,
  Download,
  Plus,
  CreditCard,
  PieChart,
  FileText,
  Truck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Package,
  RotateCcw,
  Clock,
  Layers,
  Folder,
  FolderOpen,
  Search,
  Check,
  X,
  FileSpreadsheet,
  ChartNoAxesCombined,
  Bell
} from 'lucide-react'

export default function Dashboard({
  user = { name: 'Andi Wijaya', role: 'Operasional Gudang & Penjualan' },
  initialMenu = 'dashboard',
  onLogout
}) {
  const [activeMenu, setActiveMenu] = useState(initialMenu)

  // Modal Ekspor Rekap & Pilihan Folder
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('Folder Unduhan (Downloads)')
  const [exportFormat, setExportFormat] = useState('excel') // 'excel' | 'pdf' | 'csv'
  const [exportSuccess, setExportSuccess] = useState('')

  // State Halaman Penjualan
  const [salesSearch, setSalesSearch] = useState('')
  const [salesFilter, setSalesFilter] = useState('semua') // 'semua' | 'dikonfirmasi' | 'pending' | 'retur'

  // Data Pipeline Posisi Order Saat Ini
  const pipelineStatuses = [
    {
      id: 'penerimaan',
      label: 'Penerimaan SO',
      sub: '1 order • 40 box',
      icon: Clock,
      bg: 'bg-amber-50',
      border: 'border-amber-200/80',
      text: 'text-amber-900',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100/80'
    },
    {
      id: 'disiapkan',
      label: 'Disiapkan',
      sub: '1 order • 28 box',
      icon: Package,
      bg: 'bg-blue-50',
      border: 'border-blue-200/80',
      text: 'text-blue-900',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100/80'
    },
    {
      id: 'siap-kirim',
      label: 'Siap kirim',
      sub: '1 order • 15 box',
      icon: CheckCircle2,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/80',
      text: 'text-emerald-900',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100/80'
    },
    {
      id: 'pengiriman',
      label: 'Dalam pengiriman',
      sub: '1 order • 40 box',
      icon: Truck,
      bg: 'bg-sky-50',
      border: 'border-sky-200/80',
      text: 'text-sky-900',
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-100/80'
    },
    {
      id: 'retur',
      label: 'Retur',
      sub: '1 order • 12 box',
      icon: RotateCcw,
      bg: 'bg-purple-50',
      border: 'border-purple-200/80',
      text: 'text-purple-900',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100/80'
    }
  ]

  // Data Tabel Order Lengkap
  const allOrders = [
    {
      id: 'SO-2026-005',
      date: '16 Okt 2026',
      customer: 'Toko Harapan Baru',
      salesperson: 'Rina Kusuma',
      box: 40,
      total: 'Rp 48.000.000',
      salesStatus: 'Pending',
      salesStatusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      warehouseStatus: 'Menunggu diterima',
      warehouseStatusColor: 'bg-amber-50 text-amber-800 border-amber-200',
      warehouseSub: 'SO baru dari penjualan'
    },
    {
      id: 'SO-2026-004',
      date: '15 Okt 2026',
      customer: 'CV Makmur Sejahtera',
      salesperson: 'Andi Wijaya',
      box: 40,
      total: 'Rp 52.400.000',
      salesStatus: 'Dikonfirmasi',
      salesStatusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warehouseStatus: 'Dikirim',
      warehouseStatusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      warehouseSub: 'Estimasi tiba hari ini'
    },
    {
      id: 'SO-2026-003',
      date: '15 Okt 2026',
      customer: 'Toko Sumber Rezeki',
      salesperson: 'Doni Prasetyo',
      box: 12,
      total: 'Rp 14.800.000',
      salesStatus: 'Retur',
      salesStatusColor: 'bg-purple-50 text-purple-700 border-purple-200',
      warehouseStatus: 'Retur',
      warehouseStatusColor: 'bg-purple-50 text-purple-700 border-purple-200',
      warehouseSub: 'Menunggu pemeriksaan'
    },
    {
      id: 'SO-2026-002',
      date: '14 Okt 2026',
      customer: 'UD Berkah Abadi',
      salesperson: 'Rina Kusuma',
      box: 28,
      total: 'Rp 36.250.000',
      salesStatus: 'Pending',
      salesStatusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      warehouseStatus: 'Disiapkan',
      warehouseStatusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      warehouseSub: '18 / 28 box siap'
    },
    {
      id: 'SO-2026-001',
      date: '13 Okt 2026',
      customer: 'Toko Maju Jaya',
      salesperson: 'Andi Wijaya',
      box: 15,
      total: 'Rp 19.500.000',
      salesStatus: 'Dikonfirmasi',
      salesStatusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warehouseStatus: 'Siap kirim',
      warehouseStatusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warehouseSub: 'Surat jalan belum dibuat'
    },
    {
      id: 'SO-2026-000',
      date: '12 Okt 2026',
      customer: 'Gramedia Solo Square',
      salesperson: 'Rina Kusuma',
      box: 50,
      total: 'Rp 65.000.000',
      salesStatus: 'Dikonfirmasi',
      salesStatusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warehouseStatus: 'Terkirim',
      warehouseStatusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warehouseSub: 'Diterima toko'
    },
    {
      id: 'SO-2025-099',
      date: '11 Okt 2026',
      customer: 'Toko Buku Togamas',
      salesperson: 'Doni Prasetyo',
      box: 35,
      total: 'Rp 42.100.000',
      salesStatus: 'Dikonfirmasi',
      salesStatusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warehouseStatus: 'Terkirim',
      warehouseStatusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warehouseSub: 'Diterima toko'
    }
  ]

  // Data 5 Order Terbaru untuk Tampilan Dashboard
  const recentOrders = allOrders.slice(0, 5)

  // Filter Data untuk Halaman Penjualan
  const filteredOrders = allOrders.filter(ord => {
    const matchSearch =
      ord.customer.toLowerCase().includes(salesSearch.toLowerCase()) ||
      ord.id.toLowerCase().includes(salesSearch.toLowerCase()) ||
      ord.salesperson.toLowerCase().includes(salesSearch.toLowerCase())

    if (salesFilter === 'semua') return matchSearch
    return matchSearch && ord.salesStatus.toLowerCase() === salesFilter.toLowerCase()
  })

  // Data Bar Chart Tren Penjualan
  const chartData = [
    { period: '1-4 Okt', septHeight: 52, oktHeight: 68, oktVal: '34' },
    { period: '5-8 Okt', septHeight: 60, oktHeight: 85, oktVal: '42,5' },
    { period: '9-12 Okt', septHeight: 70, oktHeight: 96, oktVal: '48' },
    { period: '13-16 Okt', septHeight: 92, oktHeight: 115, oktVal: '57,75' }
  ]

  // Aksi Pilih Folder Native Browser (jika didukung) atau Custom
  const handleSelectNativeFolder = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await window.showDirectoryPicker()
        setSelectedFolder(dirHandle.name)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error memilih folder:', err)
        }
      }
    }
  }

  // Aksi Eksekusi Ekspor Rekap
  const handleExecuteExport = () => {
    // Generate file CSV / Excel sederhana untuk diunduh langsung
    const headers = 'No Sales Order,Tanggal,Pelanggan,Salesperson,Box,Nilai Transaksi,Status Penjualan,Status Gudang\n'
    const rows = allOrders
      .map(
        o => `"${o.id}","${o.date}","${o.customer}","${o.salesperson}",${o.box},"${o.total}","${o.salesStatus}","${o.warehouseStatus}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileName = `Rekap_Penjualan_KIKY_${new Date().toISOString().slice(0, 10)}.${exportFormat === 'excel' ? 'csv' : exportFormat}`
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportSuccess(`Rekap berhasil diekspor ke "${selectedFolder}" dengan nama file ${fileName}!`)
    setTimeout(() => {
      setShowExportModal(false)
      setExportSuccess('')
    }, 2000)
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5f9] font-sans text-slate-800 antialiased selection:bg-[#1a2b44] selection:text-white">
      {/* Sidebar Navigasi KIKY */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(menuId) => setActiveMenu(menuId)}
        onLogout={onLogout}
        user={user}
      />

      {/* Konten Area Utama */}
      <main className="flex-1 p-5 sm:p-7 lg:p-9 overflow-y-auto">
        {/* =========================================================================
            TAMPILAN 1: HALAMAN DASHBOARD UTAMA
           ========================================================================= */}
        {activeMenu === 'dashboard' ? (
          <div>
            {/* Top Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>Operasional</span>
              <span className="text-slate-300 font-semibold">&gt;</span>
              <span className="font-semibold text-slate-800">Dashboard</span>
            </div>

            {/* Greeting & Header Utama */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  JUMAT, 16 OKTOBER 2026
                </p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111e33] tracking-tight">
                  Selamat datang, {user.name || 'Andi Wijaya'}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Pantau penjualan dan pergerakan order gudang dalam satu ringkasan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                {/* Tombol Ekspor Rekap -> Membuka dialog pilihan folder */}
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer"
                  title="Pilih folder dan ekspor rekap penjualan"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Ekspor rekap</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMenu('penjualan')}
                  className="flex items-center gap-2 rounded-xl bg-[#1b2b44] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#1b2b44]/20 hover:bg-[#121f33] transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Buat SO baru</span>
                </button>
              </div>
            </div>

            {/* Subheader Filter Bar */}
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-slate-700 shadow-2xs font-medium cursor-pointer hover:border-slate-300 transition-colors">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Penjualan: 1–16 Oktober 2026</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
              </div>

              <div className="text-[11px] text-slate-400">
                Operasional gudang : <span className="font-semibold text-slate-600">5 order pantauan</span> &bull; posisi pukul 14:32 WIB
              </div>
            </div>

            {/* Baris 1: 4 KPI Metric Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Card 1: Nilai Penjualan (Dark Navy) */}
              <div className="rounded-2xl bg-[#1b293e] p-5 text-white shadow-md shadow-[#1b293e]/15 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                    <span>NILAI PENJUALAN</span>
                    <CreditCard className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tracking-tight">Rp184,25</span>
                    <span className="text-xs text-slate-300 font-medium">juta</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col gap-0.5">
                  <span className="text-[11px] text-slate-300">1–16 Oktober 2026</span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    &uarr; 12% vs 1–16 September
                  </span>
                </div>
              </div>

              {/* Card 2: Total Sales Order */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    <span>TOTAL SALES ORDER</span>
                    <PieChart className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#111e33] tracking-tight">48</span>
                    <span className="text-xs text-slate-400 font-medium">order</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold text-slate-700">1–16 Oktober 2026</span>
                  <span className="text-[11px] text-slate-400">Seluruh order pada periode ini</span>
                </div>
              </div>

              {/* Card 3: Antrean Gudang */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    <span>ANTREAN GUDANG</span>
                    <FileText className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#111e33] tracking-tight">3</span>
                    <span className="text-xs text-slate-400 font-medium">order</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold text-slate-800">83 box menunggu diproses</span>
                  <span className="text-[11px] text-slate-400">Dari 5 order pantauan saat ini</span>
                </div>
              </div>

              {/* Card 4: Dalam Pengiriman */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    <span>DALAM PENGIRIMAN</span>
                    <Truck className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#111e33] tracking-tight">40</span>
                    <span className="text-xs text-slate-400 font-medium">box</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold text-slate-800">1 order dalam perjalanan</span>
                  <span className="text-[11px] text-slate-400">Dari 5 order pantauan saat ini</span>
                </div>
              </div>
            </div>

            {/* Baris 2: Tren Penjualan & Perlu Perhatian */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Kolom Kiri: Tren Penjualan (7 cols / ~60%) */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Header Card */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#111e33]">Tren penjualan</h2>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-200/70">
                          + 12,0%
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        1–16 Oktober 2026 &bull; nilai order, sebelum retur
                      </p>
                    </div>

                    {/* Legend Chart */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-[#1b2b44]" />
                        <span>Oktober</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-[#d0dcf0]" />
                        <span>September</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400">Dalam juta rupiah</div>

                  {/* Area Bar Chart */}
                  <div className="relative mt-6 h-48 flex items-end justify-between px-3 sm:px-6">
                    {/* Horizontal Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300">
                      <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-0.5">
                        <span>60</span>
                      </div>
                      <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-0.5">
                        <span>40</span>
                      </div>
                      <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-0.5">
                        <span>20</span>
                      </div>
                      <div className="border-b border-slate-200 flex items-center justify-between pb-0.5">
                        <span>0</span>
                      </div>
                    </div>

                    {/* Grouped Bars */}
                    {chartData.map((item, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className="flex items-end gap-1.5">
                      {/* Bar September (Light Blue) */}
                      <div
                        className="w-5 sm:w-7 rounded-t-md bg-[#d3e0f3] transition-all hover:brightness-95"
                        style={{ height: `${item.septHeight}px` }}
                        title={`September: ${item.period}`}
                      />
                      {/* Bar Oktober (Dark Navy with text inside/top) */}
                      <div
                        className="w-5 sm:w-7 rounded-t-md bg-[#1b2b44] flex items-center justify-center transition-all hover:bg-[#121f33]"
                        style={{ height: `${item.oktHeight}px` }}
                        title={`Oktober: Rp ${item.oktVal} juta`}
                      >
                        <span className="text-[10px] font-bold text-white leading-none">
                          {item.oktVal}
                        </span>
                      </div>
                    </div>
                    {/* Period label */}
                    <span className="mt-2.5 text-[11px] font-medium text-slate-500">
                      {item.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Progress Bar di Bawah */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600">Target Oktober: Rp225 juta</span>
                <span className="text-[#1b2b44]">81,9% tercapai</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1b2b44] transition-all duration-500"
                  style={{ width: '81.9%' }}
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Perlu Perhatian (5 cols / ~40%) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h2 className="text-base font-bold text-[#111e33]">Perlu perhatian</h2>
                </div>
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 border border-red-200/80">
                  2 order
                </span>
              </div>

              {/* List Alert Items */}
              <div className="space-y-3.5">
                {/* Item 1: Terlambat 1 hari */}
                <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 transition-all hover:shadow-xs">
                  <div className="flex items-start justify-between text-xs">
                    <span className="font-mono text-[11px] font-bold text-slate-600">
                      SO-2026-003
                    </span>
                    <span className="font-bold text-red-600 text-[11px]">Terlambat 1 hari</span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-[#111e33]">
                    Toko Sumber Rezeki &bull; 12 box
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Retur belum diperiksa &bull; batas 15 Okt
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveMenu('penjualan')}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#1b2b44] hover:underline cursor-pointer"
                  >
                    <span>Periksa retur</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Item 2: 1 hari lagi */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:shadow-xs">
                  <div className="flex items-start justify-between text-xs">
                    <span className="font-mono text-[11px] font-bold text-slate-600">
                      SO-2026-002
                    </span>
                    <span className="font-bold text-amber-600 text-[11px]">1 hari lagi</span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-[#111e33]">
                    UD Berkah Abadi &bull; 28 box
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    18 / 28 box siap &bull; batas kirim 17 Okt
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveMenu('penjualan')}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#1b2b44] hover:underline cursor-pointer"
                  >
                    <span>Lanjutkan penyiapan</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Baris 3: Posisi Order Saat Ini (Pipeline Stage Cards) */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-xs">
            <h2 className="text-sm font-bold text-[#111e33]">Posisi order saat ini</h2>
            <span className="text-slate-400 text-[11px]">
              5 order pantauan &bull; 123 box pesanan + 12 box retur
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {pipelineStatuses.map((st) => {
              const Icon = st.icon
              return (
                <div
                  key={st.id}
                  onClick={() => setActiveMenu('penjualan')}
                  className={`rounded-2xl border ${st.border} ${st.bg} p-3.5 transition-all hover:shadow-xs cursor-pointer`}
                  title={`Klik untuk lihat detail order ${st.label}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${st.iconBg} ${st.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-bold ${st.text}`}>{st.label}</p>
                      <p className="truncate text-[10px] text-slate-500 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Baris 4: Tabel Order Terbaru */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
          {/* Header Tabel */}
          <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#111e33]">Order terbaru</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                5 order pantauan lintas tanggal &bull; diurutkan berdasarkan pembaruan terbaru
              </p>
            </div>
            
            {/* Tombol Lihat Semua Penjualan -> Pindah ke Penjualan */}
            <button
              type="button"
              onClick={() => setActiveMenu('penjualan')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b2b44] hover:underline cursor-pointer group"
            >
              <span>Lihat semua penjualan</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <tr>
                  <th className="py-3.5 px-5">NO. SALES ORDER</th>
                  <th className="py-3.5 px-4">PELANGGAN</th>
                  <th className="py-3.5 px-4">SALESPERSON</th>
                  <th className="py-3.5 px-4 text-center">BOX</th>
                  <th className="py-3.5 px-4 text-center">STATUS PENJUALAN</th>
                  <th className="py-3.5 px-4">STATUS GUDANG</th>
                  <th className="py-3.5 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setActiveMenu('penjualan')}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    {/* No. Sales Order */}
                    <td className="py-4 px-5 font-mono font-bold text-[#111e33]">
                      {ord.id}
                    </td>

                    {/* Pelanggan */}
                    <td className="py-4 px-4 font-bold text-[#111e33]">
                      {ord.customer}
                    </td>

                    {/* Salesperson */}
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {ord.salesperson}
                    </td>

                    {/* Box */}
                    <td className="py-4 px-4 text-center font-extrabold text-[#111e33]">
                      {ord.box}
                    </td>

                    {/* Status Penjualan (Pill with dot) */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${ord.salesStatusColor}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {ord.salesStatus}
                      </span>
                    </td>

                    {/* Status Gudang (Pill with subtext) */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${ord.warehouseStatusColor}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {ord.warehouseStatus}
                        </span>
                        <span className="text-[10px] text-slate-400 pl-1">
                          {ord.warehouseSub}
                        </span>
                      </div>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        className="text-slate-300 hover:text-slate-600 transition-colors p-1"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Tabel */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 p-4 text-[11px] text-slate-400 gap-2">
            <span>135 box ditampilkan: 123 box pesanan + 12 box retur</span>
            <span>Bukan keseluruhan 48 order periode ini</span>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <footer className="mt-8 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-black/80 px-2 py-0.5">
              <span className="text-[9px] font-black tracking-widest text-black">KIKY</span>
            </div>
            <span className="font-semibold text-slate-600">Gudang &amp; Penjualan</span>
          </div>
          <div>Operasional Gudang &amp; Penjualan</div>
          <div>Terakhir diperbarui: 14:32 WIB</div>
        </footer>
      </div>
    ) : activeMenu === 'penjualan' ? (
      /* =========================================================================
         TAMPILAN 2: HALAMAN PENJUALAN (Semua Penjualan)
         ========================================================================= */
      <div>
        {/* Breadcrumb Navigasi Kembali ke Dashboard */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={() => setActiveMenu('dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Operasional
            </button>
            <span className="text-slate-300 font-semibold">&gt;</span>
            <button
              type="button"
              onClick={() => setActiveMenu('dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Dashboard
            </button>
            <span className="text-slate-300 font-semibold">&gt;</span>
            <span className="font-semibold text-[#111e33]">Penjualan</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveMenu('dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1b2b44] hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>

        {/* Header Halaman Penjualan */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111e33] tracking-tight">
              Manajemen Penjualan &amp; Sales Order
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Daftar seluruh pesanan penjualan produk KIKY Stationery PT Solo Murni.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Ekspor Data</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Fitur Form Tambah Sales Order (SO) baru akan segera dibuka.')}
              className="flex items-center gap-2 rounded-xl bg-[#1b2b44] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#1b2b44]/20 hover:bg-[#121f33] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah SO Baru</span>
            </button>
          </div>
        </div>

        {/* Filter dan Pencarian */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab Filter Status */}
          <div className="flex rounded-xl bg-slate-200/60 p-1 text-xs font-semibold">
            {[
              { id: 'semua', label: 'Semua Order' },
              { id: 'dikonfirmasi', label: 'Dikonfirmasi' },
              { id: 'pending', label: 'Pending' },
              { id: 'retur', label: 'Retur' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSalesFilter(tab.id)}
                className={`rounded-lg px-3.5 py-1.5 transition-all cursor-pointer ${
                  salesFilter === tab.id
                    ? 'bg-white text-[#1b2b44] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari toko, no SO, atau salesperson..."
              value={salesSearch}
              onChange={(e) => setSalesSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200/90 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
            />
          </div>
        </div>

        {/* Tabel Penjualan Lengkap */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <tr>
                  <th className="py-3.5 px-5">NO. SALES ORDER</th>
                  <th className="py-3.5 px-4">TANGGAL</th>
                  <th className="py-3.5 px-4">PELANGGAN</th>
                  <th className="py-3.5 px-4">SALESPERSON</th>
                  <th className="py-3.5 px-4 text-center">BOX</th>
                  <th className="py-3.5 px-4">TOTAL NILAI</th>
                  <th className="py-3.5 px-4 text-center">STATUS PENJUALAN</th>
                  <th className="py-3.5 px-4">STATUS GUDANG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-[#111e33]">{ord.id}</td>
                      <td className="py-4 px-4 text-slate-500">{ord.date}</td>
                      <td className="py-4 px-4 font-bold text-[#111e33]">{ord.customer}</td>
                      <td className="py-4 px-4 text-slate-600 font-medium">{ord.salesperson}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-[#111e33]">{ord.box}</td>
                      <td className="py-4 px-4 font-bold text-[#111e33]">{ord.total}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${ord.salesStatusColor}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {ord.salesStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${ord.warehouseStatusColor}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {ord.warehouseStatus}
                          </span>
                          <span className="text-[10px] text-slate-400 pl-1">{ord.warehouseSub}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      Tidak ditemukan data order dengan pencarian "{salesSearch}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 p-4 text-[11px] text-slate-400">
            <span>Menampilkan {filteredOrders.length} dari total {allOrders.length} order penjualan</span>
            <button
              type="button"
              onClick={() => setActiveMenu('dashboard')}
              className="text-[#1b2b44] font-semibold hover:underline cursor-pointer"
            >
              Lihat di Dashboard Utama &rarr;
            </button>
          </div>
        </div>
      </div>
    ) : activeMenu === 'profile' ? (
      <ProfilePengguna user={user} />
    ) : activeMenu === 'pengaturan' ? (
      <Pengaturan user={user} onLogout={onLogout} />
    ) : (
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <button
            type="button"
            onClick={() => setActiveMenu('dashboard')}
            className="hover:text-slate-900 transition-colors"
          >
            Operasional
          </button>
          <span className="text-slate-300 font-semibold">&gt;</span>
          <span className="font-semibold text-slate-800">
            {activeMenu === 'barang' && 'Gudang & Data Barang'}
            {activeMenu === 'rekap insentif' && 'Rekap Insentif'}
            {activeMenu === 'reminder' && 'Reminder Operasional'}
          </span>
        </div>

        {/* Card Tampilan Modul */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-14 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1b2b44]/10 text-[#1b2b44] mb-4">
            {activeMenu === 'barang' && <Package className="h-8 w-8" />}
            {activeMenu === 'rekap insentif' && <ChartNoAxesCombined className="h-8 w-8" />}
            {activeMenu === 'reminder' && <Bell className="h-8 w-8" />}
          </div>
          <h2 className="text-2xl font-extrabold text-[#111e33] tracking-tight">
            {activeMenu === 'barang' && 'Manajemen Gudang & Stok Barang'}
            {activeMenu === 'rekap insentif' && 'Rekapitulasi Insentif Sales'}
            {activeMenu === 'reminder' && 'Reminder & Pengingat Operasional'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {activeMenu === 'barang' && 'Pantau persediaan stok buku, ATK, dan status ketersediaan barang KIKY di gudang cabang.'}
            {activeMenu === 'rekap insentif' && 'Laporan perolehan insentif dan komisi tim penjualan PT Solo Murni berdasarkan target bulanan.'}
            {activeMenu === 'reminder' && 'Daftar pengingat tenggat waktu kirim order, jatuh tempo invoice, dan jadwal tindak lanjut retur.'}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Modul Siap Dikonfigurasi</span>
          </div>

          <div className="mt-7 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveMenu('dashboard')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1b2b44] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#1b2b44]/20 hover:bg-[#111e33] transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </main>

  {/* =========================================================================
      MODAL DIALOG: PILIH FOLDER & EKSPOR REKAP
     ========================================================================= */}
  {showExportModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b2b44]/10 text-[#1b2b44]">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111e33]">Ekspor Rekap Laporan</h3>
              <p className="text-xs text-slate-400">Pilih lokasi folder dan format file rekap</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowExportModal(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Konten Pilihan Folder */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Folder Tujuan Simpan
            </label>

            {/* Opsi Pilihan Folder Komputer */}
            <div className="space-y-2">
              {[
                { name: 'Folder Unduhan (Downloads)', desc: 'C:\\Users\\...\\Downloads' },
                { name: 'Folder Dokumen (Documents)', desc: 'C:\\Users\\...\\Documents\\Laporan KIKY' },
                { name: 'Folder Proyek PT SM', desc: 'D:\\RIEZKYA\\...\\PT SM\\Laporan' },
              ].map((f, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedFolder(f.name)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedFolder === f.name
                      ? 'border-[#1b2b44] bg-[#1b2b44]/5 text-[#111e33]'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Folder className={`h-4 w-4 ${selectedFolder === f.name ? 'text-[#1b2b44]' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold">{f.name}</p>
                      <p className="text-[10px] text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                  {selectedFolder === f.name && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b2b44] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Tombol Native Directory Picker (jika browser mendukung) */}
            {'showDirectoryPicker' in window && (
              <button
                type="button"
                onClick={handleSelectNativeFolder}
                className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-[#1b2b44] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Pilih Folder Lain di Komputer Anda...</span>
              </button>
            )}
          </div>

          {/* Format Ekspor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Format Rekap
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
                { id: 'pdf', label: 'Dokumen PDF', icon: FileText },
                { id: 'csv', label: 'Data CSV', icon: FileText },
              ].map(fmt => {
                const Icon = fmt.icon
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      exportFormat === fmt.id
                        ? 'border-[#1b2b44] bg-[#1b2b44] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px]">{fmt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notifikasi Sukses */}
          {exportSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{exportSuccess}</span>
            </div>
          )}
        </div>

        {/* Footer Tombol Aksi */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowExportModal(false)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExecuteExport}
            className="flex items-center gap-1.5 rounded-xl bg-[#1b2b44] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#1b2b44]/20 hover:bg-[#121f33] transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Simpan ke Folder</span>
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  )
}