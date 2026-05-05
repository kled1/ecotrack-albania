<?php

namespace App\Models;

use App\Enums\MaterialCategory;
use App\Enums\ReportStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Report extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'period_type',
        'period_year',
        'period_quarter',
        'material_category',
        'quantity_kg',
        'quantity_units',
        'status',
        'notes',
        'pdf_path',
        'submitted_at',
        'verified_at',
        'verified_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => ReportStatus::class,
            'material_category' => MaterialCategory::class,
            'quantity_kg' => 'decimal:3',
            'submitted_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', ReportStatus::Draft);
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', ReportStatus::Submitted);
    }

    public function scopeVerified($query)
    {
        return $query->where('status', ReportStatus::Verified);
    }

    public function getPeriodLabelAttribute(): string
    {
        if ($this->period_type === 'quarterly') {
            return "Q{$this->period_quarter} {$this->period_year}";
        }
        return (string) $this->period_year;
    }
}
