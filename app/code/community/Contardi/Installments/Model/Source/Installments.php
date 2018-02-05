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

class Contardi_Installments_Model_Source_Installments
{

    public function toOptionArray($vazio = true)
    {
        $option = array();
        if ($vazio) {
            $option[] = array(
                'label' => Mage::helper('adminhtml')->__('-- Selecione o número de parcelas --'),
                'value' => '1'
            );
        }
        for ($i = 1; $i <= 24; $i++) {
            $option[] = array(
                'value' => $i,
                'label' => ($i . 'x')
            );
        }

        return $option;
    }
}