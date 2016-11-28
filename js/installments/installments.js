(function ($) {
    $.installments = function (options) {

        this.defaults = {
            enabled: '0',
            juros: '0',
            descontoVista: '0',
            numparcelas: '1',
            numParcelasSemJuros: '1',
            showNumParcelasSemJuros: false,
            textDescontoVista: 'à vista no boleto',
            textSemJuros: 'sem juros',
            textRegularPrice: 'Por:',
            parcelaMinima: '',
            integradores: '',
            gateways: '',
            tipoJuros: 'simples',
            descontoPrimeiraParcela: '0',
            atributoDescontoVista: '',
            template: null
        };

        this.options = $.extend({},this.defaults,options);
    };

    $.installments.options = {};

    $.installments.prototype = {
        getPossibleInstallments: function(price, type){

            type = typeof type !== 'undefined' ? type : 'numparcelas';
            price = this._formatNumber(price);
            var numParcelas = this._formatNumber(this.options.numparcelas);
            var juros;
            var valorParcela;
            var valorTotal;
            var desconto;
            var installmentss = [];

            if(this._installmentsIsEnabled()){
                switch(type){
                    case "numparcelas":
                        numParcelas = this.options.numparcelas;
                        break;
                    case "gateways":
                        numParcelas = this.options.gateways;
                        break;
                    case "integradores":
                        numParcelas = this.options.integradores;
                        break;
                }

                numParcelas = numParcelas.trim();

                if(this.options.parcelaMinima > 0){
                    while(numParcelas > (price / this.options.parcelaMinima)) numParcelas--;
                }
                numParcelas = (numParcelas == 0) ? 1 : numParcelas;

                for(var i=1;i<=numParcelas;i++){

                    juros = (i <= this.options.numParcelasSemJuros) ? '' : this.options.juros;
                    valorParcela = (i <= this.options.numParcelasSemJuros)  ? (price / i).toFixed(2) : this.getPrecoParcela(price, i);
                    valorTotal = (valorParcela * i).toFixed(2);
                    desconto = 0;
                    if(i==1) {
                        valorParcela = this.getDescontoPrimeiraParcela(valorParcela);
                        valorTotal = (valorParcela * i).toFixed(2);
                        desconto = this.options.descontoPrimeiraParcela;
                    }
                    var parcela = {
                        valorTotal: valorTotal,
                        numParcelas: i,
                        valorParcelas: valorParcela,
                        juros: juros,
                        desconto: desconto
                    };
                    installmentss.push(parcela);
                }

            }

            return installmentss;
        },
        getDescontoPrimeiraParcela: function(valorParcela) {
            valorParcela = this._formatNumber(valorParcela);
            percentual = this._formatNumber(this.options.descontoPrimeiraParcela);
            desconto = percentual/100;
            if(desconto) valorParcela-=(valorParcela * desconto);
            return parseFloat(valorParcela).toFixed(2);
        },
        getInstallments: function(price, type){

            type = typeof type !== 'undefined' ? type : 'numparcelas';
            price = this._formatNumber(price);
            var numParcelas = this._formatNumber(this.options.numparcelas);
            var numParcelasSemJuros = this._formatNumber(this.options.numParcelasSemJuros);
            var vParcelaMinima = this._formatNumber(this.options.parcelaMinima);
            var juros;
            var valorParcela;
            var valorParcelaSemJuros;
            var valorTotal;

            switch(type){
                case "numparcelas":
                    numParcelas = this.options.numparcelas;
                    break;
                case "gateways":
                    numParcelas = this.options.gateways;
                    break;
                case "integradores":
                    numParcelas = this.options.integradores;
                    break;
            }

            if(vParcelaMinima > 0){
                if(vParcelaMinima > price/2)
                    return false;

                while(numParcelas > (price / vParcelaMinima) )
                    numParcelas--;

                while(numParcelasSemJuros > (price / vParcelaMinima) )
                    numParcelasSemJuros--;
            }

            juros = (numParcelas <= numParcelasSemJuros) ? '0' : this.options.juros;

            valorParcela = this.getPrecoParcela(price, numParcelas, juros);
            valorParcelaSemJuros = valorParcela;

            if(numParcelasSemJuros)
                valorParcelaSemJuros = price / numParcelasSemJuros;

            valorTotal = valorParcela * numParcelas;

            return {
                'valorTotal': valorTotal,
                'numParcelasSemJuros': numParcelasSemJuros,
                'valorParcelasSemJuros': valorParcelaSemJuros,
                'numParcelas': numParcelas,
                'valorParcelas': valorParcela,
                'juros': juros
            };
        },

        getPrecoParcela: function(price, numParcela, juros){

            juros = typeof juros !== 'undefined' ? juros : this.options.juros;
            juros = this._formatNumber(juros) / 100;
            price = this._formatNumber(price);

            var tipoJuros = (!this.options.tipoJuros ) ? 'simples' : this.options.tipoJuros;
            var valorParcela = 0;
            if(juros) {
                switch (tipoJuros) {
                    case 'price':
                        valorParcela = (price * ((juros * Math.pow((1 + juros),numParcela)) / (Math.pow((1 + juros),numParcela)-1))).toFixed(2);
                        //$valorParcela = round($price * (($juros * pow((1 + $juros),$numParcela)) / (pow((1 + $juros),$numParcela)-1)),2);
                        break;
                    case 'composto':
                        //M = C * (1 + i)^n
                        valorParcela = (price * Math.pow(1+juros, numParcela)) / numParcela;
                        break;
                    case 'simples':
                        //M = C * ( 1 + ( i * n ) )
                        valorParcela = (price * (1+(numParcela*juros))) / numParcela;
                        break;
                }
            } else {
                if(numParcela) valorParcela = price / numParcela;
            }

            return parseFloat(valorParcela).toFixed(2);
        },

        getPrecoVista: function (price, desconto) {
            price = this._formatNumber(price);
            desconto = typeof desconto !== 'undefined' ? desconto : this.options.descontoVista;
            desconto = this._formatNumber(desconto);
            if(! price || ! desconto)
                return false;

            return (price * (1-( desconto /100)));
        },
        _formatNumber:function(number){
            if(!number) return false;
            if(typeof number == 'string'){
                number = number.replace(/(<([^>]+)>)/ig,"");
                number = number.replace('%', '').trim();
                number = number.replace(',', '.').trim();
            }
            return parseFloat(number);
        },
        convertRealToFloat:function(price){
            if(!price) return false;
            if(typeof price == 'string'){
                price = price.trim();
                price = price.replace(/(<([^>]+)>)/ig,"");
                price = price.replace('R$', '');
                price = price.replace('.', '');
                price = price.replace(',', '.');
            }
            return parseFloat(price);
        },
        _installmentsIsEnabled:function(){
            return (this.options.enabled == 1);
        },
        getCents:function(price){
            if(price<0){
                price = Math.abs(price);
            }
            return Math.floor((price*100+0.5)%100);
        },
        updateInstallments: function(price) {

            price = this.getOptionsPrice(price);

            var selector = 'div.installments';

            if($j(selector).length) {
                var self = this;
                var parcelas = self.getPossibleInstallments(price);
                var list = '';
                if (parcelas != false){
                    $j(selector+' ul').html(list);
                    $j(parcelas).each(function (i, parcela) {
                        var numParcela = parseInt(parcela.numParcelas);
                        var valorParcela = formatCurrency(parcela.valorParcelas,self.options.template);
                        var valorTotal = formatCurrency(parcela.valorTotal,self.options.template);

                        //Lista da parcela
                        var classDesconto = (parcela.desconto) ? 'p-desconto' : '';
                        var classJuros = (parcela.juros) ? 'p-juros' : 'p-semjuros';
                        list += '<li class="parcela-'+numParcela+' '+classDesconto+' '+classJuros+'">';

                        //Parcela
                        list += '<div class="parcela"><span class="num">'+numParcela+'x</span> <span class="sep">de</span> <span class="valor">'+valorParcela+'</span></div>';

                        //Texto adicional
                        if(numParcela == 1 && (parcela.desconto > 0)){
                            list += '<div class="parcela"><span class="label">Desconto de</span> <span class="value">'+parcela.desconto+'</span></div>';
                        } else if(numParcela > 1 && parcela.juros){
                            list += '<div class="valor-total"><span class="label">Total</span> <span class="value">'+valorTotal+'</span></div>';
                        }

                        //Texto Juros
                        if(parcela.juros){
                            list += '<div class="juros"><span class="value">'+parcela.juros+'</span> <span class="am">a.m.</span></div>';
                        } else{
                            list += '<div class="s-juros"><span class="label">'+self.options.textSemJuros+'</span></div>';
                        }

                    });
                }
                $j(selector+' ul').append(list);
            }

        },
        updatePrecoRegular: function(price, productId) {
            var selector = 'span#product-price-'+productId;

            price = this.getOptionsPrice(price);

            if($j(selector).length && $j(selector).hasClass('regular-price')) {
                var self = this;
                var priceBlock = '';

                $j(selector).html(priceBlock);
                if(price){
                    priceBlock += '<span class="label"><span>'+self.options.textRegularPrice+'</span></span> ';
                    priceBlock += '<span class="price"><span>'+formatCurrency(price,self.options.template)+'</span></span> ';
                }

                $j(selector).append(priceBlock);
            }

        },
        updatePrecoDe: function(price, productId) {
            var selector = 'span#old-price-'+productId;
            var difference = this.getOldPrice(price);

            price = this.getOptionsPrice(price);

            if ($j(selector).length) {
                var self = this;
                var priceBlock = '';

                $j(selector).html(priceBlock);

                if (price) {
                    var oldPrice = price + difference;
                    priceBlock += '<span>'+formatCurrency(oldPrice, self.options.template)+'</span>';
                }

                $j(selector).html(priceBlock);
            }
        },
        updatePrecoPor: function(price, productId) {
            var selector = 'span#product-price-'+productId;

            price = this.getOptionsPrice(price);

            if($j(selector).length && !$j(selector).hasClass('regular-price')) {
                var self = this;
                var priceBlock = '';

                $j(selector).html(priceBlock);
                if(price){
                    priceBlock += '<span>'+formatCurrency(price,self.options.template)+'</span>';
                }

                $j(selector).html(priceBlock);
            }

        },
        updatePrecoBundle: function(price, productId) {
            var selector = 'span#product-price-'+productId;

            price = this.getOptionsPrice(price);

            if($j(selector).length && $j(selector).parent().hasClass('full-product-price')) {
                var self = this;
                var priceBlock = '';

                $j(selector).html(priceBlock);
                if(price){
                    priceBlock += '<span>'+formatCurrency(price,self.options.template)+'</span>';
                }

                $j(selector).html(priceBlock);
            }

        },
        updatePrecoVista: function(price, productId) {
            var selector = 'div#price-box-avista-'+productId;

            price = this.getOptionsPrice(price);

            if($j(selector).length) {
                var self = this;
                var priceBlock = '';

                $j(selector).html(priceBlock);
                var precoVista = self.getPrecoVista(price);

                if(precoVista){
                    priceBlock += '<span class="label"><span>'+self.options.textDescontoVista+'</span></span> ';
                    priceBlock += '<span class="price"><span>'+formatCurrency(precoVista,self.options.template)+'</span></span> ';
                }

                $j(selector).html(priceBlock);
            }

        },
        updatePrecoParcelado: function(price, productId) {
            var selector = 'div#price-box-parcelado-'+productId;

            price = this.getOptionsPrice(price);

            if($j(selector).length) {
                var self = this;
                var priceBlock = '';

                $j(selector).html(priceBlock);
                var precoParcelado = self.getInstallments(price);

                if(precoParcelado.numParcelas > 1){

                    if(precoParcelado.numParcelasSemJuros < precoParcelado.numParcelas && precoParcelado.juros && self.options.showNumParcelasSemJuros == true){
                        priceBlock += '<div class="preco-parcelado-sem-juros"> ';
                        priceBlock += '     <span class="upto"><span>em até</span></span> ';
                        priceBlock += '     <span class="num"><span>'+precoParcelado.numParcelasSemJuros+'x</span></span> ';
                        priceBlock += '     <span class="de"><span>de</span></span> ';
                        priceBlock += '     <span class="value"><span>'+formatCurrency(precoParcelado.valorParcelasSemJuros,self.options.template)+'</span></span> ';
                        priceBlock += '     <span class="s-juros"><span>'+self.options.textSemJuros+'</span></span>';
                        priceBlock += '</div>';
                    }

                    priceBlock += '<div class="preco-parcelado">';
                    priceBlock += '     <span class="or"><span>ou</span></span> ';
                    priceBlock += '     <span class="num"><span>'+precoParcelado.numParcelas+'x</span></span> ';
                    priceBlock += '     <span class="de"><span>de</span></span>';
                    priceBlock += '     <span class="value"><span>'+formatCurrency(precoParcelado.valorParcelas,self.options.template)+'</span></span> ';

                    if(parseInt(precoParcelado.juros) > 0){
                        priceBlock += ' <span class="juros"><span class="value"><span>'+precoParcelado.juros+'</span></span> <span class="am"><span>a.m.</span></span></span> ';
                    } else {
                        priceBlock += ' <span class="s-juros"><span>'+self.options.textSemJuros+'</span></span> ';
                    }
                    priceBlock += '</div>';
                }

                $j(selector).html(priceBlock);
            }

        },
        getOptionsPrice: function(price){
            if(typeof optionsPrice != "undefined"){
                try {
                    $j.each(optionsPrice.customPrices,function (i, opt) {
                        if(opt.price){
                            price += opt.price;
                        }
                    });
                } catch (e){

                }
            }

            return price;
        },
        getOldPrice: function(){
            difference = 0;
            if(typeof optionsPrice != "undefined"){
                try {
                    var oldPrice = optionsPrice.productOldPrice;
                    var price = optionsPrice.productPrice;
                    difference = oldPrice - price;
                } catch (e){

                }
            }

            return difference;
        }

    };

}(jQuery));


Math.roundToPrecision = function (value, precision, mode) {
    //  discuss at: http://locutus.io/php/round/
    var m, f, isHalf, sgn; // helper variables
    // making sure precision is integer
    precision |= 0;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);

    if (isHalf) {
        switch (mode) {
            case 'PHP_ROUND_HALF_DOWN':
                // rounds .5 toward zero
                value = f + (sgn < 0);
                break;
            case 'PHP_ROUND_HALF_EVEN':
                // rouds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case 'PHP_ROUND_HALF_ODD':
                // rounds .5 towards the next odd integer
                value = f + !(f % 2);
                break;
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0);
        }
    }

    return (isHalf ? value : Math.round(value)) / m;
};