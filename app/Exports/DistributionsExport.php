<?php

namespace App\Exports;

use App\Models\Distribution;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DistributionsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Distribution::with('details.warung')->where('status', 'completed')->latest()->get();
    }

    public function headings(): array
    {
        return [
            'ID Distribusi',
            'Tanggal',
            'Total Stok',
            'Alpha Capping',
            'Warung',
            'Permintaan',
            'Rekomendasi SPK',
            'Alokasi Final',
            'Status Pengiriman'
        ];
    }

    /**
     * @param Distribution $row
     */
    public function map($row): array
    {
        $rows = [];
        foreach ($row->details as $detail) {
            $rows[] = [
                $row->id,
                $row->date,
                $row->total_stock,
                $row->alpha_capping,
                $detail->warung->name,
                $detail->requested_qty,
                $detail->recommended_qty,
                $detail->final_qty,
                $detail->delivery_status === 'delivered' ? 'Terkirim' : 'Pending',
            ];
        }
        return $rows;
    }
}
