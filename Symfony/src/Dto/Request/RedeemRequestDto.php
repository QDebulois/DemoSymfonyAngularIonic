<?php

declare(strict_types=1);

namespace App\Dto\Request;

use Symfony\Component\Validator\Constraints as Assert;

class RedeemRequestDto
{
    #[Assert\GreaterThan(0)]
    public int $amount;
}
