<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('period_type')->comment('quarterly, annual');
            $table->year('period_year');
            $table->tinyInteger('period_quarter')->nullable()->comment('1-4 for quarterly');
            $table->string('material_category')->comment('packaging, electronics, automotive, batteries, lubricants, other');
            $table->decimal('quantity_kg', 14, 3);
            $table->integer('quantity_units')->nullable();
            $table->string('status')->default('draft')->comment('draft, submitted, verified, rejected');
            $table->text('notes')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
