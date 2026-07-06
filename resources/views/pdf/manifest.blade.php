<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Manifes Distribusi LPG 3KG</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; padding: 0; font-size: 24px; }
        .info { margin-bottom: 20px; }
        .info p { margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #f5f5f5; }
        .left { text-align: left; }
        .footer { margin-top: 50px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>MANIFES DISTRIBUSI LPG 3KG</h1>
        <p>Sistem Pendukung Keputusan Hybrid ROC-TOPSIS</p>
    </div>

    <div class="info">
        <p><strong>Tanggal Distribusi:</strong> {{ \Carbon\Carbon::parse($distribution->date)->translatedFormat('l, d F Y') }}</p>
        <p><strong>Total Stok Pangkalan:</strong> {{ $distribution->total_stock }} Tabung</p>
        <p><strong>Alpha Capping:</strong> {{ $distribution->alpha_capping }}</p>
        <p><strong>Status Manifes:</strong> {{ strtoupper($distribution->status) }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th class="left">Nama Pengecer (Warung)</th>
                <th class="left">Alamat</th>
                <th>Permintaan</th>
                <th>Alokasi SPK</th>
                <th>Total Final Dikirim</th>
            </tr>
        </thead>
        <tbody>
            @php $totalFinal = 0; $no = 1; @endphp
            @foreach($distribution->details as $detail)
                @if($detail->final_qty > 0)
                <tr>
                    <td>{{ $no++ }}</td>
                    <td class="left">{{ $detail->warung->name }}</td>
                    <td class="left">{{ $detail->warung->address }}</td>
                    <td>{{ $detail->requested_qty }}</td>
                    <td>{{ $detail->recommended_qty }}</td>
                    <td><strong>{{ $detail->final_qty }}</strong></td>
                </tr>
                @php $totalFinal += $detail->final_qty; @endphp
                @endif
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="5" style="text-align: right;">Total Distribusi Hari Ini:</th>
                <th>{{ $totalFinal }} Tabung</th>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Disetujui Oleh,</p>
        <br><br><br>
        <p><strong>_____________________</strong></p>
        <p>Pimpinan Pangkalan</p>
    </div>
</body>
</html>
