"""
Membuat file Excel contoh untuk uji coba import Sales Order.
Jalankan: python generate_excel.py
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

# ─── Warna header ────────────────────────────────────────────────────────────
HEADER_FILL = PatternFill("solid", fgColor="2563EB")
HEADER_FONT = Font(bold=True, color="FFFFFF")

def style_header(ws, headers):
    for col, h in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=h)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(horizontal="center")
        ws.column_dimensions[get_column_letter(col)].width = 22

wb = openpyxl.Workbook()

# ─── Sheet 1: Header SO ───────────────────────────────────────────────────────
ws1 = wb.active
ws1.title = "Header SO"

headers1 = ["Nomor SO", "Tanggal SO", "Kode Pelanggan", "Metode Pembayaran", "Keterangan"]
style_header(ws1, headers1)

data1 = [
    ["SO-2026-001", "2026-11-12", "CUST-001", "Tunai",   "Order pertama bulan November"],
    ["SO-2026-002", "2026-11-12", "CUST-002", "Kredit",  "Pembayaran 30 hari"],
    ["SO-2026-003", "2026-11-13", "CUST-003", "Transfer","Via BCA"],
]
for row in data1:
    ws1.append(row)

# ─── Sheet 2: Detail SO ──────────────────────────────────────────────────────
ws2 = wb.create_sheet("Detail SO")

headers2 = ["Nomor SO", "Kode Barang", "Quantity", "Satuan", "Harga"]
style_header(ws2, headers2)

data2 = [
    ["SO-2026-001", "BRG-001",  5, "CARTON",  3500],
    ["SO-2026-001", "BRG-002", 10, "PACK",    3000],
    ["SO-2026-002", "BRG-003",  2, "CARTON",  5000],
    ["SO-2026-002", "BRG-001",  3, "PCS",     3500],
    ["SO-2026-003", "BRG-002",  8, "CARTON",  3000],
    ["SO-2026-003", "BRG-003", 15, "PACK",    5000],
]
for row in data2:
    ws2.append(row)

# ─── Simpan ───────────────────────────────────────────────────────────────────
filename = "contoh_sales_order.xlsx"
wb.save(filename)
print(f"✅  File '{filename}' berhasil dibuat!")
print(f"    Sheet 1 'Header SO'  : {len(data1)} baris")
print(f"    Sheet 2 'Detail SO'  : {len(data2)} baris")

