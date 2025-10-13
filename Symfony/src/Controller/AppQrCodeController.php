<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\GiftCard;
use App\Enum\VoterEnum;
use App\Service\QrCodeService;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/app/')]
final class AppQrCodeController extends AbstractController
{
    #[IsGranted(VoterEnum::QRCODE->value, subject: 'giftCard')]
    #[Route('qr-code/{giftcard_id}', name: 'app_qrcode_generate')]
    public function generate(
        #[MapEntity(id: 'giftcard_id')]
        GiftCard $giftCard,
        QrCodeService $qrCodeService,
    ): Response {
        return $this->render('app/qr-code/index.html.twig', [
            'giftCard' => $giftCard,
            'qrCode'   => $qrCodeService->generatePngBase64($giftCard->getCode()),
        ]);
    }
}
