import { useState } from 'react'
import {
  Lock,
  ChevronDown,
  Info,
  CheckCircle,
  Layers
} from 'lucide-react'

// Kamus teks khusus halaman Pengaturan
const text = {
  id: {
    breadcrumb: 'Pengaturan',
    headerLabel: 'PENGATURAN AKUN',
    headerTitle: 'Pengaturan',
    headerDesc: 'Sesuaikan preferensi aplikasi, notifikasi, dan keamanan akun Anda.',

    prefTitle: 'Preferensi umum',
    prefDesc: 'Atur bahasa dan format yang digunakan di seluruh aplikasi.',
    langLabel: 'Bahasa aplikasi',
    langHelper: 'Bahasa untuk menu dan informasi aplikasi',
    tzLabel: 'Zona waktu',
    tzHelper: 'Waktu Indonesia Barat · Asia/Jakarta',

    notifTitle: 'Notifikasi & reminder',
    notifDesc: 'Tetap terhubung dengan pembaruan operasional yang penting.',
    notifOrderTitle: 'Notifikasi order',
    notifOrderDesc: 'Pembaruan penjualan dan perubahan status order gudang.',
    notifOpsTitle: 'Pengingat operasional',
    notifOpsDesc: 'Tenggat pengiriman, penyiapan order, dan tindak lanjut retur.',
    notifInfo: 'Notifikasi ditampilkan di aplikasi sesuai akses operasional Anda.',

    saveNote: 'Perubahan hanya berlaku untuk akun Anda.',
    saveSuccess: 'Perubahan berhasil disimpan!',
    btnCancel: 'Batal',
    btnSave: 'Simpan perubahan',
    logoutNote: 'Keluar dari sesi akun ini.',
    btnLogout: 'Keluar akun',

    secTitle: 'Keamanan akun',
    secDesc: 'Jaga akun dan data operasional tetap aman.',
    passTitle: 'Kata sandi',
    passChanged: 'Diubah 1 Oktober 2026',
    passOldPh: 'Kata sandi lama',
    passNewPh: 'Kata sandi baru (min. 8 karakter)',
    passConfirmPh: 'Konfirmasi kata sandi baru',
    passBtnChange: 'Ubah kata sandi',
    passBtnCancel: 'Batal',
    passBtnSave: 'Simpan',
    passAlert: 'Kata sandi berhasil diubah!',
  },
  en: {
    breadcrumb: 'Settings',
    headerLabel: 'ACCOUNT SETTINGS',
    headerTitle: 'Settings',
    headerDesc: 'Customize your app preferences, notifications, and account security.',

    prefTitle: 'General preferences',
    prefDesc: 'Set the language and format used across the application.',
    langLabel: 'App language',
    langHelper: 'Language for menus and app information',
    tzLabel: 'Time zone',
    tzHelper: 'Western Indonesian Time · Asia/Jakarta',
    currLabel: 'Currency',
    currHelper: 'Example: Rp 250,000',

    notifTitle: 'Notifications & reminders',
    notifDesc: 'Stay connected with important operational updates.',
    notifOrderTitle: 'Order notifications',
    notifOrderDesc: 'Sales updates and warehouse order status changes.',
    notifOpsTitle: 'Operational reminders',
    notifOpsDesc: 'Shipping deadlines, order preparation, and return follow-ups.',
    notifInfo: 'Notifications are shown in the app based on your operational access.',

    saveNote: 'Changes only apply to your account.',
    saveSuccess: 'Changes saved successfully!',
    btnCancel: 'Cancel',
    btnSave: 'Save changes',
    logoutNote: 'Sign out of this account session.',
    btnLogout: 'Sign out',

    secTitle: 'Account security',
    secDesc: 'Keep your account and operational data safe.',
    passTitle: 'Password',
    passChanged: 'Changed October 1, 2026',
    passOldPh: 'Current password',
    passNewPh: 'New password (min. 8 characters)',
    passConfirmPh: 'Confirm new password',
    passBtnChange: 'Change password',
    passBtnCancel: 'Cancel',
    passBtnSave: 'Save',
    passAlert: 'Password changed successfully!',
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
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#1b2b44]' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
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
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export default function Pengaturan({ user = { name: 'Andi Wijaya', role: 'Operasional Gudang & Penjualan' }, onLogout }) {
  // State Preferensi Umum
  const [bahasa, setBahasa] = useState('id')
  const [zonaWaktu, setZonaWaktu] = useState('wib')
  const [matauang, setMatauang] = useState('idr')

  // State Notifikasi
  const [notifOrder, setNotifOrder] = useState(true)
  const [notifOperasional, setNotifOperasional] = useState(true)

  // State Keamanan
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // State feedback simpan
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Ambil teks sesuai pilihan bahasa
  const t = text[bahasa] || text.id

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const handleLogout = () => {
    if (onLogout) onLogout()
  }

  return (
    <div className="min-h-screen bg-[#f3f5f9] font-sans text-slate-800 antialiased">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span>{t.breadcrumb}</span>
          <span className="text-slate-300">&gt;</span>
        </div>

        {/* Header Halaman */}
        <div className="mb-7 border-b border-slate-200 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {t.headerLabel}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#111e33] sm:text-3xl">
            {t.headerTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {t.headerDesc}
          </p>
        </div>

        {/* Grid 2 Kolom Utama */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Kolom Kiri (2/3 lebar) */}
          <div className="space-y-6 lg:col-span-2">

            {/* Card 1: Preferensi Umum */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-bold text-[#111e33]">{t.prefTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t.prefDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Bahasa Aplikasi */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    {t.langHelper}
                  </p>
                </div>

                {/* Zona Waktu */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
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
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    {t.tzHelper}
                  </p>
                </div>

                {/* Mata Uang */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {t.currLabel}
                  </label>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    {t.currHelper}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Notifikasi & Reminder */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-bold text-[#111e33]">{t.notifTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t.notifDesc}
                </p>
              </div>

              <div className="space-y-5">
                {/* Toggle 1: Notifikasi Order */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.notifOrderTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {t.notifOrderDesc}
                    </p>
                  </div>
                  <div className="mt-0.5 shrink-0">
                    <Toggle checked={notifOrder} onChange={setNotifOrder} />
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Toggle 2: Pengingat Operasional */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.notifOpsTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {t.notifOpsDesc}
                    </p>
                  </div>
                  <div className="mt-0.5 shrink-0">
                    <Toggle checked={notifOperasional} onChange={setNotifOperasional} />
                  </div>
                </div>
              </div>

              {/* Info Notifikasi */}
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-xs text-slate-500">
                <Info className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{t.notifInfo}</span>
              </div>
            </div>

            {/* Footer Aksi Simpan */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                {t.saveNote}
              </p>
              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    {t.saveSuccess}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {}}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-[#1b2b44] px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#1b2b44]/20 hover:bg-[#111e33] transition-all cursor-pointer"
                >
                  {t.btnSave}
                </button>
              </div>
            </div>

            {/* Keluar dari Sesi */}
            <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                {t.logoutNote}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
              >
                {t.btnLogout}
              </button>
            </div>
          </div>

          {/* Kolom Kanan (1/3 lebar): Keamanan Akun */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-bold text-[#111e33]">{t.secTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t.secDesc}
                </p>
              </div>

              <div className="space-y-5">
                {/* Item 1: Kata Sandi */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{t.passTitle}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {t.passChanged}
                    </p>

                    {/* Form Ganti Password */}
                    {showChangePassword ? (
                      <div className="mt-3 space-y-2.5">
                        <input
                          type="password"
                          placeholder={t.passOldPh}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                        />
                        <input
                          type="password"
                          placeholder={t.passNewPh}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                        />
                        <input
                          type="password"
                          placeholder={t.passConfirmPh}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowChangePassword(false)
                              setOldPassword('')
                              setNewPassword('')
                              setConfirmPassword('')
                            }}
                            className="flex-1 rounded-lg border border-slate-200 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            {t.passBtnCancel}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              alert(t.passAlert)
                              setShowChangePassword(false)
                              setOldPassword('')
                              setNewPassword('')
                              setConfirmPassword('')
                            }}
                            className="flex-1 rounded-lg bg-[#1b2b44] py-1.5 text-[11px] font-bold text-white hover:bg-[#111e33] transition-colors cursor-pointer"
                          >
                            {t.passBtnSave}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowChangePassword(true)}
                        className="mt-2.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                      >
                        {t.passBtnChange}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
