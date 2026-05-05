<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RecyclingCredit extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_id',
        'certificate_id',
        'credits',
        'material_type',
        'period_year',
    ];

    protected function casts(): array
    {
        return [
            'credits' => 'decimal:2',
        ];
    }

    public function producer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'producer_id');
    }

    public function certificate(): BelongsTo
    {
        return $this->belongsTo(RecyclingCertificate::class, 'certificate_id');
    }
}
