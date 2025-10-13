<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Customer;
use App\Entity\GiftCard;
use App\Enum\RoleEnum;
use App\Enum\VoterEnum;
use App\Repository\GiftCardRepository;
use App\Service\QrCodeService;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/app/')]
final class AppGiftCardController extends AbstractController
{
    #[IsGranted(RoleEnum::CUSTOMER->value)]
    #[Route('gift-card', name: 'app_giftcard_index')]
    public function index(GiftCardRepository $giftCardRepository): Response
    {
        /** @var Customer $customer */
        $customer = $this->getUser();

        $giftCards = $giftCardRepository->findBy(['boughtBy' => $customer]);

        return $this->render('app/gift-card/index.html.twig', [
            'giftCards' => $giftCards,
        ]);
    }

    #[IsGranted(VoterEnum::QRCODE->value, subject: 'giftCard')]
    #[Route('gift-card/{giftcard_id}/qr-code', name: 'app_giftcard_qrcode')]
    public function qrCode(
        #[MapEntity(id: 'giftcard_id')]
        GiftCard $giftCard,
        QrCodeService $qrCodeService,
    ): Response {
        return $this->render('app/gift-card/qr-code.html.twig', [
            'giftCard' => $giftCard,
            'qrCode'   => $qrCodeService->generatePngBase64($giftCard->getCode()),
        ]);
    }
}
