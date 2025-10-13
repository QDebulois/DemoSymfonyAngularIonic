<?php

namespace App\Entity;

use App\Repository\SellerRepository;
use App\Validator\Constraints as CustomAssert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: SellerRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
#[CustomAssert\User]
class Seller implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    /**
     * @var Collection<int, GiftCard>
     */
    #[ORM\OneToMany(targetEntity: GiftCard::class, mappedBy: 'onSaleBy')]
    private Collection $giftCards;

    public function __construct()
    {
        $this->giftCards = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    /**
     * @return Collection<int, GiftCard>
     */
    public function getGiftCards(): Collection
    {
        return $this->giftCards;
    }

    public function addGiftCard(GiftCard $giftCard): static
    {
        if (!$this->giftCards->contains($giftCard)) {
            $this->giftCards->add($giftCard);
            $giftCard->setOnSaleBy($this);
        }

        return $this;
    }

    public function removeGiftCard(GiftCard $giftCard): static
    {
        if ($this->giftCards->removeElement($giftCard)) {
            // set the owning side to null (unless already changed)
            if ($giftCard->getOnSaleBy() === $this) {
                $giftCard->setOnSaleBy(null);
            }
        }

        return $this;
    }
}
