<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waste_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_code')->unique();
            $table->foreignId('collaboration_id')->constrained('collaboration_requests')->cascadeOnDelete();
            $table->string('material_type');
            $table->decimal('quantity_kg', 12, 2);
            $table->date('origin_date');
            $table->string('current_status')->default('collected')
                ->comment('collected, in_transport, received, in_treatment, recycled, recovered');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('waste_batch_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('waste_batch_id')->constrained()->cascadeOnDelete();
            $table->string('status');
            $table->foreignId('actor_id')->constrained('users')->cascadeOnDelete();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_batch_events');
        Schema::dropIfExists('waste_batches');
    }
};
