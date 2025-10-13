<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Factory\Response\CustomerResponseDtoFactory;
use App\Entity\Customer;
use App\Enum\RoleEnum;
use App\Repository\CustomerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/')]
final class ApiCustomerController extends AbstractController
{
    #[IsGranted(RoleEnum::SELLER->value)]
    #[Route('customer', name: 'api_customer')]
    public function all(
        CustomerRepository $customerRepository,
        CustomerResponseDtoFactory $customerResponseDtoFactory,
    ): Response {
        return $this->json(array_map(
            fn (Customer $customer) => $customerResponseDtoFactory->fromEntity($customer),
            $customerRepository->findAll(),
        ));
    }
}
