<?php

namespace App\Entity;

use App\Repository\GiftCardRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GiftCardRepository::class)]
class GiftCard
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $code = null;

    #[ORM\Column]
    private ?int $initialAmount = null;

    #[ORM\Column]
    private ?int $remainingAmount = null;

    #[ORM\ManyToOne(inversedBy: 'giftCards')]
    private ?Seller $onSaleBy = null;

    #[ORM\ManyToOne(inversedBy: 'giftCards')]
    private ?Customer $boughtBy = null;

    /**
     * @var Collection<int, GiftCardUsage>
     */
    #[ORM\OneToMany(targetEntity: GiftCardUsage::class, mappedBy: 'giftCard', orphanRemoval: true)]
    private Collection $giftCardUsages;

    public function __construct()
    {
        $this->giftCardUsages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getInitialAmount(): ?int
    {
        return $this->initialAmount;
    }

    public function setInitialAmount(int $initialAmount): static
    {
        $this->initialAmount = $initialAmount;

        return $this;
    }

    public function getRemainingAmount(): ?int
    {
        return $this->remainingAmount;
    }

    public function setRemainingAmount(int $remainingAmount): static
    {
        $this->remainingAmount = $remainingAmount;

        return $this;
    }

    public function getOnSaleBy(): ?Seller
    {
        return $this->onSaleBy;
    }

    public function setOnSaleBy(?Seller $onSaleBy): static
    {
        $this->onSaleBy = $onSaleBy;

        return $this;
    }

    public function getBoughtBy(): ?Customer
    {
        return $this->boughtBy;
    }

    public function setBoughtBy(?Customer $boughtBy): static
    {
        $this->boughtBy = $boughtBy;

        return $this;
    }

    /**
     * @return Collection<int, GiftCardUsage>
     */
    public function getGiftCardUsages(): Collection
    {
        return $this->giftCardUsages;
    }

    public function addGiftCardUsage(GiftCardUsage $giftCardUsage): static
    {
        if (!$this->giftCardUsages->contains($giftCardUsage)) {
            $this->giftCardUsages->add($giftCardUsage);
            $giftCardUsage->setGiftCard($this);
        }

        return $this;
    }

    public function removeGiftCardUsage(GiftCardUsage $giftCardUsage): static
    {
        if ($this->giftCardUsages->removeElement($giftCardUsage)) {
            // set the owning side to null (unless already changed)
            if ($giftCardUsage->getGiftCard() === $this) {
                $giftCardUsage->setGiftCard(null);
            }
        }

        return $this;
    }
}
