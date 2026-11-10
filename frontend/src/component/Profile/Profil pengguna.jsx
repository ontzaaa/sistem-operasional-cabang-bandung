import { useState } from 'react'
import {
  Pencil,
  Building2,
  CheckCircle2,
  Check,
  Info,
  Lock,
  Shield,
  Monitor,
  ArrowRight,
  FileText,
  User,
  X
} from 'lucide-react'

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

export default function ProfilePengguna({
  user = {
    name: 'Andi Wijaya',
    role: 'Sales Supervisor',
    branch: 'Cabang Bandung',
    idNumber: 'KRY - 0024',
    email: 'andi.wijaya@kiky.co.id',
    phone: '+62 812-3456-7890',
    location: 'Kota Bandung, Jawa Barat',
    department: 'Penjualan',
    mainBranch: 'Bandung / Gudang Cabang Bandung',
    manager: 'Budi Santoso • Sales Manager',
    joinDate: '1 Oktober 2026'
  }
}) {
  // State Data Profil
  const [profileData, setProfileData] = useState({
    name: user.name || 'Andi Wijaya',
    role: user.role || 'Sales Supervisor',
    branch: user.branch || 'Cabang Bandung',
    idNumber: user.idNumber || 'KRY - 0024',
    email: user.email || 'andi.wijaya@kiky.co.id',
    phone: user.phone || '+62 812-3456-7890',
    location: user.location || 'Kota Bandung, Jawa Barat',
    department: user.department || 'Penjualan',
    mainBranch: user.mainBranch || 'Bandung / Gudang Cabang Bandung',
    manager: user.manager || 'Budi Santoso • Sales Manager',
    joinDate: user.joinDate || '1 Oktober 2026'
  })

  // State Preferensi Notifikasi
  const [notifOrder, setNotifOrder] = useState(true)
  const [notifOperasional, setNotifOperasional] = useState(true)

  // State Modal Edit Profil
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ ...profileData })

  // State Modal Ubah Password
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')

  // Inisial untuk avatar lingkaran
  const initials = profileData.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase() || 'AW'

  const handleOpenEdit = () => {
    setEditForm({ ...profileData })
    setShowEditModal(true)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setProfileData({ ...editForm })
    setShowEditModal(false)
  }

  const handleSavePassword = (e) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPasswordNotice('Kata sandi baru minimal 8 karakter.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice('Konfirmasi kata sandi baru tidak cocok!')
      return
    }
    alert('Kata sandi berhasil diperbarui!')
    setShowPasswordModal(false)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordNotice('')
  }

  return (
    <div className="w-full space-y-6">
      {/* =========================================================================
          HEADER HALAMAN PROFIL
         ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            PENGATURAN AKUN
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#111e33] sm:text-3xl">
            Profil saya
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Kelola informasi pribadi, akses operasional, dan keamanan akun Anda.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b2b44] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#1b2b44]/20 hover:bg-[#111e33] transition-all cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit profil</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CARD 1: BANNER PROFIL UTAMA
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Bagian Kiri: Avatar & Identitas */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#111e33] font-bold text-xl border border-slate-200/80 shadow-2xs">
              {initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#111e33]">
                  {profileData.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Akun aktif
                </span>
              </div>

              <p className="mt-0.5 text-sm font-medium text-slate-500">
                {profileData.role}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{profileData.branch}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span>{profileData.idNumber}</span>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Tanggal Bergabung & Verifikasi Email */}
          <div className="flex flex-col items-start sm:items-end gap-1.5 text-xs text-slate-400 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
            <p>Bergabung sejak {profileData.joinDate}</p>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Email terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          GRID 2 KOLOM: INFORMASI PRIBADI & PEKERJAAN (Kiri), KEAMANAN & PREFERENSI (Kanan)
         ========================================================================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---------------- KOLOM KIRI (2/3 lebar) ---------------- */}
        <div className="space-y-6 lg:col-span-2">
          {/* CARD 2: INFORMASI PRIBADI */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-[#111e33]">
                Informasi pribadi
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Informasi kontak untuk kebutuhan operasional Anda.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400">Nama lengkap</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.name}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Email kantor</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.email}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Nomor telepon</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.phone}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Domisili</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.location}</p>
              </div>
            </div>
          </div>

          {/* CARD 3: INFORMASI PEKERJAAN */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-[#111e33]">
                Informasi pekerjaan
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Penempatan dan cakupan akses Anda di KIKY.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400">Departemen</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.department}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Jabatan</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.role}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Cabang / gudang utama</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.mainBranch}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Atasan langsung</p>
                <p className="mt-1 text-sm font-semibold text-[#111e33]">{profileData.manager}</p>
              </div>
            </div>

            <div className="my-5 border-t border-slate-100" />

            {/* Akses Operasional */}
            <div>
              <p className="mb-3 text-xs font-medium text-slate-400">
                Akses operasional
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700">
                  <Check className="h-3.5 w-3.5 text-slate-500" />
                  Penjualan
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700">
                  <Check className="h-3.5 w-3.5 text-slate-500" />
                  Pantau gudang
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700">
                  <Check className="h-3.5 w-3.5 text-slate-500" />
                  Rekap insentif
                </span>
              </div>
            </div>

            {/* Info Box Administrator */}
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-500">
              <Info className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Perubahan jabatan dan hak akses dikelola oleh administrator.</span>
            </div>
          </div>
        </div>

        {/* ---------------- KOLOM KANAN (1/3 lebar) ---------------- */}
        <div className="space-y-6 lg:col-span-1">
          {/* CARD 4: KEAMANAN AKUN */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-[#111e33]">
                Keamanan akun
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Jaga akun dan data operasional tetap aman.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {/* Kata Sandi */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Kata sandi</p>
                    <p className="text-xs text-slate-400">Diubah 1 Oktober 2026</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="text-xs font-semibold text-[#1b2b44] hover:underline cursor-pointer"
                >
                  Ubah
                </button>
              </div>

              <div className="border-t border-slate-100" />

              {/* Verifikasi Dua Langkah */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Verifikasi dua langkah</p>
                    <p className="text-xs text-slate-400">Kode verifikasi melalui email</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
                  • Aktif
                </span>
              </div>

              <div className="border-t border-slate-100" />

              {/* Sesi Aktif */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Monitor className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Chrome di Windows</p>
                    <p className="text-xs text-slate-400">Jakarta, Indonesia • Sesi ini</p>
                  </div>
                </div>
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" title="Aktif" />
              </div>
            </div>
          </div>

          {/* CARD 5: PREFERENSI */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-[#111e33]">
                Preferensi
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Sesuaikan notifikasi dan tampilan aplikasi.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {/* Notifikasi Order */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Notifikasi order</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Pembaruan penjualan dan status gudang.
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <Toggle checked={notifOrder} onChange={setNotifOrder} />
                </div>
              </div>

              {/* Pengingat Operasional */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pengingat operasional</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Tenggat pengiriman dan tindak lanjut retur.
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <Toggle checked={notifOperasional} onChange={setNotifOperasional} />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Bahasa</span>
                  <span className="font-semibold text-slate-800">Bahasa Indonesia</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Zona waktu</span>
                  <span className="font-semibold text-slate-800">WIB (UTC+7)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CARD 6: AKTIVITAS TERAKHIR (Full Width)
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#111e33]">
              Aktivitas terakhir
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Riwayat aktivitas operasional dan perubahan akun Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('Daftar riwayat log aktivitas lengkap akan segera tersedia.')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b2b44] hover:underline cursor-pointer"
          >
            <span>Lihat semua aktivitas</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Aktivitas 1: Sales Order */}
          <div className="flex items-center justify-between py-3.5 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111e33]">Mengonfirmasi sales order</p>
                <p className="text-xs text-slate-400 mt-0.5">SO-2026-004 • CV Makmur Sejahtera</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 shrink-0">16 Okt 2026, 13:48 WIB</span>
          </div>

          {/* Aktivitas 2: Update No Telp */}
          <div className="flex items-center justify-between py-3.5 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111e33]">Memperbarui nomor telepon</p>
                <p className="text-xs text-slate-400 mt-0.5">Informasi pribadi diperbarui</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 shrink-0">15 Okt 2026, 09:15 WIB</span>
          </div>

          {/* Aktivitas 3: Ubah Password */}
          <div className="flex items-center justify-between py-3.5 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111e33]">Mengubah kata sandi</p>
                <p className="text-xs text-slate-400 mt-0.5">Keamanan akun diperbarui</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 shrink-0">1 Okt 2026, 08:30 WIB</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: EDIT PROFIL
         ========================================================================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-base font-bold text-[#111e33]">Edit Informasi Pribadi</h3>
                <p className="text-xs text-slate-400">Perbarui kontak dan data domisili Anda.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Domisili
                </label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1b2b44] px-5 py-2 text-xs font-bold text-white shadow-sm shadow-[#1b2b44]/20 hover:bg-[#111e33] transition-all cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: UBAH KATA SANDI
         ========================================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-base font-bold text-[#111e33]">Ubah Kata Sandi</h3>
                <p className="text-xs text-slate-400">Masukkan kata sandi lama dan baru.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordNotice('')
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {passwordNotice && (
              <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-xs font-semibold text-red-600 border border-red-200">
                {passwordNotice}
              </div>
            )}

            <form onSubmit={handleSavePassword} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Lama
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#1b2b44] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/10 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordNotice('')
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1b2b44] px-5 py-2 text-xs font-bold text-white shadow-sm shadow-[#1b2b44]/20 hover:bg-[#111e33] transition-all cursor-pointer"
                >
                  Simpan Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
