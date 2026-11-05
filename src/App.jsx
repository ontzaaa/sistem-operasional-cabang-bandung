import { useState } from 'react';
import { authService } from './api/auth';
import api from './api/axios';

function App() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);

  // Form State Registrasi Pengguna Baru
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    email: '',
    password: '',
    divisi: 'penjualan',
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Fungsi Cek Koneksi ke Laravel
  const handleCheckConnection = async () => {
    setLoadingCheck(true);
    setConnectionStatus(null);
    try {
      // Mencoba request ke endpoint Laravel
      await api.get('/');
      setConnectionStatus({
        success: true,
        message: 'Koneksi ke backend Laravel berhasil terhubung!',
      });
    } catch (err) {
      if (err.response) {
        // Backend merespons (misal 404 atau 405), tandanya server hidup
        setConnectionStatus({
          success: true,
          message: `Server Laravel aktif (Status HTTP: ${err.response.status})`,
        });
      } else {
        // Network error (server Laravel belum dijalankan)
        setConnectionStatus({
          success: false,
          message: 'Gagal terhubung ke Laravel. Pastikan "php artisan serve" sudah dijalankan di port 8000.',
        });
      }
    } finally {
      setLoadingCheck(false);
    }
  };

  // Input Handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Registrasi ke API Laravel
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setApiResponse(null);

    try {
      const data = await authService.register(formData);
      setApiResponse({
        success: true,
        data: data,
      });
    } catch (err) {
      setApiResponse({
        success: false,
        data: err.response?.data || { message: err.message },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              SM
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                PT SOLO MURNI
              </h1>
              <p className="text-xs text-slate-500">
                Sistem Operasional Cabang Bandung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Tailwind CSS Active
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
              React + Vite
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Status Koneksi Backend Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Koneksi Backend Laravel
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Target Endpoint: <code className="bg-slate-100 text-indigo-600 px-2 py-0.5 rounded font-mono text-xs">{import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}</code>
              </p>
            </div>
            <button
              onClick={handleCheckConnection}
              disabled={loadingCheck}
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              {loadingCheck ? 'Memeriksa...' : 'Cek Koneksi Laravel'}
            </button>
          </div>

          {connectionStatus && (
            <div
              className={`mt-4 p-4 rounded-lg text-sm flex items-start gap-3 ${
                connectionStatus.success
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <div className="font-medium">
                {connectionStatus.success ? '✅ Berhasil:' : '⚠️ Catatan:'} {connectionStatus.message}
              </div>
            </div>
          )}
        </div>

        {/* Form Registrasi / Test API Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Uji Coba Registrasi Akun (POST /api/register)
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Mengirim data pengguna baru ke controller Laravel dengan pembagian divisi.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  required
                  placeholder="Contoh: Riezka Pratama"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="riezkya"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                    Divisi
                  </label>
                  <select
                    name="divisi"
                    value={formData.divisi}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition"
                  >
                    <option value="penjualan">Penjualan (Sales)</option>
                    <option value="gudang">Gudang (Warehouse)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="user@solomurni.co.id"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm rounded-lg shadow-sm transition duration-150 cursor-pointer"
                >
                  {submitLoading ? 'Mengirim Data...' : 'Kirim Registrasi ke Backend'}
                </button>
              </div>
            </form>
          </div>

          {/* Kolom Kanan: Response Viewer */}
          <div className="lg:col-span-5 bg-slate-900 rounded-xl p-6 text-slate-100 flex flex-col shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider uppercase">
                Respon API Backend
              </span>
              {apiResponse && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono ${
                    apiResponse.success
                      ? 'bg-emerald-900 text-emerald-300'
                      : 'bg-rose-900 text-rose-300'
                  }`}
                >
                  {apiResponse.success ? '201 Created' : 'Error'}
                </span>
              )}
            </div>

            <div className="flex-1 mt-4 font-mono text-xs overflow-x-auto bg-slate-950 p-4 rounded-lg border border-slate-800 text-emerald-400">
              {apiResponse ? (
                <pre>{JSON.stringify(apiResponse.data, null, 2)}</pre>
              ) : (
                <p className="text-slate-500 italic">
                  Belum ada request yang dikirim. Isi form di sebelah kiri lalu klik "Kirim Registrasi".
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
              💡 Pastikan backend Laravel sedang berjalan dengan perintah:
              <code className="block mt-1 bg-slate-800 text-indigo-300 px-2.5 py-1.5 rounded font-mono">
                php artisan serve
              </code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        © 2026 PT Solo Murni - Sistem Operasional Cabang Bandung
      </footer>
    </div>
  );
}

export default App;
