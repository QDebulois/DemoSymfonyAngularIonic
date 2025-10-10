<?php

declare(strict_types=1);

namespace App\Enum;

enum RoleEnum: string
{
    case ADMIN = 'ROLE_ADMIN';

    case SELLER = 'ROLE_SELLER';

    case REDEEMER = 'ROLE_REDEEMER';

    case CUSTOMER = 'ROLE_CUSTOMER';

    public function label(): string
    {
        return match($this) {
            self::ADMIN    => 'Administrateur',
            self::SELLER   => 'Point de vente',
            self::REDEEMER => "Point d'utilisation",
            self::CUSTOMER => 'Client',
        };
    }
}
