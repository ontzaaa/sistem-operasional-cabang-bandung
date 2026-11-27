import { useState, useEffect } from 'react'
import {
  ChevronDown,
  Info,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  Check,
  KeyRound
} from 'lucide-react'
import LupaSandiModal from '../Login/LupaSandiModal'

// Kamus teks khusus halaman Pengaturan
const text = {
  id: {
    breadcrumb: 'Pengaturan',
    headerTitle: 'Pengaturan Akun',
    headerDesc: 'Kelola preferensi sistem, tema tampilan, notifikasi, dan keamanan akun.',

    prefTitle: 'Preferensi Sistem',
    prefDesc: 'Atur tema tampilan, bahasa antarmuka, dan zona waktu operasional.',
    themeLabel: 'Preferensi Tema Antarmuka',
    themeHelper: 'Sesuaikan skema warna tampilan aplikasi operasional sesuai kenyamanan kerja Anda',
    themeLight: 'Tema Terang (Light)',
    themeDark: 'Tema Gelap (Dark)',
    themeSystem: 'Otomatis (Sistem)',
    langLabel: 'Bahasa',
    langHelper: 'Bahasa tampilan aplikasi',
    tzLabel: 'Zona Waktu',
    tzHelper: 'Waktu Indonesia Barat (UTC+7)',

    notifTitle: 'Notifikasi & Pengingat',
    notifDesc: 'Atur pembaruan data dan pengingat operasional cabang.',
    notifOrderTitle: 'Notifikasi Pesanan',
    notifOrderDesc: 'Pembaruan data penjualan dan status order gudang.',
    notifOpsTitle: 'Pengingat Operasional',
    notifOpsDesc: 'Jadwal pengiriman barang, penyiapan pesanan, dan retur.',
    notifInfo: 'Notifikasi disesuaikan dengan hak akses akun operasional Anda.',

    saveNote: 'Perubahan preferensi dan tema tersimpan di browser ini.',
    saveSuccess: 'Pengaturan berhasil disimpan.',
    btnCancel: 'Batal',
    btnSave: 'Simpan Perubahan',
    logoutNote: 'Keluar dari sesi akun saat ini.',
    btnLogout: 'Keluar Akun',

    secTitle: 'Keamanan Akun',
    secDesc: 'Pengaturan akses dan kata sandi akun.',
    passTitle: 'Kata Sandi',
    passChanged: 'Terakhir diubah: 1 Oktober 2026',
    passOldPh: 'Kata sandi saat ini',
    passNewPh: 'Kata sandi baru (min. 8 karakter)',
    passConfirmPh: 'Konfirmasi kata sandi baru',
    passBtnChange: 'Ubah Kata Sandi',
    passBtnCancel: 'Batal',
    passBtnSave: 'Simpan',
    passAlert: 'Kata sandi berhasil diperbarui.',
  },
  en: {
    breadcrumb: 'Settings',
    headerTitle: 'Account Settings',
    headerDesc: 'Manage system preferences, display themes, notifications, and account security.',

    prefTitle: 'System Preferences',
    prefDesc: 'Set display theme, interface language, and operational time zone.',
    themeLabel: 'Display Theme',
    themeHelper: 'Choose application interface color mode',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    themeSystem: 'System',
    langLabel: 'Language',
    langHelper: 'Application display language',
    tzLabel: 'Time Zone',
    tzHelper: 'Western Indonesian Time (UTC+7)',

    notifTitle: 'Notifications & Reminders',
    notifDesc: 'Configure branch data updates and operational reminders.',
    notifOrderTitle: 'Order Notifications',
    notifOrderDesc: 'Sales updates and warehouse order status.',
    notifOpsTitle: 'Operational Reminders',
    notifOpsDesc: 'Shipping schedules, order prep, and return handling.',
    notifInfo: 'Notifications follow your operational account permissions.',

    saveNote: 'Preferences and theme changes are saved in this browser.',
    saveSuccess: 'Settings saved successfully.',
    btnCancel: 'Cancel',
    btnSave: 'Save Changes',
    logoutNote: 'Sign out of current account session.',
    btnLogout: 'Sign Out',

    secTitle: 'Account Security',
    secDesc: 'Manage account access and password.',
    passTitle: 'Password',
    passChanged: 'Last changed: October 1, 2026',
    passOldPh: 'Current password',
    passNewPh: 'New password (min. 8 characters)',
    passConfirmPh: 'Confirm new password',
    passBtnChange: 'Change Password',
    passBtnCancel: 'Cancel',
    passBtnSave: 'Save',
    passAlert: 'Password updated successfully.',
  }
}

// Komponen Toggle Switch
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center justify-center p-1 cursor-pointer focus:outline-none"
    >
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          checked ? 'bg-[#1b2b44] dark:bg-sky-500 border-[#1b2b44] dark:border-sky-500' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  )
}

// Komponen Select Dropdown
function SelectField({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1c30] px-3.5 py-2.5 pr-10 text-sm text-slate-800 dark:text-slate-100 focus:border-[#1b2b44] dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-[#1b2b44] cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-[#0c1c30]">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
    </div>
  )
}

// Helper terpadu DOM tema di luar fungsi komponen utama
const applyThemeToDOM = (themeMode) => {
  const isDark = themeMode === 'gelap' || (
    themeMode === 'sistem' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  document.documentElement.classList.toggle('dark', isDark)
  document.body.classList.toggle('dark', isDark)
}

export default function Pengaturan({ user = { name: 'Andi Wijaya', role: 'Operasional Gudang & Penjualan' }, onLogout }) {
  // State Tema & Preferensi
  const [activeTema, setActiveTema] = useState(() => localStorage.getItem('kiky_theme') || 'terang')
  const [selectedTema, setSelectedTema] = useState(() => localStorage.getItem('kiky_theme') || 'terang')
  const [bahasa, setBahasa] = useState(() => localStorage.getItem('kiky_language') || 'id')
  const [zonaWaktu, setZonaWaktu] = useState(() => localStorage.getItem('kiky_timezone') || 'wib')

  // Sinkronisasi Tema saat komponen dimuat
  useEffect(() => {
    const saved = localStorage.getItem('kiky_theme') || 'terang'
    setActiveTema(saved)
    setSelectedTema(saved)
    applyThemeToDOM(saved)
  }, [])

  // Handler saat opsi tema dipilih seketika
  const handleSelectTheme = (themeMode) => {
    setSelectedTema(themeMode)
    applyThemeToDOM(themeMode)
    localStorage.setItem('kiky_theme', themeMode)
    window.dispatchEvent(new CustomEvent('kiky-theme-changed', { detail: { theme: themeMode } }))
  }

  // State Notifikasi
  const [notifOrder, setNotifOrder] = useState(true)
  const [notifOperasional, setNotifOperasional] = useState(true)

  // State Keamanan
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showLupaSandiModal, setShowLupaSandiModal] = useState(false)
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('')
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // State feedback simpan
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Ambil teks sesuai pilihan bahasa
  const t = text[bahasa] || text.id

  const handleSave = () => {
    // 1. Terapkan tema yang dipilih ke DOM seketika
    applyThemeToDOM(selectedTema)

    // 2. Simpan permanen ke state aktif & localStorage
    setActiveTema(selectedTema)
    localStorage.setItem('kiky_theme', selectedTema)
    localStorage.setItem('kiky_language', bahasa)
    localStorage.setItem('kiky_timezone', zonaWaktu)

    // 3. Trigger custom event untuk menyinkronkan seluruh bagian sistem
    window.dispatchEvent(new CustomEvent('kiky-theme-changed', { detail: { theme: selectedTema } }))

    // 4. Beri feedback sukses
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3500)
  }

  const handleCancel = () => {
    // Kembalikan ke tema yang sebelumnya tersimpan
    setSelectedTema(activeTema)
    applyThemeToDOM(activeTema)
    localStorage.setItem('kiky_theme', activeTema)
    window.dispatchEvent(new CustomEvent('kiky-theme-changed', { detail: { theme: activeTema } }))
    setSaveSuccess(false)
  }

  const handleLogout = () => {
    if (onLogout) onLogout()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#081524] font-sans text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.breadcrumb}</span>
        </nav>

        {/* Header Halaman */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t.headerTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.headerDesc}
          </p>
        </div>

        {/* Grid Layout Utama */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Kolom Kiri: Preferensi & Notifikasi */}
          <div className="space-y-6 lg:col-span-2">

            {/* Card 1: Preferensi Umum & Tema Tampilan */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 sm:p-6 shadow-xs">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t.prefTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {t.prefDesc}
                </p>
              </div>

              {/* Pemilihan Tema Gelap & Terang */}
              <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.themeLabel}
                  </label>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Tema aktif saat ini: <span className="font-semibold text-[#1b2b44] dark:text-sky-400 capitalize">{activeTema === 'gelap' ? 'Tema Gelap' : activeTema === 'terang' ? 'Tema Terang' : 'Otomatis Sistem'}</span>
                  </span>
                </div>
                <p className="mb-3 text-[11px] text-slate-500 dark:text-slate-400">
                  {t.themeHelper}. Pilih salah satu opsi di bawah, lalu klik tombol <span className="font-semibold text-slate-700 dark:text-slate-200">"Simpan Perubahan"</span> untuk menerapkan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Pilihan 1: Mode Terang */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('terang')}
                    className={`relative flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedTema === 'terang'
                        ? 'border-[#1b2b44] dark:border-sky-400 bg-sky-50/70 dark:bg-sky-950/40 text-slate-900 dark:text-white ring-2 ring-[#1b2b44] dark:ring-sky-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081524] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                      <Sun className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{t.themeLight}</p>
                        {selectedTema === 'terang' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Kontras standar cerah untuk siang hari</p>
                    </div>
                    {selectedTema === 'terang' && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1b2b44] dark:bg-sky-500 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  {/* Pilihan 2: Mode Gelap */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('gelap')}
                    className={`relative flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedTema === 'gelap'
                        ? 'border-[#1b2b44] dark:border-sky-400 bg-slate-900 text-white ring-2 ring-[#1b2b44] dark:ring-sky-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081524] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                      <Moon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-bold ${selectedTema === 'gelap' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{t.themeDark}</p>
                        {selectedTema === 'gelap' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 ${selectedTema === 'gelap' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>Mereduksi kelelahan mata di ruang redup</p>
                    </div>
                    {selectedTema === 'gelap' && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  {/* Pilihan 3: Sistem */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('sistem')}
                    className={`relative flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedTema === 'sistem'
                        ? 'border-[#1b2b44] dark:border-sky-400 bg-sky-50/70 dark:bg-sky-950/40 text-slate-900 dark:text-white ring-2 ring-[#1b2b44] dark:ring-sky-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#081524] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <Monitor className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{t.themeSystem}</p>
                        {selectedTema === 'sistem' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Menyesuaikan pengaturan sistem operasi</p>
                    </div>
                    {selectedTema === 'sistem' && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1b2b44] dark:bg-sky-500 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Notifikasi jika ada pilihan belum disimpan */}
                {selectedTema !== activeTema && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                    <span>
                      Pilihan baru: <strong>{selectedTema === 'gelap' ? 'Tema Gelap' : selectedTema === 'terang' ? 'Tema Terang' : 'Otomatis Sistem'}</strong>. Tekan tombol <strong>"Simpan Perubahan"</strong> di bawah untuk menerapkan secara langsung.
                    </span>
                  </div>
                )}
              </div>

              {/* Bahasa & Zona Waktu */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Bahasa Aplikasi */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.langLabel}
                  </label>
                  <SelectField
                    value={bahasa}
                    onChange={setBahasa}
                    options={[
                      { value: 'id', label: 'Bahasa Indonesia' },
                      { value: 'en', label: 'English' },
                    ]}
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {t.langHelper}
                  </p>
                </div>

                {/* Zona Waktu */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.tzLabel}
                  </label>
                  <SelectField
                    value={zonaWaktu}
                    onChange={setZonaWaktu}
                    options={[
                      { value: 'wib', label: 'WIB (UTC+7)' },
                      { value: 'wita', label: 'WITA (UTC+8)' },
                      { value: 'wit', label: 'WIT (UTC+9)' },
                    ]}
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {t.tzHelper}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Notifikasi & Reminder */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 sm:p-6 shadow-xs">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t.notifTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {t.notifDesc}
                </p>
              </div>

              <div className="space-y-4">
                {/* Toggle 1: Notifikasi Order */}
                <div className="flex items-center justify-between gap-4">
                  <div className="pr-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.notifOrderTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {t.notifOrderDesc}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Toggle checked={notifOrder} onChange={setNotifOrder} />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80" />

                {/* Toggle 2: Pengingat Operasional */}
                <div className="flex items-center justify-between gap-4">
                  <div className="pr-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.notifOpsTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {t.notifOpsDesc}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Toggle checked={notifOperasional} onChange={setNotifOperasional} />
                  </div>
                </div>
              </div>

              {/* Info Notifikasi */}
              <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#081524] p-3 text-xs text-slate-600 dark:text-slate-400">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{t.notifInfo}</span>
              </div>
            </div>

            {/* Aksi Simpan */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Mode <strong>{activeTema === 'gelap' ? 'Gelap' : activeTema === 'terang' ? 'Terang' : 'Sistem'}</strong> &amp; preferensi berhasil diterapkan dan disimpan!</span>
                  </span>
                ) : (
                  <span>{t.saveNote}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081524] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[38px]"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none rounded-lg bg-[#1b2b44] dark:bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-[#111e33] dark:hover:bg-sky-500 transition-colors cursor-pointer min-h-[38px] shadow-xs"
                >
                  {t.btnSave}
                </button>
              </div>
            </div>

            {/* Keluar dari Sesi */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t.logoutNote}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer min-h-[38px]"
              >
                {t.btnLogout}
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Keamanan Akun */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e33] p-5 sm:p-6 shadow-xs">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t.secTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {t.secDesc}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{t.passTitle}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {t.passChanged}
                </p>

                {/* Feedback Notifikasi Password */}
                {passwordSuccessMsg && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <span>{passwordSuccessMsg}</span>
                  </div>
                )}
                {passwordErrorMsg && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs text-rose-800 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <span>{passwordErrorMsg}</span>
                  </div>
                )}

                {/* Form Ganti Password */}
                {showChangePassword ? (
                  <div className="mt-3 space-y-2.5">
                    <div>
                      <label className="sr-only">{t.passOldPh}</label>
                      <input
                        type="password"
                        placeholder={t.passOldPh}
                        value={oldPassword}
                        onChange={(e) => {
                          setOldPassword(e.target.value)
                          setPasswordErrorMsg('')
                        }}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081524] px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#1b2b44] dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-[#1b2b44]"
                      />
                      <div className="mt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowLupaSandiModal(true)}
                          className="text-[10px] font-medium text-[#1b2b44] dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          Lupa kata sandi saat ini?
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="sr-only">{t.passNewPh}</label>
                      <input
                        type="password"
                        placeholder={t.passNewPh}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          setPasswordErrorMsg('')
                        }}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081524] px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#1b2b44] dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-[#1b2b44]"
                      />
                    </div>
                    <div>
                      <label className="sr-only">{t.passConfirmPh}</label>
                      <input
                        type="password"
                        placeholder={t.passConfirmPh}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setPasswordErrorMsg('')
                        }}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081524] px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#1b2b44] dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-[#1b2b44]"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false)
                          setOldPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                          setPasswordErrorMsg('')
                        }}
                        className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081524] py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer min-h-[36px]"
                      >
                        {t.passBtnCancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!oldPassword.trim()) {
                            setPasswordErrorMsg('Silakan masukkan kata sandi saat ini.')
                            return
                          }
                          if (newPassword.length < 8) {
                            setPasswordErrorMsg('Kata sandi baru minimal harus 8 karakter.')
                            return
                          }
                          if (newPassword !== confirmPassword) {
                            setPasswordErrorMsg('Konfirmasi kata sandi baru tidak cocok.')
                            return
                          }
                          setPasswordSuccessMsg('Kata sandi berhasil diperbarui.')
                          setPasswordErrorMsg('')
                          setShowChangePassword(false)
                          setOldPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                          setTimeout(() => setPasswordSuccessMsg(''), 4000)
                        }}
                        className="flex-1 rounded-md bg-[#1b2b44] dark:bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-[#111e33] dark:hover:bg-sky-500 transition-colors cursor-pointer min-h-[36px]"
                      >
                        {t.passBtnSave}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(true)
                        setPasswordSuccessMsg('')
                        setPasswordErrorMsg('')
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081524] px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[38px]"
                    >
                      {t.passBtnChange}
                    </button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowLupaSandiModal(true)}
                        className="text-[11px] font-medium text-[#1b2b44] dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Lupa kata sandi akun?
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Dialog Lupa Kata Sandi */}
      <LupaSandiModal
        isOpen={showLupaSandiModal}
        onClose={() => setShowLupaSandiModal(false)}
        initialIdentifier={user?.username || user?.name || ''}
        onSuccess={({ message }) => {
          setPasswordSuccessMsg(message || 'Kata sandi akun Anda berhasil diperbarui.')
          setPasswordErrorMsg('')
          setShowLupaSandiModal(false)
          setTimeout(() => setPasswordSuccessMsg(''), 4000)
        }}
      />
    </div>
  )
}
