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
        Schema::create('distribution_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warung_id')->constrained('warungs')->cascadeOnDelete();
            $table->integer('requested_qty');
            $table->integer('recommended_qty')->default(0);
            $table->integer('final_qty')->default(0);
            $table->enum('delivery_status', ['pending', 'delivered'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribution_details');
    }
};
