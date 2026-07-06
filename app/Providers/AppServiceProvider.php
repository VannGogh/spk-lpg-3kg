<?php

namespace App\Providers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            $markerPath = sys_get_temp_dir().'/spk_lpg_migrated.flag';

            if (! file_exists($markerPath)) {
                Artisan::call('migrate', ['--force' => true]);

                file_put_contents($markerPath, now()->toDateTimeString());
            }
        }

        Vite::prefetch(concurrency: 3);
    }
}
