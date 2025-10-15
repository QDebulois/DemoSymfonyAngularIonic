<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Factory\Response\GiftCardResponseDtoFactory;
use App\Dto\Request\CustomerRequestDto;
use App\Dto\Request\RedeemRequestDto;
use App\Entity\Customer;
use App\Entity\GiftCard;
use App\Entity\GiftCardUsage;
use App\Entity\Redeemer;
use App\Enum\RoleEnum;
use App\Repository\CustomerRepository;
use Doctrine\ORM\EntityManagerInterface;
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
        #[MapEntity(mapping: ['gift_card_code' => 'code'])]
        GiftCard $giftCard,
        #[MapRequestPayload()]
        CustomerRequestDto $customerRequestDto,
        EntityManagerInterface $entityManager,
        CustomerRepository $customerRepository,
    ): Response {
        if ($giftCard->getBoughtBy()) {
            return new Response(status: Response::HTTP_BAD_REQUEST);
        }

        if (!$customer = $customerRepository->findOneBy(['email' => $customerRequestDto->email])) {
            return new Response(status: Response::HTTP_NOT_FOUND);
        }

        $giftCard->setBoughtBy($customer);

        $entityManager->flush();

        return new Response(status: Response::HTTP_NO_CONTENT);
    }

    #[IsGranted(RoleEnum::CUSTOMER->value)]
    #[Route('gift-card/{gift_card_code}/associate', name: 'api_giftcard_associate')]
    public function associate(
        #[MapEntity(mapping: ['gift_card_code' => 'code'])]
        GiftCard $giftCard,
        EntityManagerInterface $entityManager,
    ): Response {
        if ($giftCard->getAssociatedTo()) {
            return new Response(status: Response::HTTP_BAD_REQUEST);
        }

        /** @var Customer $customer */
        $customer = $this->getUser();

        $giftCard->setAssociatedTo($customer);

        $entityManager->flush();

        return new Response(status: Response::HTTP_NO_CONTENT);
    }

    #[IsGranted(RoleEnum::REDEEMER->value)]
    #[Route('gift-card/{gift_card_code}/redeem', name: 'api_giftcard_redeem')]
    public function redeem(
        #[MapEntity(mapping: ['gift_card_code' => 'code'])]
        GiftCard $giftCard,
        #[MapRequestPayload()]
        RedeemRequestDto $redeemRequestDto,
        EntityManagerInterface $entityManager,
    ): Response {
        if (!$giftCard->getAssociatedTo()) {
            return new Response(status: Response::HTTP_BAD_REQUEST);
        }

        if ($redeemRequestDto->amount > $giftCard->getRemainingAmount()) {
            return new Response(status: Response::HTTP_BAD_REQUEST);
        }

        /** @var Redeemer $redeemer */
        $redeemer = $this->getUser();

        $giftCardUsage = (new GiftCardUsage())
            ->setGiftCard($giftCard)
            ->setUsedAmount($redeemRequestDto->amount)
            ->setUsedAt(new \DateTimeImmutable())
            ->setUsedTo($redeemer)
        ;

        $giftCard
            ->setRemainingAmount($giftCard->getRemainingAmount() - $redeemRequestDto->amount)
            ->addGiftCardUsage($giftCardUsage)
        ;

        $entityManager->persist($giftCardUsage);
        $entityManager->flush();

        return new Response(status: Response::HTTP_CREATED);
    }
}
