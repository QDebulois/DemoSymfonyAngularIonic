<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Admin;
use App\Entity\Customer;
use App\Entity\Redeemer;
use App\Entity\Seller;
use App\Enum\RoleEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
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

    private function makeAdmin(string $email, string $password): Admin
    {
        $admin = (new Admin())
            ->setEmail($email)
            ->setRoles([RoleEnum::ADMIN->value])
        ;

        $admin->setPassword($this->passwordHasher->hashPassword($admin, $password));

        return $admin;
    }

    private function makeSeller(string $username, string $password): Seller
    {
        $seller = (new Seller())
            ->setUsername($username)
            ->setRoles([RoleEnum::SELLER->value])
        ;

        $seller->setPassword($this->passwordHasher->hashPassword($seller, $password));

        return $seller;
    }

    private function makeRedeemer(string $username, string $password): Redeemer
    {
        $redeemer = (new Redeemer())
            ->setUsername($username)
            ->setRoles([RoleEnum::REDEEMER->value])
        ;

        $redeemer->setPassword($this->passwordHasher->hashPassword($redeemer, $password));

        return $redeemer;
    }

    private function makeCustomer(string $email, string $password): Customer
    {
        $customer = (new Customer())
            ->setEmail($email)
            ->setRoles([RoleEnum::CUSTOMER->value])
        ;

        $customer->setPassword($this->passwordHasher->hashPassword($customer, $password));

        return $customer;
    }
}
