<?php

declare(strict_types=1);

namespace App\Service;

use Skies\QRcodeBundle\Generator\Generator;

class QrCodeService
{
    public function __construct() {}

    public function generatePngBase64(string $data): string
    {
        $options = [
            'code'   => $data,
            'type'   => 'qrcode',
            'format' => 'png',
        ];

        return (new Generator())->generate($options);
    }
}
