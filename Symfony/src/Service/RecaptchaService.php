<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\Cms\Response\RecaptchaResponseDto;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class RecaptchaService
{
    private HttpClientInterface $http;
    private string $url     = 'https://www.google.com/recaptcha/api/siteverify';
    private float $scoreMin = 0.3;

    public function __construct(
        private LoggerInterface $logger,
        private ParameterBagInterface $parameterBag,
        private SerializerInterface $serializer,
    ) {
        $this->http = HttpClient::create();
    }

    public function verify(?string $recaptcha): bool
    {
        if (!$recaptcha) {
            $this->logger->error('Recaptcha is empty');

            return false;
        }

        $response = $this->http->request(
            'GET',
            $this->url,
            [
                'query' => [
                    'secret'   => $this->parameterBag->get('app.google.recaptcha.private'),
                    'response' => $recaptcha,
                ],
            ],
        );

        /** @var RecaptchaResponseDto $recaptchaResponse */
        $recaptchaResponse = $this->serializer->deserialize(
            $response->getContent(),
            RecaptchaResponseDto::class,
            'json',
        );

        if ($recaptchaResponse->success && $recaptchaResponse->score >= $this->scoreMin) {
            return true;
        }

        $this->logger->error('error reCAPTCHA', ['response' => json_encode($recaptchaResponse)]);

        return false;
    }
}
