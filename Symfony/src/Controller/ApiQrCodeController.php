<?php

declare(strict_types=1);

namespace App\Controller;

use App\Enum\RoleEnum;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/')]
final class ApiQrCodeController extends AbstractController
{
    #[Route('qr-code/generate', name: 'api_qrcode_generate')]
    public function generate(): Response
    {
        $role = match(true) {
            $this->isGranted(RoleEnum::ADMIN->value)    => 'Admin',
            $this->isGranted(RoleEnum::REDEEMER->value) => 'Redeemer',
            $this->isGranted(RoleEnum::SELLER->value)   => 'Seller',
            $this->isGranted(RoleEnum::CUSTOMER->value) => 'Customer',
            default                                     => 'Unknown',
        };

        return $this->json(['Hello' => $role]);
    }
}
