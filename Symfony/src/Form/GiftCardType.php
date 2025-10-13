<?php

namespace App\Form;

use App\Entity\Seller;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class GiftCardType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('quantity', IntegerType::class, [
                'mapped'     => false,
                'required'   => true,
                'label'      => 'Quantité',
                'row_attr'   => ['class' => 'mb-3'],
                'label_attr' => ['class' => 'form-label'],
                'attr'       => ['class' => 'form-control'],
            ])
            ->add('onSaleBy', EntityType::class, [
                'required'     => true,
                'class'        => Seller::class,
                'choice_label' => 'username',
                'label'        => 'Point de vente',
                'label_attr'   => ['class' => 'form-label'],
                'attr'         => ['class' => 'form-control'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([]);
    }
}
