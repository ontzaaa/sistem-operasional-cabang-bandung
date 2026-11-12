<?php

namespace App\Services;

use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use App\Models\Barang;
use Illuminate\Support\Facades\DB;

class SalesOrderService
{
    /**
     * Membuat Sales Order beserta detail-nya sekaligus.
     *
     * @param array $data  Harus mengandung:
     *   - nomor_so, tanggal_so, customer_id, metode_pembayaran
     *   - keterangan (opsional)
     *   - user_id (opsional)
     *   - details (array of: barang_id|kode_barang, quantity, satuan, harga)
     */
    public function create(array $data): SalesOrder
    {
        return DB::transaction(function () use ($data) {

            $order = SalesOrder::create([
                'nomor_so'          => $data['nomor_so'],
                'tanggal_so'        => $data['tanggal_so'],
                'customer_id'       => $data['customer_id'],
                'user_id'           => $data['user_id'] ?? null,
                'metode_pembayaran' => $data['metode_pembayaran'],
                'keterangan'        => $data['keterangan'] ?? null,
                'status'            => 'Submitted',
                'subtotal'          => 0,
                'grand_total'       => 0,
            ]);

            if (!empty($data['details'])) {
                $this->syncDetails($order, $data['details']);
            }

            return $order->fresh();
        });
    }

    /**
     * Menambah / memperbarui detail baris pada Sales Order
     * dan menghitung ulang subtotal & grand_total.
     */
    public function syncDetails(SalesOrder $order, array $details): void
    {
        foreach ($details as $detail) {

            // Support kode_barang atau barang_id langsung
            if (isset($detail['kode_barang'])) {
                $barang = Barang::where('kode_barang', $detail['kode_barang'])->firstOrFail();
                $barangId = $barang->id;
            } else {
                $barangId = $detail['barang_id'];
            }

            $qty      = (float) ($detail['quantity'] ?? 0);
            $harga    = (float) ($detail['harga'] ?? 0);
            $subtotal = $qty * $harga;

            DetailSalesOrder::create([
                'sales_order_id' => $order->id,
                'barang_id'      => $barangId,
                'quantity'       => $qty,
                'satuan'         => strtolower($detail['satuan'] ?? 'pcs'),
                'harga'          => $harga,
                'subtotal'       => $subtotal,
            ]);
        }

        $this->recalculateTotals($order);
    }

    /**
     * Menghitung ulang subtotal & grand_total dari baris detail.
     */
    public function recalculateTotals(SalesOrder $order): void
    {
        $total = $order->detailSalesOrder()->sum('subtotal');

        $order->update([
            'subtotal'    => $total,
            'grand_total' => $total,
        ]);
    }
}

