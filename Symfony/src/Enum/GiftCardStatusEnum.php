<?php

declare(strict_types=1);

namespace App\Enum;

enum GiftCardStatusEnum: int
{
    case STOCK = 0;

    case ON_SALE = 1;

    case SOLD = 2;

    case ASSOCIATED = 3;

    case USED = 4;

    case FULLY_USED = 5;

    public function label(): string
    {
        return match ($this) {
            self::STOCK      => 'En stock',
            self::ON_SALE    => 'En vente',
            self::SOLD       => 'Vendu',
            self::ASSOCIATED => 'Associé',
            self::USED       => 'Partiellement utilisé',
            self::FULLY_USED => 'Completement utilisé',
        };
    }
}
