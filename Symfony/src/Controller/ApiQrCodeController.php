<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/')]
final class ApiQrCodeController extends AbstractController
{
    #[Route('qr-code/generate', name: 'api_qrcode_generate')]
    public function generate(): Response
    {
        return $this->json(['Hello' => 'World']);
    }
}

