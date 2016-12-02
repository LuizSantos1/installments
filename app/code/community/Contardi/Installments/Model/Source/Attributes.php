<?php
class Contardi_Installments_Model_Source_Attributes {

    public function toOptionArray() {
        $attributes = Mage::getModel('catalog/product')->getResource()
            ->loadAllAttributes()
            ->getAttributesByCode();

        $result = array();
        $result[] = array(
            'value' => '',
            'label' => Mage::helper('adminhtml')->__('-- Please Select --')
        );
        foreach ($attributes as $attribute) {
            /* @var $attribute Mage_Catalog_Model_Resource_Eav_Attribute */
            if ($attribute->getId() && $attribute->getIsUserDefined()) {
                $result[] = array(
                    'value' => $attribute->getAttributeCode(),
                    'label' => $attribute->getFrontend()->getLabel(),
                );
            }
        }
        return $result;
    }

}