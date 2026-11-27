import { useState, useEffect } from 'react'
import {
  X,
  User,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export default function LupaSandiModal({ isOpen, onClose, onSuccess, initialIdentifier = '' }) {
  const [username, setUsername] = useState(initialIdentifier)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Reset state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setUsername(initialIdentifier || '')
      setNewPassword('')
      setConfirmPassword('')
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setErrorMessage('')
      setIsSuccess(false)
      setIsLoading(false)
    }
  }, [isOpen, initialIdentifier])

  if (!isOpen) return null

  const handleResetDirect = (e) => {
    e.preventDefault()
    setErrorMessage('')

    const cleanUsername = username.trim()
    if (!cleanUsername) {
      setErrorMessage('Silakan masukkan Username atau Email akun Anda.')
      return
    }

    if (newPassword.length < 8) {
      setErrorMessage('Kata sandi baru minimal harus 8 karakter.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      // Simpan pembaruan kata sandi ke penyimpanan browser
      try {
        localStorage.setItem(`kiky_pwd_reset_${cleanUsername.toLowerCase()}`, newPassword)
      } catch (err) {
        // Safe fallback
      }

      setIsLoading(false)
      setIsSuccess(true)
    }, 450)
  }

  const handleFinish = () => {
    onSuccess?.({
      username: username.trim(),
      message: `Kata sandi untuk akun "${username.trim()}" berhasil direset! Silakan masuk dengan kata sandi baru.`
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 backdrop-blur-[3px] p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose()
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[440px] rounded-2xl border border-slate-700/60 bg-[#0c1e33] text-white shadow-2xl shadow-black/50 overflow-hidden font-sans"
      >
        {/* Accent Bar Atas */}
        <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-sky-400 to-[#1b2b44]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20">
              <KeyRound className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Reset Kata Sandi
              </h2>
              <p className="text-[11px] text-slate-400">PT Solo Murni • Cabang Bandung</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Notifikasi Error */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleResetDirect} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Masukkan <strong>Username</strong> akun Anda, lalu tentukan <strong>kata sandi baru</strong> secara langsung tanpa perlu kode verifikasi.
              </p>

              {/* Input Username */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Username Akun <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan username Anda"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setErrorMessage('')
                    }}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-700 bg-[#081524] py-2.5 pr-4 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Input Kata Sandi Baru */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Kata Sandi Baru <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setErrorMessage('')
                    }}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-700 bg-[#081524] py-2.5 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Input Konfirmasi Kata Sandi */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Ulangi kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setErrorMessage('')
                    }}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-700 bg-[#081524] py-2.5 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Indikator Validasi Sandi */}
                <div className="mt-2 space-y-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>Panjang minimal 8 karakter ({newPassword.length}/8)</span>
                  </div>
                  {confirmPassword && (
                    <div className={`flex items-center gap-1.5 ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <CheckCircle className="h-3 w-3" />
                      <span>{newPassword === confirmPassword ? 'Konfirmasi kata sandi cocok' : 'Konfirmasi kata sandi belum cocok'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer min-h-[38px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#1b2b44] hover:bg-[#253e63] border border-sky-400/40 rounded-lg transition-colors cursor-pointer min-h-[38px] shadow-xs disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Memperbarui sandi...</span>
                  ) : (
                    <>
                      <span>Reset Kata Sandi</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Tampilan Sukses */
            <div className="text-center py-3 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Kata Sandi Berhasil Direset!</h3>
                <p className="mt-1.5 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Kata sandi baru untuk akun <strong>{username}</strong> telah tersimpan. Silakan masuk kembali dengan kata sandi baru Anda.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 py-3 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer shadow-lg shadow-sky-600/30"
                >
                  <span>Masuk Sekarang dengan Sandi Baru</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}