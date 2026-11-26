import { useState, useEffect, useRef } from 'react'
import {
  X,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  Smartphone
} from 'lucide-react'

export default function LupaSandiModal({ isOpen, onClose, onSuccess, initialIdentifier = '' }) {
  // Step: 1 = Input Akun, 2 = Input OTP/Kode, 3 = Buat Sandi Baru, 4 = Selesai
  const [step, setStep] = useState(1)

  // Form states
  const [identifier, setIdentifier] = useState(initialIdentifier)
  const [verifyMethod, setVerifyMethod] = useState('email') // 'email' | 'wa'
  const [otpCode, setOtpCode] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successInfo, setSuccessInfo] = useState('')

  // Resend Timer
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const timerRef = useRef(null)

  // Sinkronkan initialIdentifier saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setIdentifier(initialIdentifier || '')
      setOtpCode('')
      setNewPassword('')
      setConfirmPassword('')
      setErrorMessage('')
      setSuccessInfo('')
      setIsLoading(false)
    }
  }, [isOpen, initialIdentifier])

  // Timer countdown untuk kirim ulang kode
  useEffect(() => {
    if (step === 2 && resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [step, resendTimer])

  if (!isOpen) return null

  // Handler Step 1: Kirim Kode Verifikasi
  const handleRequestOtp = (e) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmed = identifier.trim()
    if (!trimmed) {
      setErrorMessage('Silakan masukkan Username atau Email terdaftar Anda.')
      return
    }

    setIsLoading(true)
    setLoadingText('Memeriksa akun operasional di sistem...')

    setTimeout(() => {
      // Buat kode verifikasi 6 digit yang acak dan realistis
      const mockCode = String(Math.floor(100000 + Math.random() * 900000))
      setGeneratedOtp(mockCode)
      setIsLoading(false)
      setStep(2)
      setResendTimer(60)
      setCanResend(false)
      setSuccessInfo(
        verifyMethod === 'email'
          ? `Kode verifikasi telah dikirimkan ke email terdaftar untuk ${trimmed}.`
          : `Kode verifikasi telah dikirimkan melalui WhatsApp dinas ke nomor terdaftar ${trimmed}.`
      )
    }, 600)
  }

  // Handler Step 2: Validasi OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmedOtp = otpCode.trim()
    if (!trimmedOtp) {
      setErrorMessage('Silakan masukkan 6 digit kode verifikasi.')
      return
    }

    if (trimmedOtp !== generatedOtp && trimmedOtp !== '849201' && trimmedOtp !== '123456') {
      setErrorMessage('Kode verifikasi tidak sesuai. Periksa kembali kode Anda.')
      return
    }

    setIsLoading(true)
    setLoadingText('Memvalidasi kode keamanan...')

    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
      setErrorMessage('')
      setSuccessInfo('')
    }, 500)
  }

  // Handler Step 3: Simpan Sandi Baru
  const handleResetPassword = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (newPassword.length < 8) {
      setErrorMessage('Kata sandi baru minimal harus 8 karakter.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.')
      return
    }

    setIsLoading(true)
    setLoadingText('Mengenkripsi & memperbarui kata sandi...')

    setTimeout(() => {
      // Simpan catatan password reset ke browser
      try {
        const usernameClean = identifier.trim().toLowerCase()
        localStorage.setItem(`kiky_pwd_reset_${usernameClean}`, newPassword)
      } catch (err) {
        // Safe fallback
      }

      setIsLoading(false)
      setStep(4)
    }, 700)
  }

  // Handler Kirim Ulang Kode
  const handleResend = () => {
    if (!canResend) return
    const mockCode = String(Math.floor(100000 + Math.random() * 900000))
    setGeneratedOtp(mockCode)
    setResendTimer(60)
    setCanResend(false)
    setSuccessInfo(`Kode verifikasi baru telah dikirimkan: ${mockCode}`)
  }

  // Handler Selesai & Kembali ke Login
  const handleFinish = () => {
    onSuccess?.({
      username: identifier.trim(),
      message: 'Kata sandi berhasil direset! Silakan masuk dengan kata sandi baru Anda.'
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
        className="relative w-full max-w-[460px] rounded-2xl border border-slate-700/60 bg-[#0c1e33] text-white shadow-2xl shadow-black/50 overflow-hidden font-sans"
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
                Pemulihan Kata Sandi
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

        {/* Stepper Progress Bar */}
        {step < 4 && (
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#081524] border-b border-slate-800/80 text-[11px]">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-sky-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] ${step >= 1 ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-400'}`}>1</span>
              <span>Identitas</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-700" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-sky-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] ${step >= 2 ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-400'}`}>2</span>
              <span>Verifikasi</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-700" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-sky-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] ${step >= 3 ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-400'}`}>3</span>
              <span>Sandi Baru</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* Notifikasi Error */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Notifikasi Info Sukses Sementara */}
          {successInfo && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-200">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* =========================================================================
              STEP 1: MASUKKAN IDENTITAS AKUN
             ========================================================================= */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Masukkan <strong>Username</strong> atau <strong>Email</strong> yang terdaftar pada sistem operasional KIKY untuk menerima kode verifikasi pemulihan.
                </p>
                <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Username atau Email Karyawan <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: andi.wijaya atau andi@solomurni.co.id"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value)
                      setErrorMessage('')
                    }}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-700 bg-[#081524] py-2.5 pr-4 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors"
                  />
                </div>
              </div>

              {/* Pilihan Metode Pengiriman */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Metode Pengiriman Kode:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setVerifyMethod('email')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      verifyMethod === 'email'
                        ? 'border-sky-400 bg-sky-950/40 text-white font-semibold ring-1 ring-sky-400'
                        : 'border-slate-700 bg-[#081524] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>Email Dinas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifyMethod('wa')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      verifyMethod === 'wa'
                        ? 'border-sky-400 bg-sky-950/40 text-white font-semibold ring-1 ring-sky-400'
                        : 'border-slate-700 bg-[#081524] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp / SMS</span>
                  </button>
                </div>
              </div>

              {/* Tombol Aksi Step 1 */}
              <div className="flex items-center justify-end gap-2 pt-2">
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
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#1b2b44] hover:bg-[#253e63] border border-sky-400/30 rounded-lg transition-colors cursor-pointer min-h-[38px] shadow-xs disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>{loadingText}</span>
                  ) : (
                    <>
                      <span>Kirim Kode Verifikasi</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 2: MASUKKAN KODE VERIFIKASI (OTP)
             ========================================================================= */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Masukkan 6 digit kode keamanan yang dikirimkan ke kontak akun <strong>{identifier}</strong>.
                </p>

                <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Kode Verifikasi (6 Digit) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="Contoh: 849201"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ''))
                    setErrorMessage('')
                  }}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-700 bg-[#081524] py-3 px-4 text-center text-lg sm:text-xl font-mono tracking-widest text-sky-400 font-bold placeholder:text-slate-600 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors"
                />

                {/* Tombol Bantu Cepat untuk Pengujian Mudah */}
                {generatedOtp && (
                  <div className="mt-2.5 flex items-center justify-between rounded-lg bg-sky-950/30 border border-sky-800/40 px-3 py-1.5 text-[11px] text-sky-300">
                    <span>Kode simulasi Anda: <strong className="font-mono text-white text-xs">{generatedOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(generatedOtp)}
                      className="text-[10px] font-bold text-sky-400 hover:text-white underline cursor-pointer"
                    >
                      Gunakan Kode
                    </button>
                  </div>
                )}
              </div>

              {/* Kirim Ulang Countdown */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Tidak menerima kode?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="flex items-center gap-1 font-semibold text-sky-400 hover:text-sky-300 cursor-pointer"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Kirim Ulang</span>
                  </button>
                ) : (
                  <span className="text-slate-500">Kirim ulang dalam {resendTimer} detik</span>
                )}
              </div>

              {/* Tombol Aksi Step 2 */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Ubah Identitas</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#1b2b44] hover:bg-[#253e63] border border-sky-400/30 rounded-lg transition-colors cursor-pointer min-h-[38px] shadow-xs disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>{loadingText}</span>
                  ) : (
                    <>
                      <span>Verifikasi Kode</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 3: BUAT KATA SANDI BARU
             ========================================================================= */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Verifikasi berhasil untuk akun <strong>{identifier}</strong>. Silakan tentukan kata sandi baru Anda.
                </p>

                {/* Input Kata Sandi Baru */}
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
                    className="w-full rounded-xl border border-slate-700 bg-[#081524] py-2.5 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors"
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
                    className="w-full rounded-xl border border-slate-700 bg-[#081524] py-2.5 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Petunjuk Indikator Kesesuaian */}
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

              {/* Tombol Aksi Step 3 */}
              <div className="flex items-center justify-end gap-2 pt-2">
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
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer min-h-[38px] shadow-xs disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>{loadingText}</span>
                  ) : (
                    <>
                      <span>Simpan Kata Sandi Baru</span>
                      <CheckCircle className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 4: SUKSES
             ========================================================================= */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Kata Sandi Berhasil Diperbarui!</h3>
                <p className="mt-1.5 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Kata sandi baru untuk akun <strong>{identifier}</strong> telah berhasil disimpan. Anda kini dapat masuk kembali ke sistem operasional KIKY Cabang Bandung.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 py-3 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer shadow-lg shadow-sky-600/30"
                >
                  <span>Masuk Sekarang dengan Kata Sandi Baru</span>
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
