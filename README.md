# Parcelamento.
Payment method module KOIN (v1.1.1) - Magento 1.7.x - 1.9.x


Módulo de parcelamento para exibição no catálogo, esse módulo não influencia o funcionamento do checkout, é usado apenas para exibição de parcelas e de preço com desconto, a aplicação do desconto ou juros dependerá da forma de pagamento configurada.

 
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

- Na view do produto existe mais duas opções.  
**a)** Para atualizar os preços ao mudar de opção do produto configurável ou opção customizada, deve-se chamar na view do produto
    Para exibir todas as parcelas do preço parcelado:  
    `<?php echo $this->getChildHtml('installments'); ?>`  
**b)** Scrips que atualização as opções customizadas e configuráveis:  
    `<?php echo $this->getChildHtml('additional_scripts'); ?>`
