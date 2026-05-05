<?php

namespace App\Enums;

enum MaterialCategory: string
{
    case Packaging = 'packaging';
    case Electronics = 'electronics';
    case Automotive = 'automotive';
    case Batteries = 'batteries';
    case Lubricants = 'lubricants';
    case Other = 'other';

    public function label(): string
    {
        return match($this) {
            self::Packaging => 'Packaging',
            self::Electronics => 'Electronics (WEEE)',
            self::Automotive => 'Automotive Parts',
            self::Batteries => 'Batteries',
            self::Lubricants => 'Lubricants/Oils',
            self::Other => 'Other',
        };
    }
}
