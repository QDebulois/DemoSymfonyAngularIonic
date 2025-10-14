<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Factory\Response\GiftCardResponseDtoFactory;
use App\Dto\Response\GiftCardInfosResponseDto;
use App\Entity\GiftCard;
use App\Enum\RoleEnum;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/')]
final class ApiGiftCardController extends AbstractController
{
    #[IsGranted(new Expression('
        is_granted("'.RoleEnum::SELLER->value.'")
        or is_granted("'.RoleEnum::REDEEMER->value.'")
        or is_granted("'.RoleEnum::CUSTOMER->value.'")
    '))]
    #[Route('gift-card/{gift_card_code}', name: 'api_giftcard_infos')]
    public function infos(
        #[MapEntity(mapping: ['gift_card_code' => 'code'])]
        GiftCard $giftCard,
        GiftCardResponseDtoFactory $giftCardResponseDtoFactory,
    ): Response {
        return $this->json($giftCardResponseDtoFactory->fromEntity($giftCard));
    }

    #[IsGranted(RoleEnum::SELLER->value)]
    #[Route('gift-card/{gift_card_code}/sell', name: 'api_giftcard_sell')]
    public function sell(
        #[MapEntity(mapping: ['code' => 'gift_card_code'])]
        GiftCard $giftCard,
    ): Response {
        dump($giftCard);

        return new Response();
    }

    #[IsGranted(RoleEnum::REDEEMER->value)]
    #[Route('gift-card/{gift_card_code}/redeem', name: 'api_giftcard_redeem')]
    public function redeem(
        #[MapEntity(mapping: ['code' => 'gift_card_code'])]
        GiftCard $giftCard,
    ): Response {
        dump($giftCard);

        return new Response();
    }

    #[IsGranted(RoleEnum::CUSTOMER->value)]
    #[Route('gift-card/{gift_card_code}/associate', name: 'api_giftcard_associate')]
    public function associate(
        #[MapEntity(mapping: ['code' => 'gift_card_code'])]
        GiftCard $giftCard,
    ): Response {
        dump($giftCard);

        return new Response();
    }
}
