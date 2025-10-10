<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

#[\Attribute()]
class User extends Constraint
{
    public string $message = '{{ message }}';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}

