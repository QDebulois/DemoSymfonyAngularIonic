<?php

declare(strict_types=1);

namespace App\Twig;

use App\Enum\GiftCardStatusEnum;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class GiftCardStatusEnumExtension extends AbstractExtension
{
    public function __construct() {}

    public function getFunctions(): array
    {
        return [
            new TwigFilter('giftCardStatusEnum', fn (string $enumCase): GiftCardStatusEnum => GiftCardStatusEnum::{$enumCase}),
        ];
    }
}
