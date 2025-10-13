<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\GiftCard;
use App\Form\GiftCardType;
use App\Repository\AdminRepository;
use App\Repository\CustomerRepository;
use App\Repository\GiftCardRepository;
use App\Repository\RedeemerRepository;
use App\Repository\SellerRepository;
use App\Service\GiftCardService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/')]
final class AdminHomeController extends AbstractController
{
    #[Route('', name: 'admin_home')]
    public function index(
        Request $request,
        EntityManagerInterface $entityManager,
        AdminRepository $adminRepository,
        SellerRepository $sellerRepository,
        RedeemerRepository $redeemerRepository,
        CustomerRepository $customerRepository,
        GiftCardRepository $giftCardRepository,
        GiftCardService $giftCardService,
    ): Response {
        $giftCardForm = $this->createForm(GiftCardType::class);

        $giftCardForm->handleRequest($request);

        if ($giftCardForm->isSubmitted() && $giftCardForm->isValid()) {
            $quantity = $giftCardForm->get('quantity')->getData();
            $codes    = [];

            for ($i = 0; $i < $quantity; ++$i) {
                do {
                    $code = $giftCardService->generateCode();
                } while (in_array($code, $codes));

                $codes[] = $code;

                $initialAmount = 50;

                $giftCard = (new GiftCard())
                    ->setCode($code)
                    ->setInitialAmount($initialAmount)
                    ->setRemainingAmount($initialAmount)
                    ->setOnSaleBy($giftCardForm->get('onSaleBy')->getData())
                ;

                $entityManager->persist($giftCard);
            }

            $entityManager->flush();
        }

        $admins    = $adminRepository->findAll();
        $sellers   = $sellerRepository->findAll();
        $redeemers = $redeemerRepository->findAll();
        $customers = $customerRepository->findAll();
        $giftCards = $giftCardRepository->findAll();

        return $this->render('admin/home/index.html.twig', [
            'admins'       => $admins,
            'sellers'      => $sellers,
            'redeemers'    => $redeemers,
            'customers'    => $customers,
            'giftCards'    => $giftCards,
            'giftCardForm' => $giftCardForm->createView(),
        ]);
    }
}
