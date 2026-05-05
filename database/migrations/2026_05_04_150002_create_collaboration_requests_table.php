<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collaboration_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recycler_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recycler_listing_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('pending')->comment('pending, accepted, rejected, active, completed, cancelled');
            $table->string('material_type');
            $table->decimal('quantity_kg', 12, 2);
            $table->text('notes')->nullable();
            $table->string('contract_path')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collaboration_requests');
    }
};
