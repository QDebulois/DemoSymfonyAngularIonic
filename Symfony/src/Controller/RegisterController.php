<?php

declare(strict_types=1);

namespace App\Controller;

use App\Form\RegisterFormType;
use App\Service\RegisterService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/register')]
final class RegisterController extends AbstractController
{
    #[Route('', name: 'app_register')]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        RegisterService $registerService,
    ): Response {
        $form = $this->createForm(RegisterFormType::class);

        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return $this->render('register/index.html.twig', ['form' => $form->createView()]);
        }

        if (!$form->isValid()) {
            return $this->render('register/index.html.twig', ['form' => $form->createView()]);
        }

        $user = $registerService->register(
            $form->get('role')->getData(),
            $form->get('username')->getData(),
            $form->get('password')->getData(),
        );

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            foreach ($errors as $error) {
                $form->addError(new FormError($error->getMessage()));
            }

            return $this->render('register/index.html.twig', ['form' => $form->createView()]);
        }

        $entityManager->flush();

        return $this->render('register/index.html.twig', ['form' => $form->createView()]);
    }
}
