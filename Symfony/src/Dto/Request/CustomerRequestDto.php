<?php

declare(strict_types=1);

namespace App\Dto\Request;

use Symfony\Component\Validator\Constraints as Assert;

class CustomerRequestDto
{
    #[Assert\Email]
    public string $email;
}
