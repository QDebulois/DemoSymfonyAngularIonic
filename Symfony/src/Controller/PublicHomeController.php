<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PublicHomeController extends AbstractController
{
    #[Route('/', name: 'public_home')]
    public function index(): Response
    {
        return $this->render('public/home/index.html.twig');
    }
}
