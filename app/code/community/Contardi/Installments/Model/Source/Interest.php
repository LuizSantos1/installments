<?php
/**
 *
 * INFORMAÇÕES SOBRE LICENÇA
 * Open Software License (OSL 3.0).
 * http://opensource.org/licenses/osl-3.0.php
 * DISCLAIMER
 *
 * @category      Contardi
 * @package       Contardi_Installments
 * @license       http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author        Thiago Contardu <thiago@contardi.com.br>
 */

class Contardi_Installments_Model_Source_Interest
{

    public function toOptionArray($vazio = true)
    {
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