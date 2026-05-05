<?php

namespace App\Models;

use App\Enums\UserSector;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles, LogsActivity;

    protected $fillable = [
        'name',
        'email',
        'company_name',
        'nipt',
        'sector',
        'phone',
        'address',
        'city',
        'is_active',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'sector' => UserSector::class,
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'company_name', 'nipt', 'sector', 'is_active'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function recyclerListing(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(RecyclerListing::class);
    }

    public function collaborationsAsProducer(): HasMany
    {
        return $this->hasMany(CollaborationRequest::class, 'producer_id');
    }

    public function collaborationsAsRecycler(): HasMany
    {
        return $this->hasMany(CollaborationRequest::class, 'recycler_id');
    }

    public function recyclingCredits(): HasMany
    {
        return $this->hasMany(RecyclingCredit::class, 'producer_id');
    }

    public function isProducer(): bool
    {
        return $this->hasRole('producer');
    }

    public function isRecycler(): bool
    {
        return $this->hasRole('recycler');
    }

    public function isShpzp(): bool
    {
        return $this->hasRole('shpzp');
    }

    public function isInstitution(): bool
    {
        return $this->hasRole('institution');
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }

    public function getPrimaryRole(): ?string
    {
        return $this->roles->first()?->name;
    }

    public function totalCredits(): float
    {
        return (float) $this->recyclingCredits()->sum('credits');
    }
}
