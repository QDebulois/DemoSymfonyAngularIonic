<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use App\Entity\Admin;
use App\Entity\Customer;
use App\Entity\Redeemer;
use App\Entity\Seller;
use App\Repository\AdminRepository;
use App\Repository\CustomerRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class UserValidator extends ConstraintValidator
{
    const SELLER_PREFIX   = 'pv_';
    const REDEEMER_PREFIX = 'pu_';

    public function __construct(
        private AdminRepository $adminRepository,
        private CustomerRepository $customerRepository,
    ) {}

    public function validate(mixed $user, Constraint $constraint): void
    {
        match(true) {
            $user instanceof Admin    => $this->validateAdmin($user, $constraint),
            $user instanceof Seller   => $this->validateSeller($user, $constraint),
            $user instanceof Redeemer => $this->validateRedeemer($user, $constraint),
            $user instanceof Customer => $this->validateCustomer($user, $constraint),
        };
    }

    private function validateAdmin(Admin $user, Constraint $constraint): void
    {
        $this->validateEmail($user->getEmail(), $constraint);

        if ($this->adminRepository->findOneBy(['email' => $user->getEmail()])) {
            $this->context
                ->buildViolation($constraint->message)
                ->setParameter('{{ message }}', "L'adresse email '{$user->getEmail()}' est deja utilisée")
                ->addViolation()
            ;
        }
    }

    private function validateSeller(Seller $user, Constraint $constraint): void
    {
        $this->validatePrefix($user->getUsername(), self::SELLER_PREFIX, $constraint);
    }

    private function validateRedeemer(Redeemer $user, Constraint $constraint): void
    {
        $this->validatePrefix($user->getUsername(), self::REDEEMER_PREFIX, $constraint);
    }

    private function validateCustomer(Customer $user, Constraint $constraint): void
    {
        $this->validateEmail($user->getEmail(), $constraint);

        if ($this->customerRepository->findOneBy(['email' => $user->getEmail()])) {
            $this->context
                ->buildViolation($constraint->message)
                ->setParameter('{{ message }}', "L'adresse email '{$user->getEmail()}' est deja utilisée")
                ->addViolation()
            ;
        }
    }

    private function validateEmail(string $email, Constraint $constraint): void
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->context
                ->buildViolation($constraint->message)
                ->setParameter('{{ message }}', "L'adresse email '{$email}' n'est pas valide")
                ->addViolation()
            ;
        }
    }

    private function validatePrefix(string $username, string $prefix, Constraint $constraint): void
    {
        if (!str_starts_with($username, $prefix)) {
            $this->context
                ->buildViolation($constraint->message)
                ->setParameter('{{ message }}', "L'identifiant '{$username}' n'est pas valide, il doit commencer par '{$prefix}'")
                ->addViolation()
            ;
        }
    }
}
