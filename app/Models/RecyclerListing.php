<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class RecyclerListing extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'capacity_kg',
        'material_types',
        'location',
        'license_number',
        'license_expires_at',
        'description',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'material_types' => 'array',
            'capacity_kg' => 'decimal:2',
            'active' => 'boolean',
            'license_expires_at' => 'date',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty()->dontLogEmptyChanges();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function collaborationRequests(): HasMany
    {
        return $this->hasMany(CollaborationRequest::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
