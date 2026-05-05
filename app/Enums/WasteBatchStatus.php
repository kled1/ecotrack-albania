<?php

namespace App\Enums;

enum WasteBatchStatus: string
{
    case Collected = 'collected';
    case InTransport = 'in_transport';
    case Received = 'received';
    case InTreatment = 'in_treatment';
    case Recycled = 'recycled';
    case Recovered = 'recovered';

    public function label(): string
    {
        return match($this) {
            self::Collected => 'Collected',
            self::InTransport => 'In Transport',
            self::Received => 'Received',
            self::InTreatment => 'In Treatment',
            self::Recycled => 'Recycled',
            self::Recovered => 'Recovered',
        };
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::Recycled, self::Recovered]);
    }
}
