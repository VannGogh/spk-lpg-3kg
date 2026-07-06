<?php

namespace App\Services\SPK;

class CappingLogicService
{
    /**
     * Menerapkan pembatasan dan jaminan alokasi sesuai SRS Halaman 14
     */
    public function applyCapping(array $warungs, int $totalStock, float $alpha, array $topsisScores): array
    {
        $allocations = [];
        $totalMg = array_sum(array_column($warungs, 'mg_normal'));

        // BR-08: Mode Alokasi Kritis
        if ($totalMg > $totalStock) {
            $totalMga = array_sum(array_column($warungs, 'mg_absolut'));

            // Tahap 1: Jaminan Minimum Absolut
            foreach ($warungs as $warung) {
                if ($totalMga <= $totalStock) {
                    $allocations[$warung['id']] = $warung['mg_absolut'];
                } else {
                    // Proporsional paling ekstrem
                    $allocations[$warung['id']] = (int) round($warung['mg_absolut'] * ($totalStock / $totalMga));
                }
            }

            // Tahap 2: Distribusi Sisa Stok Berbasis Prioritas TOPSIS
            $sisaKritis = $totalStock - array_sum($allocations);
            if ($sisaKritis > 0) {
                // Gunakan Largest Remainder Method untuk sisa stok
                $allocations = $this->distributeRemainder($warungs, $allocations, $topsisScores, $sisaKritis, true);
            }

            return $allocations;
        }

        // Mode Undersupply Standar (Total MG <= Total Stok)
        // 1. Alokasi Dasar = MG
        $sisaStok = $totalStock;
        foreach ($warungs as $warung) {
            $allocations[$warung['id']] = $warung['mg_normal'];
            $sisaStok -= $warung['mg_normal'];
        }

        // 2. Alokasikan Sisa Stok berbasis TOPSIS dengan batas atas Dynamic Capping
        $dcLimit = (int) round($alpha * $sisaStok);
        if ($sisaStok > 0) {
            $allocations = $this->distributeRemainder($warungs, $allocations, $topsisScores, $sisaStok, false, $dcLimit);
        }

        return $allocations;
    }

    /**
     * Distribusi proporsional menggunakan Largest Remainder Method (Hare-Niemeyer)
     * Untuk memastikan tabung dibagikan genap dan tidak bersisa pecahan
     */
    private function distributeRemainder(array $warungs, array $allocations, array $topsisScores, int $sisaStok, bool $isCritical, int $dcLimit = 9999): array
    {
        $totalVi = array_sum($topsisScores) ?: 1;
        $fractions = [];
        $distributed = 0;

        foreach ($warungs as $warung) {
            $id = $warung['id'];
            $vi = $topsisScores[$id] ?? 0;
            
            // Berapa hak tambahan tabung untuk warung ini
            $hakTambahanFloat = ($vi / $totalVi) * $sisaStok;
            $hakTambahan = floor($hakTambahanFloat);
            $fractions[$id] = $hakTambahanFloat - $hakTambahan;

            // Batasi sesuai aturan (Sisa MG atau Permintaan, atau DC Limit)
            if ($isCritical) {
                // Di mode kritis, tambahan maksimal sebesar selisih (MG - MGA)
                $maxTambahan = $warung['mg_normal'] - $warung['mg_absolut'];
                $hakTambahan = min($hakTambahan, $maxTambahan);
            } else {
                // Di mode standar, tambahan maksimal sebesar selisih (Permintaan - MG) atau DC limit
                $maxTambahan = min($warung['requested_qty'] - $warung['mg_normal'], $dcLimit);
                $maxTambahan = max(0, $maxTambahan); // Jangan sampai negatif
                $hakTambahan = min($hakTambahan, $maxTambahan);
            }

            $allocations[$id] += $hakTambahan;
            $distributed += $hakTambahan;
        }

        // Bagikan sisa stok yang belum terbagi akibat floor()
        $sisaBelumTerbagi = $sisaStok - $distributed;
        arsort($fractions); // Urutkan sisa pecahan terbesar

        foreach ($fractions as $id => $fraction) {
            if ($sisaBelumTerbagi <= 0) break;

            // Cek kembali batas maksimal sebelum memberi 1 tabung tambahan
            $warung = array_filter($warungs, fn($w) => $w['id'] === $id);
            $warung = reset($warung);

            if ($isCritical) {
                if ($allocations[$id] < $warung['mg_normal']) {
                    $allocations[$id]++;
                    $sisaBelumTerbagi--;
                }
            } else {
                $maxAllowable = min($warung['requested_qty'], $warung['mg_normal'] + $dcLimit);
                if ($allocations[$id] < $maxAllowable) {
                    $allocations[$id]++;
                    $sisaBelumTerbagi--;
                }
            }
        }

        return $allocations;
    }
}
