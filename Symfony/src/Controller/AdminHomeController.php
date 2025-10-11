<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/')]
final class AdminHomeController extends AbstractController
{
    #[Route('', name: 'app_admin_home')]
    public function index(): Response
    {
        return $this->render('back/home/index.html.twig');
    }
}
