<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Owner SPK',
            'email' => 'owner@admin.com',
            'password' => bcrypt('password'),
            'role' => 'owner'
        ]);

        User::create([
            'name' => 'Supir Truk',
            'email' => 'supir@truk.com',
            'password' => bcrypt('password'),
            'role' => 'supir'
        ]);
    }
}
