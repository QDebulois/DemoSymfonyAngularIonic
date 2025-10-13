<?php

declare(strict_types=1);

namespace App\Voter;

use App\Entity\Admin;
use App\Entity\GiftCard;
use App\Enum\VoterEnum;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class QrCodeVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return
            VoterEnum::QRCODE->value === $attribute
            && $subject instanceof GiftCard;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        return
            $user instanceof Admin
            || ($user === $subject->getOnSaleBy() && null === $subject->getBoughtBy())
            || $user === $subject->getBoughtBy();
    }
}
