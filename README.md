# Parcelamento.

Módulo de parcelamento para exibição no catálogo, esse módulo não influencia o funcionamento do checkout, é usado apenas para exibição de parcelas e de preço com desconto, a aplicação do desconto ou juros dependerá da forma de pagamento configurada.

Esse módulo utiliza a biblioteca jquery1.12.0 que já vem no magento 1.9.3.x
Caso você utilize outra versão, será preciso comentar ou alterar a chamada do jQuery dentro deo arquivo de layout
[https://github.com/contardi/installments/blob/master/app/design/base/default/layout/contardi/installments.xml#L5]
 
## Instalação

### Modgit: [https://github.com/jreinke/modgit](https://github.com/jreinke/modgit)

    $ cd /path/to/magento
    $ modgit init
    $ modgit add installments https://github.com/contardi/installments.git

### Instalação Manual:

- Baixe a [última versão](https://github.com/contardi/installments/archive/master.zip) do módulo.
- Descompacte o arquivo, copie e cole dentro da pasta de instalação do seu Magento.
- Limpe os caches.


### Configuração:

- Vá em `System > Configuration > Catalog`. Haverá uma nova aba chamada Installments (Parcelamento).

- Configure de acordo com a sua loja

- Para exibir o preço parcelado ou à vista, coloque o seguinte código no local que deseja exibir, dentro do arquivo de catálogo (listagem e view);  
    ***Preço parcelado:** `<?php echo $this->getChildHtml('preco_parcelado'); ?>`*  
    ***Preço à vista:** `<?php echo $this->getChildHtml('preco_avista'); ?>`*

- Na view do produto existe também outra opção de exibir todas as parcelas
    `<?php echo $this->getChildHtml('installments'); ?>`  
