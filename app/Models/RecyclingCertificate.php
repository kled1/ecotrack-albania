<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class RecyclingCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'waste_batch_id',
        'producer_id',
        'recycler_id',
        'quantity_kg',
        'material_type',
        'pdf_path',
        'issued_at',
    ];

    protected function casts(): array
    {
        return [
            'quantity_kg' => 'decimal:2',
            'issued_at' => 'datetime',
        ];
    }

    public function wasteBatch(): BelongsTo
    {
        return $this->belongsTo(WasteBatch::class);
    }

    public function producer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'producer_id');
    }

    public function recycler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recycler_id');
    }

    public function credit(): HasOne
    {
        return $this->hasOne(RecyclingCredit::class, 'certificate_id');
    }

    public static function generateCertificateNumber(): string
    {
        return 'RC-' . now()->format('Y') . '-' . str_pad(
            static::whereYear('issued_at', now()->year)->count() + 1,
            6, '0', STR_PAD_LEFT
        );
    }
}
