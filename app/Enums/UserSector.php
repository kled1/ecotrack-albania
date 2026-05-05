<?php

namespace App\Enums;

enum UserSector: string
{
    case Packaging = 'packaging';
    case Electronics = 'electronics';
    case Automotive = 'automotive';
    case FoodBeverage = 'food_beverage';
    case Batteries = 'batteries';
    case Lubricants = 'lubricants';
    case Other = 'other';

    public function label(): string
    {
        return match($this) {
            self::Packaging => 'Packaging',
            self::Electronics => 'Electronics (WEEE)',
            self::Automotive => 'Automotive',
            self::FoodBeverage => 'Food & Beverage',
            self::Batteries => 'Batteries',
            self::Lubricants => 'Lubricants',
            self::Other => 'Other',
        };
    }
}
