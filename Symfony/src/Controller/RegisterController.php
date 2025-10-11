<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Admin;
use App\Entity\Customer;
use App\Form\RegisterFormType;
use App\Security\AdminAuthenticator;
use App\Security\CustomerAuthenticator;
use App\Service\RegisterService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Bundle\SecurityBundle\SecurityBundle;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class RegisterController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(
        Request $request,
        Security $security,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        RegisterService $registerService,
    ): Response {
        $form = $this->createForm(RegisterFormType::class);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
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

                return $this->render('front/register/index.html.twig', ['form' => $form->createView()]);
            }

            $entityManager->flush();

            if ($user instanceof Admin) {
                $security->login($user, AdminAuthenticator::class, 'admin');
            }

            if ($user instanceof Customer) {
                $security->login($user, CustomerAuthenticator::class, 'customer');
            }

            return $this->redirectToRoute('app_home', ['msg' => "Votre compte à bien été créé."]);
        }

        return $this->render('front/register/index.html.twig', ['form' => $form->createView()]);
    }
}
