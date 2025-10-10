<?php

namespace App\Form;

use App\Enum\RoleEnum;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RegisterFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('role', EnumType::class, [
                'class'        => RoleEnum::class,
                'label'        => 'Rôle',
                'choice_label' => fn (RoleEnum $role) => $role->label(),
                'row_attr'     => ['class' => 'mb-3'],
                'label_attr'   => ['class' => 'form-label'],
                'attr'         => ['class' => 'form-control'],
            ])
            ->add('username', TextType::class, [
                'label'      => 'Email ou Identifiant',
                'row_attr'   => ['class' => 'mb-3'],
                'label_attr' => ['class' => 'form-label'],
                'attr'       => ['class' => 'form-control'],
            ])
            ->add('password', RepeatedType::class, [
                'type'          => PasswordType::class,
                'label'         => 'Mot de passe',
                'first_options' => [
                    'label'      => 'Mot de passe',
                    'row_attr'   => ['class' => 'mb-3'],
                    'label_attr' => ['class' => 'form-label'],
                    'attr'       => ['class' => 'form-control'],
                ],
                'second_options' => [
                    'label'      => 'Confirmer le mot de passe',
                    'row_attr'   => ['class' => 'mb-3'],
                    'label_attr' => ['class' => 'form-label'],
                    'attr'       => ['class' => 'form-control'],
                ],
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'S\'inscrire',
                'attr'  => ['class' => 'btn btn-primary'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
