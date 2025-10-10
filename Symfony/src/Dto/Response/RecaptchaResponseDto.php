<?php

declare(strict_types=1);

namespace App\Dto\Cms\Response;

use Symfony\Component\Serializer\Attribute\SerializedName;

/** https://developers.google.com/recaptcha/docs/v3?hl=fr */
class RecaptchaResponseDto
{
    public bool $success = false; // whether this request was a valid reCAPTCHA token for your site
    public float $score = 0; // the score for this request (0.0 - 1.0)
    public ?string $action = null; // the action name for this request (important to verify)
    public ?\DateTime $challenge_ts = null; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    public string $hostname = ''; // the hostname of the site where the reCAPTCHA was solved

    #[SerializedName('error-codes')]
    public array $errorCodes = [];
}
