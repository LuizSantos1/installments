<?php

class Contardi_Installments_Model_Source_Juros{

    public function toOptionArray($vazio = true){
        $option[] = array(
            'label' => Mage::helper('adminhtml')->__('Tabela Price'),
            'value' => 'price'
        );
        $option[] = array(
            'label' => Mage::helper('adminhtml')->__('Juros Composto'),
            'value' => 'composto'
        );
        $option[] = array(
            'label' => Mage::helper('adminhtml')->__('Juros Simples'),
            'value' => 'simples'
        );
		
		return $option;
    }
}