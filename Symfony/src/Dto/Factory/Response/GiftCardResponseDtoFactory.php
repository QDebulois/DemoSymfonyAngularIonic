<?php

declare(strict_types=1);

namespace App\Dto\Factory\Response;

use App\Dto\Response\GiftCardResponseDto;
use App\Entity\GiftCard;

class GiftCardResponseDtoFactory
{
    public function fromEntity(GiftCard $giftCard): GiftCardResponseDto
    {
        $giftCardResponseDto = new GiftCardResponseDto();

        $giftCardResponseDto->code            = $giftCard->getCode();
        $giftCardResponseDto->initialAmount   = $giftCard->getInitialAmount();
        $giftCardResponseDto->remainingAmount = $giftCard->getRemainingAmount();
        $giftCardResponseDto->onSaleBy        = $giftCard->getOnSaleBy()?->getUsername();
        $giftCardResponseDto->boughtBy        = $giftCard->getBoughtBy()?->getEmail();
        $giftCardResponseDto->associatedTo    = $giftCard->getAssociatedTo()?->getEmail();

        return $giftCardResponseDto;
    }
}
