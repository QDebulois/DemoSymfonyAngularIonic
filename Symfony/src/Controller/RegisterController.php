<?php

declare(strict_types=1);

namespace App\Controller;

use App\Form\RegisterFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/register')]
final class RegisterController extends AbstractController
{
    #[Route('', name: 'app_register')]
    public function register(Request $request): Response
    {
        $form = $this->createForm(RegisterFormType::class);

        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return $this->render('register/index.html.twig', [
                'form' => $form->createView(),
            ]);
        }

        if (!$form->isValid()) {
            return new JsonResponse(['fuck' => 'off']);
        }

        return new JsonResponse(['success' => true]);
    }
}
