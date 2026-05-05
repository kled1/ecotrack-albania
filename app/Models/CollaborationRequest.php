<?php

namespace App\Models;

use App\Enums\CollaborationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class CollaborationRequest extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'producer_id',
        'recycler_id',
        'recycler_listing_id',
        'status',
        'material_type',
        'quantity_kg',
        'notes',
        'contract_path',
        'accepted_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => CollaborationStatus::class,
            'quantity_kg' => 'decimal:2',
            'accepted_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty()->dontLogEmptyChanges();
    }

    public function producer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'producer_id');
    }

    public function recycler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recycler_id');
    }

    public function recyclerListing(): BelongsTo
    {
        return $this->belongsTo(RecyclerListing::class);
    }

    public function wasteBatches(): HasMany
    {
        return $this->hasMany(WasteBatch::class, 'collaboration_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', CollaborationStatus::Active);
    }

    public function scopePending($query)
    {
        return $query->where('status', CollaborationStatus::Pending);
    }
}
