import * as XLSX from 'xlsx';

/**
 * Parser file Excel (.xlsx, .xls, .csv) di browser secara fleksibel
 * Mendeteksi header dan baris data otomatis baik untuk Gudang maupun Penjualan.
 */
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Konversi ke array of arrays untuk mendeteksi header secara cerdas
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rows || rows.length === 0) {
          throw new Error('File Excel kosong.');
        }

        // Cari baris yang merupakan header
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(rows.length, 15); i++) {
          const row = rows[i] || [];
          const text = row.map((cell) => String(cell || '').toUpperCase()).join(' ');
          if (
            text.includes('KODE') ||
            text.includes('NAMA') ||
            text.includes('CUSTOMER') ||
            text.includes('ITEM') ||
            text.includes('INVOICE')
          ) {
            headerRowIndex = i;
            break;
          }
        }

        const rawHeaders = rows[headerRowIndex] || [];
        const cleanHeaders = rawHeaders.map((h) =>
          String(h || '').trim()
        );

        // Ambil data setelah baris header
        const dataRows = [];
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          // Buat objek dari header
          const item = {};
          let hasContent = false;

          cleanHeaders.forEach((header, colIndex) => {
            if (!header) return;
            const rawVal = row[colIndex];
            // Bersihkan string dari spasi berlebih (termasuk 30 spasi kosong dari file cabang)
            const val = typeof rawVal === 'string' ? rawVal.trim() : rawVal;
            if (val !== undefined && val !== null && val !== '') {
              hasContent = true;
              item[header] = val;
            } else {
              item[header] = '';
            }
          });

          // Cek kode dan nama barang untuk memfilter baris kosong atau subtotal
          const rawKode = String(
            item['KODE'] || item['Kode'] || item['Item No.'] || item['Item No'] || item['itemNo'] || ''
          ).trim();
          const rawNama = String(
            item['NAMA'] || item['Nama'] || item['Nama Barang'] || item['Item Desc.'] || item['Item Desc'] || item['itemDesc'] || ''
          ).trim();

          const isSubtotalOrHeader =
            (rawKode.toUpperCase() === 'JUMLAH' || rawKode.toUpperCase() === 'SCHOOL' || rawKode === '') &&
            !rawNama;

          // Jika file memiliki kolom NAMA atau Item Desc, pastikan baris memiliki nama barang agar tidak muncul baris kosong
          const hasNamaHeader = cleanHeaders.some((h) =>
            /^(nama|nama barang|item desc|deskripsi)/i.test(h)
          );
          const isValidRow = hasNamaHeader ? Boolean(rawNama) : Boolean(rawKode || rawNama);

          if (hasContent && !isSubtotalOrHeader && isValidRow) {
            dataRows.push(item);
          }
        }

        resolve({
          fileName: file.name,
          totalRows: dataRows.length,
          headers: cleanHeaders.filter(Boolean),
          rows: dataRows,
          rawRows: rows,
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Ekspor data JSON array ke file Excel (.xlsx) langsung di browser
 */
export const exportToExcel = (data, fileName = 'Data_KIKY.xlsx', sheetName = 'Sheet1') => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data yang akan diekspor kosong.');
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
};
