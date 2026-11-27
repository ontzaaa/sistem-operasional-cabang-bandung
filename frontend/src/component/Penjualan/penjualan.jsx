import { useState, useMemo, useRef, useEffect } from 'react';
import {
  PanelLeft,
  ChevronRight,
  Download,
  Plus,
  Calendar,
  ChevronDown,
  Wallet,
  Files,
  ClipboardList,
  RotateCcw,
  ArrowUpDown,
  Search,
  ChevronLeft,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  X
} from 'lucide-react';
import { readExcelFile, exportToExcel } from '../../utils/excelHelper';

// Fungsi bantu format tanggal otomatis (ISO YYYY-MM-DD, Bulan, & Detail Tanggal)
const getFormattedDateInfo = (dateInput = new Date()) => {
  let dateObj;
  if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split('-').map(Number);
    dateObj = new Date(y, m - 1, d);
  } else {
    dateObj = new Date(dateInput);
  }

  if (Number.isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const isoDate = `${yyyy}-${mm}-${dd}`;

  const rawMonth = dateObj.toLocaleDateString('id-ID', { month: 'long' });
  const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
  const detailDate = dateObj.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return { isoDate, month, detailDate };
};

// Badge warna status penjualan
function OrderStatusBadge({ status }) {
  const normalized = status || 'Pending';

  const badgeStyle =
    normalized === 'Dikonfirmasi'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : normalized === 'Retur'
      ? 'bg-purple-50 text-purple-700 border-purple-200'
      : normalized === 'Dibatalkan'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  const dotStyle =
    normalized === 'Dikonfirmasi'
      ? 'bg-emerald-500'
      : normalized === 'Retur'
      ? 'bg-purple-500'
      : normalized === 'Dibatalkan'
      ? 'bg-rose-500'
      : 'bg-amber-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${badgeStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      {normalized}
    </span>
  );
}

// Komponen Kalender Pop-up (Pilih Tanggal, Bulan, & Tahun)
function CalendarFilterPopover({
  selectedDate,
  onSelectDate,
  onClearDate,
  orders = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const initialDate = useMemo(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  }, [selectedDate]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0 - 11

  useEffect(() => {
    setViewYear(initialDate.getFullYear());
    setViewMonth(initialDate.getMonth());
  }, [initialDate]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const yearOptions = useMemo(() => {
    const years = new Set([2024, 2025, 2026, 2027, new Date().getFullYear()]);
    orders.forEach((o) => {
      const match = String(o.detailDate || '').match(/\b(20\d{2})\b/);
      if (match) years.add(Number(match[1]));
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [orders]);

  // Set tanggal yang punya data order untuk penanda titik kecil di kalender
  const datesWithOrders = useMemo(() => {
    const setDates = new Set();
    orders.forEach((o) => {
      const info = getFormattedDateInfo(o.detailDate);
      if (o.detailDate) {
        setDates.add(info.isoDate);
      }
    });
    return setDates;
  }, [orders]);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Minggu
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mulai Senin
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const mm = String(viewMonth + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const iso = `${viewYear}-${mm}-${dd}`;
      cells.push({
        day,
        iso,
        hasOrder: datesWithOrders.has(iso),
      });
    }
    return cells;
  }, [startOffset, daysInMonth, viewYear, viewMonth, datesWithOrders]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const buttonLabel = selectedDate
    ? getFormattedDateInfo(selectedDate).detailDate
    : 'Pilih tanggal / kalender';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-between gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{buttonLabel}</span>
        </span>
        {selectedDate ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClearDate?.();
            }}
            title="Reset tanggal"
            className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-40 text-xs">
          {/* Header Pilihan Bulan & Tahun */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                {monthNames.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                {yearOptions.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nama Hari */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
            <span>Min</span>
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map((cell, index) => {
              if (!cell) {
                return <div key={`empty-${index}`} className="h-8" />;
              }

              const isSelected = selectedDate === cell.iso;
              const isToday = getFormattedDateInfo().isoDate === cell.iso;

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => {
                    onSelectDate?.(cell.iso);
                    setIsOpen(false);
                  }}
                  className={`relative h-8 rounded-lg flex flex-col items-center justify-center text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B2A4A] text-white font-bold shadow-2xs'
                      : isToday
                      ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cell.day}</span>
                  {cell.hasOrder && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        isSelected ? 'bg-white' : 'bg-[#1B2A4A]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Kalender */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const todayIso = getFormattedDateInfo().isoDate;
                const d = new Date();
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
                onSelectDate?.(todayIso);
                setIsOpen(false);
              }}
              className="font-semibold text-[#1B2A4A] hover:underline cursor-pointer"
            >
              Hari ini
            </button>

            <button
              type="button"
              onClick={() => {
                onClearDate?.();
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Tampilkan semua
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Data awal penjualan: kolom Item No., Item Desc., Quantity, dan Carton default-nya KOSONG (belum ada isinya)
const defaultOrders = [
  {
    id: 'SO-2026-005',
    customerId: 'CUST-005',
    customer: 'Toko Harapan Baru',
    city: 'Surabaya',
    invoice: 'INV-2026-005',
    month: 'Oktober',
    detailDate: '16 Okt 2026',
    salesman: 'Rina Kusuma',
    itemNo: '',
    itemDesc: '',
    quantity: '',
    carton: '',
    status: 'Pending',
  },
  {
    id: 'SO-2026-004',
    customerId: 'CUST-004',
    customer: 'CV Makmur Sejahtera',
    city: 'Sidoarjo',
    invoice: 'INV-2026-004',
    month: 'Oktober',
    detailDate: '15 Okt 2026',
    salesman: 'Andi Wijaya',
    itemNo: '',
    itemDesc: '',
    quantity: '',
    carton: '',
    status: 'Dikonfirmasi',
  },
  {
    id: 'SO-2026-003',
    customerId: 'CUST-003',
    customer: 'Toko Sumber Rezeki',
    city: 'Gresik',
    invoice: 'INV-2026-003',
    month: 'Oktober',
    detailDate: '14 Okt 2026',
    salesman: 'Doni Prasetyo',
    itemNo: '',
    itemDesc: '',
    quantity: '',
    carton: '',
    status: 'Retur',
  },
  {
    id: 'SO-2026-002',
    customerId: 'CUST-002',
    customer: 'UD Berkah Abadi',
    city: 'Surabaya',
    invoice: 'INV-2026-002',
    month: 'Oktober',
    detailDate: '13 Okt 2026',
    salesman: 'Rina Kusuma',
    itemNo: '',
    itemDesc: '',
    quantity: '',
    carton: '',
    status: 'Pending',
  },
  {
    id: 'SO-2026-001',
    customerId: 'CUST-001',
    customer: 'Toko Maju Jaya',
    city: 'Mojokerto',
    invoice: 'INV-2026-001',
    month: 'Oktober',
    detailDate: '12 Okt 2026',
    salesman: 'Andi Wijaya',
    itemNo: '',
    itemDesc: '',
    quantity: '',
    carton: '',
    status: 'Dikonfirmasi',
  },
];

const tabs = [
  { label: 'Semua penjualan', count: 48 },
  { label: 'Pending', count: 12 },
  { label: 'Dikonfirmasi', count: 32 },
  { label: 'Retur', count: 3 },
  { label: 'Dibatalkan', count: 1 },
];

export default function PenjualanPage({
  user = { name: 'Andi Wijaya', role: 'Penjualan' },
  onBack,
}) {
  const normalizedRole = String(user?.role || '').trim().toLowerCase();
  const isWarehouseViewer = normalizedRole === 'gudang';
  const canEditSales = !isWarehouseViewer;

  const [orders, setOrders] = useState(defaultOrders);
  const [activeTab, setActiveTab] = useState('Semua penjualan');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [isImporting, setIsImporting] = useState(false);
  const [importNotification, setImportNotification] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal Buat Sales Order Baru
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState(() => {
    const { isoDate, month, detailDate } = getFormattedDateInfo();
    return {
      customerId: '',
      customer: '',
      city: 'Bandung',
      invoice: '',
      rawDate: isoDate,
      month,
      detailDate,
      salesman: user?.name || 'Andi Wijaya',
      itemNo: '',
      itemDesc: '',
      quantity: '',
      carton: '',
      status: 'Pending',
    };
  });

  const fileInputRef = useRef(null);

  // Label periode aktif berdasarkan tanggal kalender yang dipilih
  const activePeriodLabel = useMemo(() => {
    if (selectedDateFilter) {
      const { detailDate } = getFormattedDateInfo(selectedDateFilter);
      return `Tanggal ${detailDate}`;
    }
    const { detailDate } = getFormattedDateInfo();
    return `Semua Periode (s/d ${detailDate})`;
  }, [selectedDateFilter]);

  // Fungsi menerapkan data barang hasil import Excel ke Penjualan
  const applyImportedItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;

    const todayInfo = getFormattedDateInfo();

    const mapped = items.map((row, idx) => {
      const getVal = (...keys) => {
        for (const k of keys) {
          for (const rowKey of Object.keys(row)) {
            if (rowKey.trim().toLowerCase() === k.toLowerCase()) {
              const v = row[rowKey];
              return typeof v === 'string' ? v.trim() : v;
            }
          }
        }
        return '';
      };

      const itemNo = String(
        getVal('Item No.', 'Item No', 'itemNo', 'KODE', 'Kode Barang', 'Kode', 'Kd Induk', 'KDINDUK') ||
        row.kode ||
        `BRG-${idx + 1}`
      ).trim();

      const itemDesc = String(
        getVal('Item Desc.', 'Item Desc', 'itemDesc', 'NAMA', 'Nama Barang', 'Deskripsi') ||
        row.nama ||
        ''
      ).trim();

      const sampleCust = defaultOrders[idx % defaultOrders.length];

      const customerId = String(
        getVal('Customer Id', 'Customer ID', 'CustomerId', 'ID Pelanggan', 'Cust Id', 'Cust ID') ||
        sampleCust?.customerId ||
        `CUST-${String(idx + 1).padStart(3, '0')}`
      ).trim();

      const customerName = String(
        getVal('Customer Name', 'Customer', 'Nama Pelanggan', 'Toko', 'Pelanggan') ||
        sampleCust?.customer ||
        'Cabang Bandung'
      ).trim();

      const city = String(
        getVal('Kota', 'City', 'Kabupaten', 'Lokasi') ||
        sampleCust?.city ||
        'Bandung'
      ).trim();

      const invoice = String(
        getVal('Invoice', 'No. Invoice', 'No Invoice', 'No. SO', 'SO', 'No') ||
        `SO-2026-${String(idx + 1).padStart(3, '0')}`
      ).trim();

      const month = String(
        getVal('Month', 'Bulan') ||
        todayInfo.month
      ).trim();

      const detailDate = String(
        getVal('Detail Date', 'Date', 'Tanggal', 'Tgl') ||
        todayInfo.detailDate
      ).trim();

      const salesman = String(
        getVal('Salesman', 'Salesperson', 'Sales', 'Nama Sales') ||
        sampleCust?.salesman ||
        (idx % 2 === 0 ? 'Andi Wijaya' : 'Rina Kusuma')
      ).trim();

      const rawQty = getVal('Quantity', 'Qty', 'JUMLAH', 'Jumlah', 'Jumlah Box');
      const quantity =
        rawQty !== '' && !isNaN(Number(rawQty)) && Number(rawQty) > 0
          ? Math.round(Number(rawQty))
          : row.jumlah && Number(row.jumlah) > 0
          ? Number(row.jumlah)
          : 100;

      const rawCarton = getVal('Carton', 'BOX', 'Box', 'Karton');
      const carton =
        rawCarton !== '' && !isNaN(Number(rawCarton)) && Number(rawCarton) > 0
          ? Math.round(Number(rawCarton))
          : row.box && Number(row.box) > 0
          ? Number(row.box)
          : Math.max(1, Math.round(quantity / 10));

      const status = String(
        getVal('Status', 'Status Penjualan', 'Order Status') ||
        row.status ||
        sampleCust?.status ||
        'Pending'
      ).trim();

      return {
        id: invoice,
        customerId,
        customer: customerName,
        city,
        invoice,
        month,
        detailDate,
        salesman,
        itemNo,
        itemDesc,
        quantity,
        carton,
        status,
      };
    });

    setOrders(mapped);
    setCurrentPage(1);
  };

  // Sinkronisasi otomatis data barang jika user melakukan import di Gudang atau Penjualan
  useEffect(() => {
    const checkSyncedData = () => {
      try {
        const storedOrders = localStorage.getItem('kiky_excel_penjualan');
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed.map((item) => ({ ...item, status: item.status || 'Pending' })));
            return;
          }
        }
        const storedBarang = localStorage.getItem('kiky_master_barang');
        if (storedBarang) {
          const parsed = JSON.parse(storedBarang);
          if (Array.isArray(parsed) && parsed.length > 0) {
            applyImportedItems(parsed);
          }
        }
      } catch (err) {
        console.error('Gagal sinkron data Excel:', err);
      }
    };

    checkSyncedData();
    window.addEventListener('kiky-excel-imported', checkSyncedData);
    return () => window.removeEventListener('kiky-excel-imported', checkSyncedData);
  }, []);

  // Handler Import Excel untuk Penjualan
  const handleFileUpload = async (e) => {
    if (!canEditSales) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await readExcelFile(file);
      const todayInfo = getFormattedDateInfo();

      // Filter baris data yang valid (memiliki nama atau kode barang)
      const validRows = result.rows.filter((row) => {
        const getVal = (...keys) => {
          for (const k of keys) {
            for (const rowKey of Object.keys(row)) {
              if (rowKey.trim().toLowerCase() === k.toLowerCase()) {
                const v = row[rowKey];
                return typeof v === 'string' ? v.trim() : v;
              }
            }
          }
          return '';
        };

        const nama = String(getVal('NAMA', 'Nama Barang', 'Item Desc.', 'Item Desc', 'Deskripsi') || '').trim();
        const kode = String(getVal('KODE', 'Kode Barang', 'Item No.', 'Item No', 'Kode') || '').trim();

        if (kode.toUpperCase() === 'JUMLAH' || kode.toUpperCase() === 'SCHOOL') return false;
        return Boolean(nama || kode);
      });

      if (validRows.length === 0) {
        throw new Error('Tidak ada baris data barang yang valid dalam file Excel.');
      }

      // Mapping data Excel secara fleksibel ke kolom Penjualan
      const mappedOrders = validRows.map((row, idx) => {
        const getVal = (...keys) => {
          for (const k of keys) {
            for (const rowKey of Object.keys(row)) {
              if (rowKey.trim().toLowerCase() === k.toLowerCase()) {
                const v = row[rowKey];
                return typeof v === 'string' ? v.trim() : v;
              }
            }
          }
          return '';
        };

        const itemNo = String(
          getVal('Item No.', 'Item No', 'KODE', 'Kode Barang', 'Kode', 'Kd Induk', 'KDINDUK') ||
          `BRG-${idx + 1}`
        ).trim();

        const itemDesc = String(
          getVal('Item Desc.', 'Item Desc', 'NAMA', 'Nama Barang', 'Deskripsi') ||
          '-'
        ).trim();

        const sampleCust = defaultOrders[idx % defaultOrders.length];

        const customerId = String(
          getVal('Customer Id', 'Customer ID', 'CustomerId', 'ID Pelanggan', 'Cust Id', 'Cust ID') ||
          sampleCust?.customerId ||
          `CUST-${String(idx + 1).padStart(3, '0')}`
        ).trim();

        const customerName = String(
          getVal('Customer Name', 'Customer', 'Nama Pelanggan', 'Toko', 'Pelanggan') ||
          sampleCust?.customer ||
          'Cabang Bandung'
        ).trim();

        const city = String(
          getVal('Kota', 'City', 'Kabupaten', 'Lokasi') ||
          sampleCust?.city ||
          'Bandung'
        ).trim();

        const invoice = String(
          getVal('Invoice', 'No. Invoice', 'No Invoice', 'No. SO', 'SO', 'No') ||
          `SO-2026-${String(idx + 1).padStart(3, '0')}`
        ).trim();

        const month = String(
          getVal('Month', 'Bulan') ||
          todayInfo.month
        ).trim();

        const detailDate = String(
          getVal('Detail Date', 'Date', 'Tanggal', 'Tgl') ||
          todayInfo.detailDate
        ).trim();

        const salesman = String(
          getVal('Salesman', 'Salesperson', 'Sales', 'Nama Sales') ||
          sampleCust?.salesman ||
          (idx % 2 === 0 ? 'Andi Wijaya' : 'Rina Kusuma')
        ).trim();

        const rawQty = getVal('Quantity', 'Qty', 'JUMLAH', 'Jumlah', 'Jumlah Box');
        const quantity =
          rawQty !== '' && !isNaN(Number(rawQty)) && Number(rawQty) > 0
            ? Math.round(Number(rawQty))
            : (idx < 5 ? 100 : 10);

        const rawCarton = getVal('Carton', 'BOX', 'Box', 'Karton');
        const carton =
          rawCarton !== '' && !isNaN(Number(rawCarton)) && Number(rawCarton) > 0
            ? Math.round(Number(rawCarton))
            : Math.max(1, Math.round(quantity / 10));

        const status = String(
          getVal('Status', 'Status Penjualan', 'Order Status') ||
          sampleCust?.status ||
          'Pending'
        ).trim();

        return {
          id: invoice,
          customerId,
          customer: customerName,
          city,
          invoice,
          month,
          detailDate,
          salesman,
          itemNo,
          itemDesc,
          quantity,
          carton,
          status,
        };
      });

      setOrders(mappedOrders);
      setCurrentPage(1);

      // Simpan ke storage dan kirim event agar modul lain (Gudang) sinkron
      try {
        localStorage.setItem('kiky_excel_penjualan', JSON.stringify(mappedOrders));
        window.dispatchEvent(new CustomEvent('kiky-excel-imported', { detail: mappedOrders }));
      } catch (e) {
        console.error(e);
      }

      setImportNotification({
        type: 'success',
        message: `Berhasil mengimpor ${mappedOrders.length} data barang dari "${file.name}" ke penjualan!`,
      });
    } catch (err) {
      console.error('Error saat membaca Excel:', err);
      setImportNotification({
        type: 'error',
        message: err.message || 'Gagal membaca file Excel. Pastikan format file sesuai.',
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setImportNotification(null), 5000);
    }
  };

  // Buka dialog Buat Baru dan auto-generate nomor SO / Customer + tanggal otomatis
  const handleOpenCreateModal = () => {
    if (!canEditSales) return;
    const nextNum = orders.length + 1;
    const autoInvoice = `SO-2026-${String(nextNum).padStart(3, '0')}`;
    const autoCustId = `CUST-${String(nextNum).padStart(3, '0')}`;
    const { isoDate, month, detailDate } = getFormattedDateInfo();
    setNewOrderForm({
      customerId: autoCustId,
      customer: '',
      city: 'Bandung',
      invoice: autoInvoice,
      rawDate: isoDate,
      month,
      detailDate,
      salesman: user?.name || 'Andi Wijaya',
      itemNo: '',
      itemDesc: '',
      quantity: '',
      carton: '',
      status: 'Pending',
    });
    setIsCreateModalOpen(true);
  };

  // Simpan Sales Order Baru
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!canEditSales) return;
    if (!newOrderForm.customer.trim()) {
      alert('Nama pelanggan / customer wajib diisi!');
      return;
    }

    const qtyVal =
      newOrderForm.quantity !== '' && !isNaN(Number(newOrderForm.quantity))
        ? Number(newOrderForm.quantity)
        : '';
    const cartonVal =
      newOrderForm.carton !== '' && !isNaN(Number(newOrderForm.carton))
        ? Number(newOrderForm.carton)
        : qtyVal
        ? Math.max(1, Math.round(qtyVal / 10))
        : '';

    const todayInfo = getFormattedDateInfo(newOrderForm.rawDate || new Date());

    const createdOrder = {
      id: newOrderForm.invoice.trim() || `SO-2026-${Date.now().toString().slice(-4)}`,
      customerId: newOrderForm.customerId.trim() || `CUST-${String(orders.length + 1).padStart(3, '0')}`,
      customer: newOrderForm.customer.trim(),
      city: newOrderForm.city.trim() || 'Bandung',
      invoice: newOrderForm.invoice.trim() || `SO-2026-${Date.now().toString().slice(-4)}`,
      month: newOrderForm.month.trim() || todayInfo.month,
      detailDate: newOrderForm.detailDate.trim() || todayInfo.detailDate,
      salesman: newOrderForm.salesman.trim() || user?.name || 'Andi Wijaya',
      itemNo: newOrderForm.itemNo.trim(),
      itemDesc: newOrderForm.itemDesc.trim(),
      quantity: qtyVal,
      carton: cartonVal,
      status: newOrderForm.status || 'Pending',
    };

    const updated = [createdOrder, ...orders];
    setOrders(updated);
    setCurrentPage(1);
    setIsCreateModalOpen(false);

    try {
      localStorage.setItem('kiky_excel_penjualan', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kiky-excel-imported', { detail: updated }));
    } catch (err) {
      console.error(err);
    }

    setImportNotification({
      type: 'success',
      message: `Sales order "${createdOrder.invoice}" (${createdOrder.customer}) berhasil ditambahkan!`,
    });
    setTimeout(() => setImportNotification(null), 4000);
  };

  // Ubah status langsung dari baris tabel (hanya untuk divisi penjualan / non-gudang)
  const handleStatusChange = (invoice, nextStatus) => {
    if (!canEditSales) return;
    const updated = orders.map((item) =>
      item.invoice === invoice ? { ...item, status: nextStatus } : item
    );
    setOrders(updated);
    try {
      localStorage.setItem('kiky_excel_penjualan', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kiky-excel-imported', { detail: updated }));
    } catch (err) {
      console.error(err);
    }
  };

  // Ekspor Data ke Excel (.xlsx)
  const handleExportExcel = () => {
    if (!orders || orders.length === 0) {
      setImportNotification({
        type: 'error',
        message: 'Tidak ada data penjualan yang dapat diekspor.',
      });
      setTimeout(() => setImportNotification(null), 3000);
      return;
    }

    const targetData = filteredOrders.length > 0 ? filteredOrders : orders;

    const exportRows = targetData.map((o) => ({
      'Customer Id': o.customerId || '-',
      'Customer Name': o.customer || '-',
      'Kota': o.city || '-',
      'Invoice': o.invoice || '-',
      'Month': o.month || '-',
      'Detail Date': o.detailDate || '-',
      'Salesman': o.salesman || '-',
      'Item No.': o.itemNo || '-',
      'Item Desc.': o.itemDesc || '-',
      'Quantity': o.quantity !== '' && !isNaN(Number(o.quantity)) ? Number(o.quantity) : (o.quantity || '-'),
      'Carton': o.carton !== '' && !isNaN(Number(o.carton)) ? Number(o.carton) : (o.carton || '-'),
      'Status': o.status || 'Pending',
    }));

    const dateStr = getFormattedDateInfo().isoDate;
    const fileName = `Data_Penjualan_KIKY_${dateStr}.xlsx`;

    try {
      exportToExcel(exportRows, fileName, 'Penjualan KIKY');
      setImportNotification({
        type: 'success',
        message: `Berhasil mengekspor ${exportRows.length} data penjualan ke file "${fileName}"!`,
      });
    } catch (err) {
      console.error(err);
      setImportNotification({
        type: 'error',
        message: 'Gagal mengekspor file Excel: ' + (err.message || 'Terjadi kesalahan sistem'),
      });
    }
    setTimeout(() => setImportNotification(null), 4000);
  };

  // Filter & Urutkan Sales Order berdasarkan Tab Status, Pencarian, Tanggal Kalender, & Pembaruan terbaru
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const matched = orders.filter((order) => {
      const orderStatus = order.status || 'Pending';
      const matchesTab =
        activeTab === 'Semua penjualan' || orderStatus === activeTab;

      const matchesDate =
        !selectedDateFilter ||
        getFormattedDateInfo(order.detailDate).isoDate === selectedDateFilter;

      const matchesSearch =
        !q ||
        order.customerId.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q) ||
        order.invoice.toLowerCase().includes(q) ||
        order.month.toLowerCase().includes(q) ||
        order.detailDate.toLowerCase().includes(q) ||
        order.salesman.toLowerCase().includes(q) ||
        order.itemNo.toLowerCase().includes(q) ||
        order.itemDesc.toLowerCase().includes(q) ||
        orderStatus.toLowerCase().includes(q);

      return matchesTab && matchesDate && matchesSearch;
    });

    const sorted = [...matched];
    if (sortOrder === 'terlama') {
      return sorted.reverse();
    }
    if (sortOrder === 'qty_desc') {
      return sorted.sort((a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0));
    }
    if (sortOrder === 'customer_asc') {
      return sorted.sort((a, b) => a.customer.localeCompare(b.customer, 'id'));
    }
    return sorted;
  }, [orders, activeTab, searchQuery, selectedDateFilter, sortOrder]);

  // Paginasi
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 font-sans">
      {/* Input File Tersembunyi untuk Import Excel */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Kembali ke Dashboard"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Operasional
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-900">Penjualan</span>
        </div>

        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          Akses: {canEditSales ? 'Penjualan (Lihat & Ubah)' : 'Gudang (Hanya Lihat)'}
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
        {/* Notifikasi Hasil Import */}
        {importNotification && (
          <div
            className={`mb-5 p-3.5 sm:p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in duration-200 ${
              importNotification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : importNotification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{importNotification.message}</span>
            </div>
            <button
              onClick={() => setImportNotification(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Penjualan</h1>
            <p className="text-xs text-slate-500 mt-1">
              {canEditSales
                ? 'Data transaksi penjualan dan sales order cabang PT Solo Murni'
                : 'Mode lihat data penjualan untuk divisi gudang (perubahan data dinonaktifkan)'}
            </p>
          </div>

          {canEditSales && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tombol Import Excel */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-800 transition shadow-sm cursor-pointer disabled:opacity-60"
                title="Import data penjualan langsung dari file Excel (.xlsx, .xls, .csv)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isImporting ? 'Mengimpor...' : 'Import Excel'}</span>
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                title="Ekspor seluruh data penjualan ke file Excel (.xlsx)"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor</span>
              </button>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#1B2A4A] text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-[#142038] transition shadow-sm cursor-pointer"
                title="Tambah sales order baru"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Sub-header Filter Info dengan Kalender */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Penjualan:</span>
            <CalendarFilterPopover
              selectedDate={selectedDateFilter}
              onSelectDate={(iso) => {
                setSelectedDateFilter(iso);
                setCurrentPage(1);
              }}
              onClearDate={() => {
                setSelectedDateFilter('');
                setCurrentPage(1);
              }}
              orders={orders}
            />
          </div>
          <span className="text-slate-400">
            Total {filteredOrders.length} baris data terdaftar
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1 - Dark Navy */}
          <div className="bg-[#1B2A4A] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
                Nilai Penjualan
              </span>
              <Wallet className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <div className="text-2xl font-bold flex items-baseline gap-1">
                Rp184,25
                <span className="text-sm font-normal text-slate-300">juta</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                <p>{activePeriodLabel}</p>
                <p className="text-slate-300 font-medium mt-0.5">
                  + 12% vs periode sebelumnya
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 - Total Sales Order */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Total Sales Order
              </span>
              <Files className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1">
                {filteredOrders.length}
                <span className="text-sm font-normal text-slate-400">data</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px]">
                <p className="font-medium text-slate-700">Seluruh order terdata</p>
                <p className="text-slate-400 mt-0.5">Termasuk hasil import Excel</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Menunggu Konfirmasi */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Menunggu Konfirmasi
              </span>
              <ClipboardList className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1">
                12
                <span className="text-sm font-normal text-slate-400">order</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px]">
                <p className="font-medium text-slate-700">Perlu konfirmasi penjualan</p>
                <p className="text-slate-400 mt-0.5">Termasuk 2 order pantauan</p>
              </div>
            </div>
          </div>

          {/* Card 4 - Retur Penjualan */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Retur Penjualan
              </span>
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1">
                3
                <span className="text-sm font-normal text-slate-400">order</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px]">
                <p className="font-medium text-slate-700">Retur pada periode ini</p>
                <p className="text-slate-400 mt-0.5">1 order perlu pemeriksaan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card: Daftar Penjualan */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          {/* Card Top Title */}
          <div className="p-5 pb-0 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar penjualan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {filteredOrders.length} sales order terdaftar pada sistem
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Urutkan daftar penjualan"
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
              >
                <option value="terbaru">Pembaruan terbaru</option>
                <option value="terlama">Terlama dulu</option>
                <option value="qty_desc">Quantity terbesar</option>
                <option value="customer_asc">Customer A–Z</option>
              </select>
            </div>
          </div>

          {/* Tabs Filter Penjualan */}
          <div className="px-5 mt-5 border-b border-slate-200 flex items-center gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.label;
              const tabCount =
                tab.label === 'Semua penjualan'
                  ? orders.length
                  : orders.filter((o) => (o.status || 'Pending') === tab.label).length;

              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTab(tab.label);
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-xs font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-slate-900 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'bg-slate-100/70 text-slate-500'
                    }`}
                  >
                    {tabCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
            {/* Input Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari customer, kota, invoice, tanggal, salesman, kode barang..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tombol Cepat Import Excel (Hanya Divisi Penjualan) */}
            {canEditSales && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import File Excel</span>
              </button>
            )}

            {/* Filter Kalender (Tanggal, Bulan, Tahun) */}
            <CalendarFilterPopover
              selectedDate={selectedDateFilter}
              onSelectDate={(iso) => {
                setSelectedDateFilter(iso);
                setCurrentPage(1);
              }}
              onClearDate={() => {
                setSelectedDateFilter('');
                setCurrentPage(1);
              }}
              orders={orders}
            />

            {/* Filter Salesperson */}
            <button className="inline-flex items-center justify-between gap-4 px-3.5 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              Semua salesperson
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Filter Status Gudang */}
            <button className="inline-flex items-center justify-between gap-4 px-3.5 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              Semua status gudang
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* =========================================================================
              TABEL SALES ORDER (STATUS DI UJUNG KANAN)
              ========================================================================= */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-y border-slate-200/80 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  <th className="py-3 pl-5 pr-3 whitespace-nowrap">Customer Id</th>
                  <th className="py-3 px-3 whitespace-nowrap">Customer Name</th>
                  <th className="py-3 px-3 whitespace-nowrap">Kota</th>
                  <th className="py-3 px-3 whitespace-nowrap">Invoice</th>
                  <th className="py-3 px-3 whitespace-nowrap">Month</th>
                  <th className="py-3 px-3 whitespace-nowrap">Detail Date</th>
                  <th className="py-3 px-3 whitespace-nowrap">Salesman</th>
                  <th className="py-3 px-3 whitespace-nowrap">Item No.</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[200px]">Item Desc.</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Quantity</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Carton</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Pack</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Berat(KG)</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Sales Amount</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Item Price</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Item Price</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Disc.1</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Disc.2</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Disc.3</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Disc.4</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Item Category</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Type</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">ID</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Gudang</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Outlet</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">No PO</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Kelompok</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Induk</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Nama Induk</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Group Relasi</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Keterangan</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Nama Sales</th>
                  <th className="py-3 pl-3 pr-5 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, idx) => (
                    <tr
                      key={`${order.invoice}-${idx}`}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Customer Id */}
                      <td className="py-3.5 pl-5 pr-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {order.customerId}
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {order.customer}
                      </td>

                      {/* Kota */}
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {order.city}
                      </td>

                      {/* Invoice */}
                      <td className="py-3.5 px-3 font-mono text-slate-800 whitespace-nowrap">
                        {order.invoice}
                      </td>

                      {/* Month */}
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {order.month}
                      </td>

                      {/* Detail Date */}
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {order.detailDate}
                      </td>

                      {/* Salesman */}
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {order.salesman}
                      </td>

                      {/* Item No. */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {order.itemNo && order.itemNo !== '-' ? (
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                            {order.itemNo}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono text-xs">-</span>
                        )}
                      </td>

                      {/* Item Desc. */}
                      <td className="py-3.5 px-3">
                        {order.itemDesc && order.itemDesc !== '-' ? (
                          <span className="font-semibold text-slate-800">{order.itemDesc}</span>
                        ) : (
                          <span className="text-slate-400 text-xs italic font-normal">
                            Kosong (belum ada isinya)
                          </span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                        {order.quantity && order.quantity !== '-' && Number(order.quantity) > 0 ? (
                          Number(order.quantity).toLocaleString('id-ID')
                        ) : (
                          <span className="text-slate-300 text-xs font-normal">-</span>
                        )}
                      </td>

                      {/* Carton */}
                      <td className="py-3.5 px-3 text-right font-bold text-indigo-700 whitespace-nowrap">
                        {order.carton && order.carton !== '-' && Number(order.carton) > 0 ? (
                          Number(order.carton).toLocaleString('id-ID')
                        ) : (
                          <span className="text-slate-300 text-xs font-normal">-</span>
                        )}
                      </td>

                      {/* Kolom tambahan agar sejajar dengan header */}
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-300 whitespace-nowrap">-</td>
                      <td className="py-3.5 px-3 text-right text-slate-600 whitespace-nowrap">
                        {order.salesman}
                      </td>

                      {/* Status di paling ujung kanan */}
                      <td className="py-3.5 pl-3 pr-5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <OrderStatusBadge status={order.status} />
                          {canEditSales && (
                            <select
                              value={order.status || 'Pending'}
                              onChange={(e) => handleStatusChange(order.invoice, e.target.value)}
                              aria-label={`Ubah status ${order.invoice}`}
                              className="text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg px-1.5 py-1 focus:outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Dikonfirmasi">Dikonfirmasi</option>
                              <option value="Retur">Retur</option>
                              <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={33} className="py-12 text-center text-xs text-slate-400">
                      Tidak ada data penjualan yang cocok dengan pencarian "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-3.5 sm:px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-slate-500">
              <span>
                Menampilkan {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredOrders.length)} dari{' '}
                {filteredOrders.length} penjualan
              </span>

              {/* Pilihan Page Size */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 cursor-pointer focus:outline-none"
              >
                <option value={5}>5 / hal</option>
                <option value={10}>10 / hal</option>
                <option value={25}>25 / hal</option>
                <option value={50}>50 / hal</option>
                <option value={100}>100 / hal</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2.5 py-1 font-semibold text-slate-800 text-xs">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>
              Total {filteredOrders.length} baris data berhasil dimuat
            </span>
            <span>
              Format Excel yang didukung: .xlsx, .xls, .csv
            </span>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODAL BUAT SALES ORDER BARU
          ========================================================================= */}
      {canEditSales && isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Buat Sales Order Baru</h3>
                  <p className="text-[11px] text-slate-500">Tambah data order transaksi penjualan cabang</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateOrder} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Customer ID */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.customerId}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerId: e.target.value })}
                    placeholder="Contoh: CUST-006"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Customer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customer}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customer: e.target.value })}
                    placeholder="Contoh: Toko KIKY Prima"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* Kota */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.city}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, city: e.target.value })}
                    placeholder="Contoh: Bandung"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* No. Invoice */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. Invoice / SO
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.invoice}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, invoice: e.target.value })}
                    placeholder="Contoh: SO-2026-006"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* Bulan */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bulan Transaksi
                  </label>
                  <select
                    value={newOrderForm.month}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, month: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer"
                  >
                    <option value="Januari">Januari</option>
                    <option value="Februari">Februari</option>
                    <option value="Maret">Maret</option>
                    <option value="April">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Juni">Juni</option>
                    <option value="Juli">Juli</option>
                    <option value="Agustus">Agustus</option>
                    <option value="September">September</option>
                    <option value="Oktober">Oktober</option>
                    <option value="November">November</option>
                    <option value="Desember">Desember</option>
                  </select>
                </div>

                {/* Tanggal Detail (Kalender) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Detail Tanggal ({newOrderForm.detailDate})
                  </label>
                  <input
                    type="date"
                    value={newOrderForm.rawDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = getFormattedDateInfo(val);
                      setNewOrderForm({
                        ...newOrderForm,
                        rawDate: parsed.isoDate,
                        detailDate: parsed.detailDate,
                        month: parsed.month,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer"
                  />
                </div>

                {/* Salesman */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Salesman
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.salesman}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, salesman: e.target.value })}
                    placeholder="Nama sales"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* Status Penjualan */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Penjualan
                  </label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Retur">Retur</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                {/* Item No. */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Item No. (Kode Barang)
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.itemNo}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, itemNo: e.target.value })}
                    placeholder="Contoh: AA627222B"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* Item Desc. */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Item Desc. (Nama Barang)
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.itemDesc}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, itemDesc: e.target.value })}
                    placeholder="Contoh: KIKY MAJESTY BIRU@12"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newOrderForm.quantity}
                    onChange={(e) => {
                      const qty = e.target.value;
                      const autoCarton = qty ? Math.max(1, Math.round(Number(qty) / 10)) : '';
                      setNewOrderForm({
                        ...newOrderForm,
                        quantity: qty,
                        carton: newOrderForm.carton || autoCarton,
                      });
                    }}
                    placeholder="Contoh: 100"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-semibold"
                  />
                </div>

                {/* Carton */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Carton (Box)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newOrderForm.carton}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, carton: e.target.value })}
                    placeholder="Contoh: 10"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-semibold text-indigo-700"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer transition shadow-2xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B2A4A] text-white hover:bg-[#142038] rounded-xl text-xs font-semibold cursor-pointer transition shadow-sm"
                >
                  Simpan Sales Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}