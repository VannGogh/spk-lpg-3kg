<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Distribution;
use App\Models\DistributionDetail;
use App\Models\Warung;
use App\Services\SPK\HybridEngineService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DistributionsExport;

class DistributionController extends Controller
{
    public function index()
    {
        if (auth()->user()->role === 'supir') {
            // Untuk Supir, kita hanya tampilkan manifes yang 'locked' atau 'completed' terbaru
            $activeManifest = Distribution::with(['details.warung'])->whereIn('status', ['locked', 'completed'])->latest('date')->first();
            return Inertia::render('Supir/Manifest', [
                'manifest' => $activeManifest
            ]);
        }

        // Untuk Owner, kembalikan halaman Dashboard utamanya
        return Inertia::render('Dashboard', [
            'distributions' => Distribution::latest()->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date|unique:distributions,date',
            'total_stock' => 'required|integer|min:1',
            'alpha_capping' => 'required|numeric|min:0.1|max:1.0',
            'hari' => 'required|string|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
        ]);

        $distribution = Distribution::create($request->only('date', 'total_stock', 'alpha_capping'));

        // Otomatis tarik semua warung aktif ke detail manifes hari ini berdasarkan hari yang dipilih
        $warungs = Warung::where('is_active', true)
            ->where('hari_distribusi', $request->hari)
            ->get();

        foreach ($warungs as $warung) {
            DistributionDetail::create([
                'distribution_id' => $distribution->id,
                'warung_id' => $warung->id,
                'requested_qty' => 0, 
                'recommended_qty' => 0,
                'final_qty' => 0,
            ]);
        }

        return redirect()->route('distributions.edit', $distribution->id);
    }

    public function edit(Distribution $distribution)
    {
        $distribution->load('details.warung');
        // ponytail: inferred day from details to avoid DB migration. Upgrade path: add 'hari' column to 'distributions' table if mixed-day cycles are allowed.
        $hari_distribusi = $distribution->details->first()?->warung?->hari_distribusi;

        return Inertia::render('Distribution/Workspace', [
            'distribution' => $distribution,
            'hari_distribusi' => $hari_distribusi,
        ]);
    }

    public function calculate(Request $request, Distribution $distribution, HybridEngineService $engine)
    {
        if ($distribution->status !== 'draft') return back()->with('error', 'Manifes sudah dikunci.');

        $inputs = $request->validate([
            'details' => 'required|array',
            'details.*.id' => 'required|exists:distribution_details,id',
            'details.*.requested_qty' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($inputs, $distribution, $engine) {
            foreach ($inputs['details'] as $item) {
                DistributionDetail::where('id', $item['id'])->update(['requested_qty' => $item['requested_qty']]);
            }

            $distribution->refresh();
            $distribution->load('details.warung');
            
            $warungsData = [];
            foreach ($distribution->details as $detail) {
                $warung = $detail->warung;
                
                // Hitung histori Pemenuhan C1 (Total Diterima / Total Diminta) untuk warung ini di masa lalu
                $historyReceived = DistributionDetail::where('warung_id', $warung->id)
                    ->whereHas('distribution', fn($q) => $q->where('date', '<', $distribution->date)->whereIn('status', ['locked', 'completed']))
                    ->sum('final_qty');
                    
                $historyRequested = DistributionDetail::where('warung_id', $warung->id)
                    ->whereHas('distribution', fn($q) => $q->where('date', '<', $distribution->date)->whereIn('status', ['locked', 'completed']))
                    ->sum('requested_qty');

                $warungsData[] = [
                    'id' => $detail->id, 
                    'requested_qty' => $detail->requested_qty,
                    'payment_status' => $warung->payment_status,
                    'margin_category' => $warung->margin_category,
                    'mg_normal' => $warung->mg_normal,
                    'mg_absolut' => $warung->mg_absolut,
                    'history_received' => $historyReceived,
                    'history_requested' => $historyRequested,
                ];
            }

            // Jalankan Engine ROC-TOPSIS
            $allocations = $engine->execute($warungsData, $distribution->total_stock, $distribution->alpha_capping);

            foreach ($allocations as $detailId => $qty) {
                DistributionDetail::where('id', $detailId)->update([
                    'recommended_qty' => $qty,
                    'final_qty' => $qty // Default disamakan dengan rekomendasi sebelum di-override
                ]);
            }
        });

        return back()->with('message', 'Perhitungan SPK Hybrid ROC-TOPSIS berhasil dijalankan.');
    }

    public function override(Request $request, Distribution $distribution)
    {
        if ($distribution->status !== 'draft') return back()->with('error', 'Manifes sudah dikunci.');

        $inputs = $request->validate([
            'details' => 'required|array',
            'details.*.id' => 'required|exists:distribution_details,id',
            'details.*.final_qty' => 'required|integer|min:0',
        ]);

        foreach ($inputs['details'] as $item) {
            DistributionDetail::where('id', $item['id'])->update(['final_qty' => $item['final_qty']]);
        }

        return back()->with('message', 'Override alokasi berhasil disimpan.');
    }

    public function lock(Distribution $distribution)
    {
        $totalFinal = $distribution->details()->sum('final_qty');
        if ($totalFinal > $distribution->total_stock) {
            return back()->with('error', "Total alokasi akhir ($totalFinal) melebihi stok agen ($distribution->total_stock).");
        }

        $distribution->update(['status' => 'locked']);
        return back()->with('message', 'Manifes berhasil dikunci dan siap untuk Supir.');
    }

    // --- REPORTING / EXPORT --- //

    public function exportPdf(Distribution $distribution)
    {
        $distribution->load('details.warung');
        $pdf = Pdf::loadView('pdf.manifest', compact('distribution'));
        return $pdf->download('Manifes_SPK_LPG_' . $distribution->date . '.pdf');
    }

    public function exportExcel()
    {
        return Excel::download(new DistributionsExport, 'Riwayat_Distribusi_SPK.xlsx');
    }

    // --- MODUL SUPIR --- //

    public function deliver(Request $request, DistributionDetail $detail)
    {
        if (auth()->user()->role !== 'supir') abort(403);

        $detail->update(['delivery_status' => 'delivered']);
        return back()->with('message', 'Status pengiriman berhasil diperbarui.');
    }

    public function completeManifest(Distribution $distribution)
    {
        if (auth()->user()->role !== 'supir') abort(403);

        $distribution->update(['status' => 'completed']);
        return back()->with('message', 'Manifes hari ini telah selesai dikerjakan.');
    }
}
