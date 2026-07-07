<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [\App\Http\Controllers\Owner\DistributionController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('warungs', \App\Http\Controllers\WarungController::class);
    Route::resource('users', \App\Http\Controllers\Owner\UserController::class);
    
    // Rute Engine SPK & Distribusi Harian
    Route::post('/distributions', [\App\Http\Controllers\Owner\DistributionController::class, 'store'])->name('distributions.store');
    Route::get('/distributions/{distribution}/edit', [\App\Http\Controllers\Owner\DistributionController::class, 'edit'])->name('distributions.edit');
    Route::post('/distributions/{distribution}/calculate', [\App\Http\Controllers\Owner\DistributionController::class, 'calculate'])->name('distributions.calculate');
    Route::post('/distributions/{distribution}/override', [\App\Http\Controllers\Owner\DistributionController::class, 'override'])->name('distributions.override');
    Route::post('/distributions/{distribution}/lock', [\App\Http\Controllers\Owner\DistributionController::class, 'lock'])->name('distributions.lock');
    
    // Rute Ekspor Laporan
    Route::get('/distributions/{distribution}/pdf', [\App\Http\Controllers\Owner\DistributionController::class, 'exportPdf'])->name('distributions.pdf');
    Route::get('/reports/excel', [\App\Http\Controllers\Owner\DistributionController::class, 'exportExcel'])->name('reports.excel');
    
    // Rute Supir
    Route::post('/distributions/detail/{detail}/deliver', [\App\Http\Controllers\Owner\DistributionController::class, 'deliver'])->name('distributions.deliver');
    Route::post('/distributions/{distribution}/complete', [\App\Http\Controllers\Owner\DistributionController::class, 'completeManifest'])->name('distributions.complete');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
