import { useState } from 'react'
import {
  ChevronDown,
  Info,
  CheckCircle
} from 'lucide-react'

// Kamus teks khusus halaman Pengaturan
const text = {
  id: {
    breadcrumb: 'Pengaturan',
    headerTitle: 'Pengaturan Akun',
    headerDesc: 'Kelola preferensi sistem, notifikasi, dan keamanan akun.',

    prefTitle: 'Preferensi Sistem',
    prefDesc: 'Atur bahasa antarmuka dan zona waktu operasional.',
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

    saveNote: 'Perubahan berlaku untuk sesi akun ini.',
    saveSuccess: 'Perubahan berhasil disimpan.',
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
    headerDesc: 'Manage system preferences, notifications, and account security.',

    prefTitle: 'System Preferences',
    prefDesc: 'Set interface language and operational time zone.',
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

    saveNote: 'Changes apply to this account session.',
    saveSuccess: 'Changes saved successfully.',
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
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-slate-300 transition-colors ${
          checked ? 'bg-[#1b2b44] border-[#1b2b44]' : 'bg-slate-200'
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
        className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{t.breadcrumb}</span>
        </nav>

        {/* Header Halaman */}
        <div className="mb-6 border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t.headerTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {t.headerDesc}
          </p>
        </div>

        {/* Grid Layout Utama */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Kolom Kiri: Preferensi & Notifikasi */}
          <div className="space-y-6 lg:col-span-2">

            {/* Card 1: Preferensi Umum */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900">{t.prefTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t.prefDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Bahasa Aplikasi */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
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
                  <p className="mt-1 text-[11px] text-slate-500">
                    {t.langHelper}
                  </p>
                </div>

                {/* Zona Waktu */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
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
                  <p className="mt-1 text-[11px] text-slate-500">
                    {t.tzHelper}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Notifikasi & Reminder */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900">{t.notifTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t.notifDesc}
                </p>
              </div>

              <div className="space-y-4">
                {/* Toggle 1: Notifikasi Order */}
                <div className="flex items-center justify-between gap-4">
                  <div className="pr-2">
                    <p className="text-sm font-medium text-slate-800">{t.notifOrderTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t.notifOrderDesc}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Toggle checked={notifOrder} onChange={setNotifOrder} />
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Toggle 2: Pengingat Operasional */}
                <div className="flex items-center justify-between gap-4">
                  <div className="pr-2">
                    <p className="text-sm font-medium text-slate-800">{t.notifOpsTitle}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t.notifOpsDesc}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Toggle checked={notifOperasional} onChange={setNotifOperasional} />
                  </div>
                </div>
              </div>

              {/* Info Notifikasi */}
              <div className="mt-5 flex items-start gap-2.5 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{t.notifInfo}</span>
              </div>
            </div>

            {/* Aksi Simpan */}
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    {t.saveSuccess}
                  </span>
                ) : (
                  <span>{t.saveNote}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {}}
                  className="flex-1 sm:flex-none rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[38px]"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none rounded-md bg-[#1b2b44] px-5 py-2 text-xs font-semibold text-white hover:bg-[#111e33] transition-colors cursor-pointer min-h-[38px]"
                >
                  {t.btnSave}
                </button>
              </div>
            </div>

            {/* Keluar dari Sesi */}
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-600">
                {t.logoutNote}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer min-h-[38px]"
              >
                {t.btnLogout}
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Keamanan Akun */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900">{t.secTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t.secDesc}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-800">{t.passTitle}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {t.passChanged}
                </p>

                {/* Form Ganti Password */}
                {showChangePassword ? (
                  <div className="mt-3 space-y-2.5">
                    <div>
                      <label className="sr-only">{t.passOldPh}</label>
                      <input
                        type="password"
                        placeholder={t.passOldPh}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44]"
                      />
                    </div>
                    <div>
                      <label className="sr-only">{t.passNewPh}</label>
                      <input
                        type="password"
                        placeholder={t.passNewPh}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44]"
                      />
                    </div>
                    <div>
                      <label className="sr-only">{t.passConfirmPh}</label>
                      <input
                        type="password"
                        placeholder={t.passConfirmPh}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44]"
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
                        }}
                        className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[36px]"
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
                        className="flex-1 rounded-md bg-[#1b2b44] py-2 text-xs font-semibold text-white hover:bg-[#111e33] transition-colors cursor-pointer min-h-[36px]"
                      >
                        {t.passBtnSave}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(true)}
                    className="mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[38px]"
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
  )
}
