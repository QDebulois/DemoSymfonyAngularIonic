<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\Admin;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AdminChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof Admin) {
            return;
        }

        // if (!$user->isActive()) {
        //     throw new CustomUserMessageAccountStatusException('Votre compte est désactivé.');
        // }
    }

    public function checkPostAuth(UserInterface $user): void {}
}
