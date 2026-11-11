import { useState } from 'react'
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Store,
  Package,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  UserCheck
} from 'lucide-react'
import bgWarehouse from '../../assets/Images/background.jpeg'
import logoKiky from '../../assets/Images/logo tulisan kiky.png'

export default function Register({ onNavigateToLogin, onSwitchToLogin }) {
  // Dukung prop onNavigateToLogin maupun onSwitchToLogin
  const handleSwitchToLogin = onNavigateToLogin || onSwitchToLogin

  const [selectedDivision, setSelectedDivision] = useState('penjualan')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    domicile: '',
    position: '',
    branch: '',
    directSupervisor: '',
    password: '',
    confirmPassword: ''
  })

  const [isValidating, setIsValidating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const divisions = [
    { id: 'penjualan', label: 'Penjualan', icon: Store },
    { id: 'gudang', label: 'Gudang', icon: Package },
    { id: 'admin', label: 'Admin', icon: ShieldCheck }
  ]

  const activeDivisionLabel = divisions.find((d) => d.id === selectedDivision)?.label || 'Penjualan'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!agreed) {
      setErrorMessage('Silakan setujui Syarat & Ketentuan serta Kebijakan Privasi Kiky Stationery.')
      return
    }

    if (formData.password.length < 8) {
      setErrorMessage('Kata sandi minimal 8 karakter.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi!')
      return
    }

    setIsValidating(true)

    // Siapkan payload sesuai dengan API Laravel AuthController
    const username = formData.email.split('@')[0] || formData.fullName.toLowerCase().replace(/\s+/g, '')
    const payload = {
      nama_lengkap: formData.fullName,
      username: username,
      email: formData.email,
      nomor_telepon: formData.phone,
      domisili: formData.domicile,
      jabatan: formData.position,
      cabang: formData.branch,
      atasan_langsung: formData.directSupervisor,
      password: formData.password,
      divisi: selectedDivision
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok && data.status) {
        setSuccessMessage('Pendaftaran akun berhasil! Mengarahkan ke halaman login...')
        setTimeout(() => {
          if (handleSwitchToLogin) {
            handleSwitchToLogin({
              email: formData.email,
              username: username,
              division: selectedDivision,
              message: `Akun ${formData.fullName} (${activeDivisionLabel}) berhasil didaftarkan. Silakan login.`
            })
          }
        }, 1200)
      } else {
        // Tampilkan pesan error dari Laravel
        let errMsg = data.message || 'Registrasi gagal. Silakan periksa kembali data Anda.'
        if (data.errors) {
          const firstErr = Object.values(data.errors)[0]
          if (Array.isArray(firstErr)) errMsg = firstErr[0]
        }
        setErrorMessage(errMsg)
      }
    } catch (err) {
      // Jika server Laravel mati (offline simulation)
      console.warn('Backend Laravel offline, beralih ke simulasi:', err)
      setSuccessMessage('Registrasi berhasil (Simulasi Mode). Mengarahkan ke login...')
      setTimeout(() => {
        if (handleSwitchToLogin) {
          handleSwitchToLogin({
            email: formData.email,
            username: username,
            division: selectedDivision,
            message: `Akun ${formData.fullName} (${activeDivisionLabel}) siap digunakan.`
          })
        }
      }, 1000)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full bg-white font-sans text-slate-800 antialiased selection:bg-[#0c3558] selection:text-white overflow-x-hidden">

      {/* Kolom Kiri: Form Registrasi (Kembali Rata Kiri Standar) */}
      <div className="relative flex w-full flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:w-1/2 lg:py-10 xl:px-20">
        <div className="relative z-10">
          {/* Header Logo KIKY */}
          <div className="mb-6 flex items-center">
            <div className="inline-flex items-center justify-center rounded-full border-[2px] border-slate-900 px-3.5 py-1 tracking-wider bg-white">
              <span className="text-xs font-black tracking-widest text-slate-900">KIKY</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0c2b48] sm:text-4xl">
              Daftar Akun Baru
            </h1>
            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Pilih divisi Anda dan lengkapi data untuk mengakses sistem Kiky Stationery.
            </p>
          </div>

          {/* Notifikasi Pesan Error / Sukses */}
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
              ⚠️ {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
              ✓ {successMessage}
            </div>
          )}

          {/* Form Registrasi */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Divisi Akses Section */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <label className="font-bold tracking-wider text-slate-700 uppercase text-[11px]">
                  DIVISI AKSES <span className="text-red-500">*</span>
                </label>
                <span className="font-medium text-[#9c6d3b]">
                  Divisi Terpilih: {activeDivisionLabel}
                </span>
              </div>

              {/* Segmented Control Buttons */}
              <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#ebecee] p-1.5">
                {divisions.map((div) => {
                  const Icon = div.icon
                  const isSelected = selectedDivision === div.id
                  return (
                    <button
                      key={div.id}
                      type="button"
                      disabled={isValidating}
                      onClick={() => setSelectedDivision(div.id)}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all duration-200 cursor-pointer ${isSelected
                          ? 'bg-white text-slate-900 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{div.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={isValidating}
                  placeholder="Masukkan Nama lengkap"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Perusahaan / Pribadi */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  disabled={isValidating}
                  placeholder="Masukkan Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Nomor Telepon & Domisili */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Domisili <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: Jakarta Barat"
                    value={formData.domicile}
                    onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Jabatan & Cabang */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: Staff Penjualan"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Cabang <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: Cabang Solo / Pusat"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Atasan Langsung */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                Atasan Langsung <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <UserCheck className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={isValidating}
                  placeholder="Masukkan nama atasan langsung"
                  value={formData.directSupervisor}
                  onChange={(e) => setFormData({ ...formData, directSupervisor: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Kata Sandi & Konfirmasi Sandi */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Kata Sandi */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    disabled={isValidating}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Sandi */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Konfirmasi Sandi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    disabled={isValidating}
                    placeholder="Ulangi kata sandi"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0c3558] focus:outline-none focus:ring-2 focus:ring-[#0c3558]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Syarat & Ketentuan */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                disabled={isValidating}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0c3558] focus:ring-[#0c3558] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                Saya menyetujui{' '}
                <span className="font-bold text-slate-900 hover:underline">
                  Syarat &amp; Ketentuan
                </span>{' '}
                serta{' '}
                <span className="font-bold text-slate-900 hover:underline">
                  Kebijakan Privasi
                </span>{' '}
                Kiky Stationery.
              </label>
            </div>

            {/* Tombol Submit Daftar Akun */}
            <button
              type="submit"
              disabled={isValidating}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c3558] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#0c3558]/25 transition-all duration-200 hover:bg-[#082640] hover:shadow-lg active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{isValidating ? 'Mendaftarkan Akun...' : 'Daftar Akun'}</span>
              {!isValidating && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-slate-600 relative z-10">
          Sudah memiliki akun?{' '}
          <button
            type="button"
            onClick={handleSwitchToLogin}
            disabled={isValidating}
            className="font-bold text-[#0c2b48] hover:underline cursor-pointer disabled:opacity-50"
          >
            Masuk Sekarang
          </button>
        </div>
      </div>

      {/* Kolom Kanan: Gambar Background Gudang & Tulisan KIKY Pas Posisi Tengah Layar */}
      <div className="relative hidden lg:block lg:w-1/2 min-h-screen overflow-hidden bg-slate-900">
        {/* Background Foto Gudang */}
        <img
          src={bgWarehouse}
          alt="Gudang Kiky Stationery"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient Overlay Gelap */}
        <div className="absolute inset-0 bg-[#081e33]/60 bg-gradient-to-t from-[#051524]/80 via-[#081e33]/50 to-[#0c2a47]/40" />

        {/* Tulisan KIKY Pas Persis di Titik Tengah Layar Kanan */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 pointer-events-none">
          <img
            src={logoKiky}
            alt="KIKY Stationery"
            className="w-96 sm:w-[28rem] lg:w-[32rem] max-w-full h-auto object-contain drop-shadow-2xl select-none"
          />
        </div>
      </div>

      {/* Pop Up Loading Pendaftaran Akun */}
      {isValidating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="flex w-full max-w-[240px] flex-col items-center justify-center rounded-2xl bg-white px-6 py-6 shadow-xl border border-slate-100">
            <div className="h-8 w-8 rounded-full border-[3px] border-slate-200 border-t-[#0c3558] animate-spin" />
            <p className="mt-3.5 text-xs font-semibold text-slate-800">Mendaftarkan akun</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Mohon tunggu...</p>
          </div>
        </div>
      )}
    </div>
  )
}