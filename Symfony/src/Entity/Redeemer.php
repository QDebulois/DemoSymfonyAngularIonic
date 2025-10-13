<?php

namespace App\Entity;

use App\Repository\RedeemerRepository;
use App\Validator\Constraints as Validator;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: RedeemerRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
#[Validator\User]
class Redeemer implements UserInterface, PasswordAuthenticatedUserInterface
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
     * @var Collection<int, GiftCardUsage>
     */
    #[ORM\OneToMany(targetEntity: GiftCardUsage::class, mappedBy: 'usedTo', orphanRemoval: true)]
    private Collection $giftCardUsages;

    public function __construct()
    {
        $this->giftCardUsages = new ArrayCollection();
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
            $giftCardUsage->setUsedTo($this);
        }

        return $this;
    }

    public function removeGiftCardUsage(GiftCardUsage $giftCardUsage): static
    {
        if ($this->giftCardUsages->removeElement($giftCardUsage)) {
            // set the owning side to null (unless already changed)
            if ($giftCardUsage->getUsedTo() === $this) {
                $giftCardUsage->setUsedTo(null);
            }
        }

        return $this;
    }
}
