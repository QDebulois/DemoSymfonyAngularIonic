<?php

namespace App\Entity;

use App\Repository\GiftCardUsageRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GiftCardUsageRepository::class)]
class GiftCardUsage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'giftCardUsages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?GiftCard $giftCard = null;

    #[ORM\ManyToOne(inversedBy: 'giftCardUsages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Redeemer $usedTo = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $usedAt = null;

    #[ORM\Column]
    private ?int $usedAmount = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsedAt(): ?\DateTimeImmutable
    {
        return $this->usedAt;
    }

    public function setUsedAt(\DateTimeImmutable $usedAt): static
    {
        $this->usedAt = $usedAt;

        return $this;
    }

    public function getUsedAmount(): ?int
    {
        return $this->usedAmount;
    }

    public function setUsedAmount(int $usedAmount): static
    {
        $this->usedAmount = $usedAmount;

        return $this;
    }

    public function getGiftCard(): ?GiftCard
    {
        return $this->giftCard;
    }

    public function setGiftCard(?GiftCard $giftCard): static
    {
        $this->giftCard = $giftCard;

        return $this;
    }

    public function getUsedTo(): ?Redeemer
    {
        return $this->usedTo;
    }

    public function setUsedTo(?Redeemer $usedTo): static
    {
        $this->usedTo = $usedTo;

        return $this;
    }
}
