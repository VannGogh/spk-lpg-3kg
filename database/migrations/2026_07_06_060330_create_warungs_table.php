<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('warungs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->tinyInteger('payment_status')->default(3)->comment('3:Lancar, 2:Kurang Lancar, 1:Tidak Lancar');
            $table->tinyInteger('margin_category')->default(1)->comment('3:Kecil, 1:Besar');
            $table->integer('mg_normal')->default(5);
            $table->integer('mg_absolut')->default(3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warungs');
    }
};
