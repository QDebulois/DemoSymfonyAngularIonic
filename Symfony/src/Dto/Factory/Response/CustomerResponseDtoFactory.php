<?php

declare(strict_types=1);

namespace App\Dto\Factory\Response;

use App\Dto\Response\CustomerResponseDto;
use App\Entity\Customer;

class CustomerResponseDtoFactory
{
    public function fromEntity(Customer $customer): CustomerResponseDto
    {
        $customerResponseDto = new CustomerResponseDto();

        $customerResponseDto->email = $customer->getEmail();

        return $customerResponseDto;
    }
}
