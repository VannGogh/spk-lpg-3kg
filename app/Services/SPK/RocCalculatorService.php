<?php

namespace App\Services\SPK;

class RocCalculatorService
{
    /**
     * Menghitung bobot kriteria menggunakan Rank Order Centroid (ROC)
     * Berdasarkan SRS halaman 13
     */
    public function getWeights(): array
    {
        $k = 3; // Jumlah kriteria: Histori, Pembayaran, Margin
        $weights = [];

        for ($i = 1; $i <= $k; $i++) {
            $sum = 0;
            for ($j = $i; $j <= $k; $j++) {
                $sum += (1 / $j);
            }
            $weights['C' . $i] = (1 / $k) * $sum;
        }

        // Output akan selalu: C1 = 0.6111, C2 = 0.2778, C3 = 0.1111
        return $weights;
    }
}
