<?php
/**
 * Installments
 *
 * @category   Contardi
 * @package    Contardi_Installments
 * @author     Iago Cedran
 * @copyright  Copyright (c) 2016 BizCommerce
 */
class Contardi_Installments_Model_Source_Installment
{
    public function toOptionArray()
    {
        $attributes = Mage::getModel('catalog/product')->getResource()
            ->loadAllAttributes()
            ->getAttributesByCode();

        $result = array();

        $result[] = array(
            'value' => 0,
            'label' => Mage::helper('installments')->__('Menor')
        );

        $result[] = array(
            'value' => 1,
            'label' => Mage::helper('installments')->__('Maior')
        );

        return $result;
    }
}