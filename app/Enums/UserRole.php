<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super-admin';
    case Producer = 'producer';
    case Recycler = 'recycler';
    case Shpzp = 'shpzp';
    case Institution = 'institution';

    public function label(): string
    {
        return match($this) {
            self::SuperAdmin => 'Super Administrator',
            self::Producer => 'Producer',
            self::Recycler => 'Recycler',
            self::Shpzp => 'SHPZP (PRO)',
            self::Institution => 'Institution',
        };
    }
}
