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

class Contardi_Installments_Helper_Data extends Mage_Core_Helper_Abstract
{
    public $enabled = false;
    public $juros = false;
    public $descontoVista = false;
    public $numparcelas = false;
    public $numParcelasSemJuros = false;
    public $parcelaMinima = false;
    public $integradores = false;
    public $gateways = false;
    public $tipoJuros = false;
    public $descontoPrimeiraParcela = false;
    public $atributoDescontoVista = false;

    public function __construct()
    {
        $this->enabled = Mage::getStoreConfig('installments/settings/enabled');
        $this->juros = Mage::getStoreConfig('installments/settings/juros');
        $this->descontoVista = Mage::getStoreConfig('installments/settings/desconto_vista');
        $this->numparcelas = Mage::getStoreConfig('installments/settings/numparcelas');
        $this->numParcelasSemJuros = Mage::getStoreConfig('installments/settings/numparcelas_sem_juros');
        $this->parcelaMinima = Mage::getStoreConfig('installments/settings/parcela_minima');
        $this->integradores = Mage::getStoreConfig('installments/settings/integradores');
        $this->gateways = Mage::getStoreConfig('installments/settings/gateways');
        $this->tipoJuros = Mage::getStoreConfig('installments/settings/tipo_juros');
        $this->descontoPrimeiraParcela = Mage::getStoreConfig('installments/settings/desconto_primeira_parcela');
        $this->atributoDescontoVista = Mage::getStoreConfig('installments/settings/atributo_desconto_vista');
    }

    public function getPossibleInstallments($price = null, $type = 'numparcelas')
    {
        if (
            is_null($price)
            || (!$this->isEnabled())
            || !(in_array($type, array('numparcelas', 'gateways', 'integradores')) && is_string($type))
        ) {
            return false;
        }
        $price = (float)str_replace(',', '.', $price);
        $numParcelas = (int)$this->$type;

        if (($vParcelaMinimo = $this->parcelaMinima) > 0) {
            while ($numParcelas > ($price / $vParcelaMinimo)) $numParcelas--;
        }
        $installmentss = array();
        if ($price > 0) {
            $numParcelas = ($numParcelas == 0) ? 1 : $numParcelas;
            for ($i = 1; $i <= $numParcelas; $i++) {
                $jurosText = ($i <= $this->numParcelasSemJuros) ? '' : $this->juros;
                $valorParcela = ($i <= $this->numParcelasSemJuros) ? ($price / $i) : $this->getPrecoParcela($price, $i);
                $valorTotal = $valorParcela * $i;
                $desconto = 0;
                if ($i == 1) {
                    $valorParcela = $this->getDescontoPrimeiraParcela($valorParcela);
                    $valorTotal = $valorParcela * $i;
                    $desconto = $this->descontoPrimeiraParcela;
                }
                $installmentss[] = array(
                    'valorTotal' => $valorTotal,
                    'numParcelas' => $i,
                    'valorParcelas' => $valorParcela,
                    'juros' => $jurosText,
                    'desconto' => $desconto
                );
            }
        }
        return $installmentss;
    }

    public function getDescontoPrimeiraParcela($valorParcela)
    {
        $percentual = $this->descontoPrimeiraParcela;
        $desconto = (float)(str_ireplace(',', '.', $percentual) / 100);
        if ($desconto) $valorParcela -= ($valorParcela * $desconto);
        return $valorParcela;
    }

    protected function _getSession()
    {
        if (Mage::app()->getStore()->isAdmin()) {
            return Mage::getSingleton('adminhtml/session_quote');
        } else {
            return Mage::getSingleton('checkout/session');
        }
    }

    public function getInstallments($price = null, $type = 'numparcelas')
    {
        if (is_null($price)
            || (!$this->isEnabled())
            || (!(
                in_array($type, array('numparcelas', 'gateways', 'integradores'))
                && is_string($type)
            )
            )
        ) return false;

        $price = (float)str_replace(',', '.', $price);
        $numParcelas = (int)$this->$type;

        $numParcelasSemJuros = (int)$this->numParcelasSemJuros;
        $vParcelaMinimo = $this->parcelaMinima;

        if ($vParcelaMinimo > 0) {
            if ($vParcelaMinimo > $price / 2)
                return false;

            while ($numParcelas > ($price / $vParcelaMinimo))
                $numParcelas--;

            while ($numParcelasSemJuros > ($price / $vParcelaMinimo))
                $numParcelasSemJuros--;
        }
        $juros = ($numParcelas <= $numParcelasSemJuros) ? '' : $this->juros;

        $valorParcela = $this->getPrecoParcela($price, $numParcelas, $juros);
        $valorParcelaSemJuros = $valorParcela;

        if ($numParcelasSemJuros)
            $valorParcelaSemJuros = $price / $numParcelasSemJuros;

        $valorTotal = $valorParcela * $numParcelas;

        return array(
            'valorTotal' => $valorTotal,
            'numParcelasSemJuros' => $numParcelasSemJuros,
            'valorParcelasSemJuros' => $valorParcelaSemJuros,
            'numParcelas' => $numParcelas,
            'valorParcelas' => $valorParcela,
            'juros' => $juros,
        );
    }

    public function getPrecoVista($price = null, $format = true, $product = null)
    {
        $price = (float)str_replace(',', '.', $price);
        $desconto = $this->getPercentualDescontoVista($product);
        $desconto = (float)str_ireplace(',', '.', $desconto);
        if (is_null($price) || (!$desconto)) return false;
        $precoAVista = ($price * (1 - ((float)$desconto / 100)));
        return ($format) ? Mage::helper('core')->currency($precoAVista, true, false) : $precoAVista;
    }

    public function getPercentualDescontoVista($product = null, $outputFormat = "formated")
    {
        $percentual = 0;
        if ($this->atributoDescontoVista && $product && $product->getId()) {
            /** @var $product Mage_Catalog_Model_Product */
            $atributo = $product->getResource()->getAttribute($this->atributoDescontoVista);
            if ($atributo) {
                $type = $atributo->getFrontend()->getInputType();
                if ($type == 'multiselect' || $type == 'select') {
                    $percentual = $product->getAttributeText($this->atributoDescontoVista);
                } else {
                    $percentual = $product->getData($this->atributoDescontoVista);
                }
            }
        }

        $percentual = $percentual ? $percentual : $this->descontoVista;
        if ($outputFormat == "decimal") {
            $percentual = str_replace('%', '', $percentual);
        }

        return $percentual;
    }

    public function isEnabled()
    {
        return $this->enabled;
    }

    public function getPrecoParcela($price, $numParcela, $juros = null)
    {
        if ($juros === null) $juros = $this->juros;
        $juros = (float)(str_replace(',', '.', $juros)) / 100;
        $price = (float)str_replace(',', '.', $price);
        $tipoJuros = (!$this->tipoJuros) ? 'price' : $this->tipoJuros;
        $valorParcela = 0;
        if ($juros) {
            switch ($tipoJuros) {
                case 'price':
                    $valorParcela = round($price * (($juros * pow((1 + $juros), $numParcela)) / (pow((1 + $juros), $numParcela) - 1)), 2);
                    break;
                case 'composto':
                    //M = C * (1 + i)^n
                    $valorParcela = ($price * pow(1 + $juros, $numParcela)) / $numParcela;
                    break;
                case 'simples':
                    //M = C * ( 1 + ( i * n ) )
                    $valorParcela = ($price * (1 + ($numParcela * $juros))) / $numParcela;
            }
        } else {
            if ($numParcela) $valorParcela = $price / $numParcela;
        }
        return $valorParcela;
    }
}
