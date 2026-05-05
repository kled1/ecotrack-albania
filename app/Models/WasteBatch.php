<?php

namespace App\Models;

use App\Enums\WasteBatchStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class WasteBatch extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'batch_code',
        'collaboration_id',
        'material_type',
        'quantity_kg',
        'origin_date',
        'current_status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'current_status' => WasteBatchStatus::class,
            'quantity_kg' => 'decimal:2',
            'origin_date' => 'date',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty()->dontLogEmptyChanges();
    }

    public function collaboration(): BelongsTo
    {
        return $this->belongsTo(CollaborationRequest::class, 'collaboration_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(WasteBatchEvent::class);
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(RecyclingCertificate::class);
    }

    public static function generateBatchCode(): string
    {
        return 'WB-' . strtoupper(substr(uniqid(), -6)) . '-' . now()->format('Y');
    }

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->batch_code)) {
                $model->batch_code = self::generateBatchCode();
            }
        });
    }
}
