<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recycling_certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->foreignId('waste_batch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('producer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recycler_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('quantity_kg', 12, 2);
            $table->string('material_type');
            $table->string('pdf_path')->nullable();
            $table->timestamp('issued_at');
            $table->timestamps();
        });

        Schema::create('recycling_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('certificate_id')->constrained('recycling_certificates')->cascadeOnDelete();
            $table->decimal('credits', 10, 2);
            $table->string('material_type');
            $table->year('period_year');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recycling_credits');
        Schema::dropIfExists('recycling_certificates');
    }
};
