<?php

namespace App\Entity;

use App\Repository\CustomerRepository;
use App\Validator\Constraints as Validator;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[Validator\User]
class Customer implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

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
    #[ORM\OneToMany(targetEntity: GiftCard::class, mappedBy: 'boughtBy')]
    private Collection $giftCardsBought;

    /**
     * @var Collection<int, GiftCard>
     */
    #[ORM\OneToMany(targetEntity: GiftCard::class, mappedBy: 'associatedTo')]
    private Collection $giftCardsAssociated;

    public function __construct()
    {
        $this->giftCardsBought = new ArrayCollection();
        $this->giftCardsAssociated = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
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
    public function getGiftCardsBought(): Collection
    {
        return $this->giftCardsBought;
    }

    public function addGiftCardsBought(GiftCard $giftCardsBought): static
    {
        if (!$this->giftCardsBought->contains($giftCardsBought)) {
            $this->giftCardsBought->add($giftCardsBought);
            $giftCardsBought->setBoughtBy($this);
        }

        return $this;
    }

    public function removeGiftCardsBought(GiftCard $giftCardsBought): static
    {
        if ($this->giftCardsBought->removeElement($giftCardsBought)) {
            // set the owning side to null (unless already changed)
            if ($giftCardsBought->getBoughtBy() === $this) {
                $giftCardsBought->setBoughtBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, GiftCard>
     */
    public function getGiftCardsAssociated(): Collection
    {
        return $this->giftCardsAssociated;
    }

    public function addGiftCardsAssociated(GiftCard $giftCardsAssociated): static
    {
        if (!$this->giftCardsAssociated->contains($giftCardsAssociated)) {
            $this->giftCardsAssociated->add($giftCardsAssociated);
            $giftCardsAssociated->setAssociatedTo($this);
        }

        return $this;
    }

    public function removeGiftCardsAssociated(GiftCard $giftCardsAssociated): static
    {
        if ($this->giftCardsAssociated->removeElement($giftCardsAssociated)) {
            // set the owning side to null (unless already changed)
            if ($giftCardsAssociated->getAssociatedTo() === $this) {
                $giftCardsAssociated->setAssociatedTo(null);
            }
        }

        return $this;
    }
}
