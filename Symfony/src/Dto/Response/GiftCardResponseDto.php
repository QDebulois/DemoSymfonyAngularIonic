<?php

declare(strict_types=1);

namespace App\Dto\Response;

class GiftCardResponseDto
{
    public string $code;
    public int $initialAmount;
    public int $remainingAmount;
    public ?string $onSaleBy;
    public ?string $boughtBy;
    public ?string $associatedTo;
}
