<?php

declare(strict_types=1);

namespace App\Twig;

use App\Entity\GiftCard;
use App\Entity\GiftCardUsage;
use App\Enum\GiftCardStatusEnum;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class GiftCardStatusFilter extends AbstractExtension
{
    public function __construct() {}

    public function getFilters(): array
    {
        return [
            new TwigFilter('giftCardStatus', function (GiftCard $giftCard): GiftCardStatusEnum {
                if (null === $giftCard->getOnSaleBy()) {
                    return GiftCardStatusEnum::STOCK;
                }

                if (null === $giftCard->getBoughtBy()) {
                    return GiftCardStatusEnum::ON_SALE;
                }

                if (null === $giftCard->getAssociatedTo()) {
                    return GiftCardStatusEnum::SOLD;
                }

                $usedAmount = array_reduce(
                    $giftCard->getGiftCardUsages()->toArray(),
                    fn (int $carry, GiftCardUsage $item) => $carry + $item->getUsedAmount(),
                    0,
                );

                if (0 <= $usedAmount) {
                    return GiftCardStatusEnum::ASSOCIATED;
                }

                if ($usedAmount < $giftCard->getInitialAmount()) {
                    return GiftCardStatusEnum::USED;
                }

                return GiftCardStatusEnum::FULLY_USED;
            }),
        ];
    }
}
