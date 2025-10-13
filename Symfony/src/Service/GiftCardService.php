<?php

declare(strict_types=1);

namespace App\Service;

class GiftCardService
{
    public function __construct() {}

    public function generateCode(): string
    {
        $chars      = mb_str_split('ABCDEFGHJKLMNPQRSTUVWXYZ23456789');
        $partCount  = 4;
        $partLength = 4;

        $idParts = [];

        for ($i = 0; $i < $partCount; ++$i) {
            $idPart = [];

            for ($j = 0; $j < $partLength; ++$j) {
                $idPart[] = $chars[random_int(0, count($chars) - 1)];
            }

            $idParts[] = implode('', $idPart);
        }

        return implode('-', $idParts);
    }
}
