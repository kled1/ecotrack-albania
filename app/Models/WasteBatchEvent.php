<?php

namespace App\Models;

use App\Enums\WasteBatchStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WasteBatchEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'waste_batch_id',
        'status',
        'actor_id',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'status' => WasteBatchStatus::class,
            'metadata' => 'array',
        ];
    }

    public function wasteBatch(): BelongsTo
    {
        return $this->belongsTo(WasteBatch::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
