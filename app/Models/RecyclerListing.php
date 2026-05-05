<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class RecyclerListing extends Model
{
    use HasFactory;

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
