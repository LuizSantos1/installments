<?php

class Contardi_Installments_Model_Source_Parcelas{

    public function toOptionArray($vazio = true){
        $option = array();
        if ($vazio) {
            $option[] = array(
                'label' => Mage::helper('adminhtml')->__('-- Selecione o número de parcelas --'),
                'value' => '1'
            );
        }
		for ($i = 1; $i <= 24; $i++) {
				$option[] = array(
				'value'=>$i,
				'label'=>($i.'x')
				);
		}
		
		return $option;
    }
}