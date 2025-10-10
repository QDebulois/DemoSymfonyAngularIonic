<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Admin;
use App\Entity\Customer;
use App\Entity\Redeemer;
use App\Entity\Seller;
use App\Enum\RoleEnum;
use Doctrine\ORM\EntityManagerInterface;

class RegisterService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function register(RoleEnum $role, string $username, string $password)
    {
        $user = match($role) {
            RoleEnum::ADMIN    => $this->makeAdmin($username, $password),
            RoleEnum::SELLER   => $this->makeSeller($username, $password),
            RoleEnum::REDEEMER => $this->makeRedeemer($username, $password),
            RoleEnum::CUSTOMER => $this->makeCustomer($username, $password),
        };

        $this->entityManager->persist($user);

        return $user;
    }

    private function makeAdmin(string $username, string $password): Admin
    {
        return (new Admin())
            ->setEmail($username)
            ->setPassword($password)
            ->setRoles([RoleEnum::ADMIN->value])
        ;
    }

    private function makeSeller(string $username, string $password): Seller
    {
        return (new Seller())
            ->setUsername($username)
            ->setPassword($password)
            ->setRoles([RoleEnum::SELLER->value])
        ;
    }

    private function makeRedeemer(string $username, string $password): Redeemer
    {
        return (new Redeemer())
            ->setUsername($username)
            ->setPassword($password)
            ->setRoles([RoleEnum::REDEEMER->value])
        ;
    }

    private function makeCustomer(string $username, string $password): Customer
    {
        return (new Customer())
            ->setEmail($username)
            ->setPassword($password)
            ->setRoles([RoleEnum::CUSTOMER->value])
        ;
    }
}
