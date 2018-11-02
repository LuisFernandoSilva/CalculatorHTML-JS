class CalcController {

    constructor() {

        this._displayElView = document.querySelector("#display");
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];


        this.init();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    get displayCalc() {
        return this._displayElView.innerHTML;
    }


    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayElView.innerHTML = value;
    }

    /**
     * classe que pega a ultima operaçao
     */
    getLastOperation() {
            return this._operation[this._operation.length - 1];
        }
        /**
         * Classe que seta o ultimo elemento do array
         * @param {*} value 
         */
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    /**
     * Classe que pega o ultimo elemento do array por padrao o ultimo operador e passado como verdadeiro
     * @param {*} isOperator 
     */
    getLastItem(isOperator = true) {

            let lastItem;
            for (let i = this._operation.length - 1; i >= 0; i--) {
                //verfica o ultimo operador se for true ou numero se for false e o salva na posiçao
                if (this.isOperator(this._operation[i]) == isOperator) {
                    lastItem = this._operation[i];
                    break;
                }
            }
            //nao encontrou o lastitem mantem o ultimo operador
            if (!lastItem) {
                //operador e igual a true entao vem o ultimo operador senao vem o ultimo numero
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
            }
            return lastItem;

        }
        /**
         * Classe que seta o ultimo numero no display
         */
    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    setError() {
            this.displayCalc = "Error";
        }
        /**
         * Classe que faz o calculo.
         */
    getResult() {
        try {
            return eval(this._operation.join("")); //controrio do split tira os separadores e trasnforma tudo em uma string
        } catch (e) {
            setTimeout(() => {
                this.setError();
            }, 1);

        }
    }

    //faz a colagem do que foi selecionado    
    pasteFromToClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        });
    }

    //cria um input na tela para fazer o copia e colar
    copyToClipboard() {

            let input = document.createElement('input');
            input.value = this.displayCalc;
            document.body.appendChild(input);
            input.select();

            document.execCommand('Copy');
            //assim q terminar de copiar remove da tela
            input.remove();


        }
        /**
         * classe que seta todos os elementos 
         */
    clearAll() {
        this._operation = [];
        this._lastNumber = 0;
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    /**
     * Classe que tira a ultima posiçao do array e seta a tela pro ultimo numero
     */
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    /**
     * classe que retorna a verificaçao se tem alguma operação
     * @param {*} value 
     */
    isOperator(value) {

            return (['+', '-', '/', '*', '%'].indexOf(value) > -1);

        }
        /**
         * Classe que adiciona um elemento de operaçao ao array de calculo,
         *  se ele for maior que 3 elementos chama a funçao de calculo
         * @param {*} value 
         */
    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {

            this.calc();
        } else {}
    }

    /**
     * classe que adiciona um ponto junto ao numero e se ele for zero tambem
     */
    addDot() {
        let lastOperation = this.getLastOperation();
        //verifica se tem ja um ponto
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        //se ele for um operador ou nao existir, coloca o zero e o ponto
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');

        } else {
            //senao pega o ultimo e concatena um ponto
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    /**
     * classe que ao passar um valor seja ele uma operaçao o separa em elementos distintos 
     * 
     * @param {*} value 
     */

    addOperation(value) {

            //funcao isNan retorna bollean se nao for um numero retorna true
            if (isNaN(this.getLastOperation())) {

                if (this.isOperator(value)) {

                    this.setLastOperation(value); //faz a troca do ultimo operador

                } else {

                    this.pushOperation(value);
                    this.setLastNumberToDisplay();

                }

            } else {

                if (this.isOperator(value)) {

                    this.pushOperation(value);

                } else {

                    let newValue = this.getLastOperation().toString() + value.toString(); //converte o ultimo valor numerico para concatenar os numeros
                    this.setLastOperation(newValue);

                    this.setLastNumberToDisplay();
                }


            }

        }
        /**
         * classe que faz o calculo e joga o resultado na tela, faz o calculo manipulando um array substituindo 
         * sempre o ultimo numero colocado ou operador. se a variavel for porcentagem faz o calculo.
         */

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem(true); //verifica o ultimo operador
        //a variavel e menor que tres elementos 
        if (this._operation.length < 3) {
            let firstItem = this._operation[0]; //primeiro item do array e 0
            this._operation = [firstItem, this._lastOperator, this._lastNumber]; //o array fica o primeiro, o ultimo operador e o numero
        }
        //tira o ultimo se for maior que 3 itens
        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last == '%') {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            //se for diferente de vazio
            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();

    }

    execBtn(value) {

        switch (value) {
            case 'ac btn-others col-sm':
                this.clearAll();
                break;
            case 'ce btn-others col-sm':
                this.clearEntry();
                break;
            case 'soma btn-others col-sm':
                this.addOperation('+');
                break;
            case 'subtracao btn-others col-sm':
                this.addOperation('-');
                break;
            case 'multiplicacao btn-others col-sm':
                this.addOperation('*');
                break;
            case 'divisao btn-others col-sm':
                this.addOperation('/');
                break;
            case 'porcento btn-others col-sm':
                this.addOperation('%');
                break;
            case 'igual btn-others col-sm':
                this.calc();
                break;
            case 'ponto btn-others col-sm':
                this.addDot();
                break;

            case '0 btn-others col-sm':
            case '1 btn-others col-sm':
            case '2 btn-others col-sm':
            case '3 btn-others col-sm':
            case '4 btn-others col-sm':
            case '5 btn-others col-sm':
            case '6 btn-others col-sm':
            case '7 btn-others col-sm':
            case '8 btn-others col-sm':
            case '9 btn-others col-sm':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }

    }


    /**
     * parametros element lugar aonde o events sera executado e que funcao fn sera realizada nele
     * para fazer um foreach precisa ser um array, para percorer os events e fazer um evento pra cda
       split coloca um separador conforme se determinada separando a string e a transformando num array
     * @param {*} element 
     * @param {*} events 
     * @param {*} fn 
     */
    addEventListenerAll(element, events, fn) {
        //
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false); //para evitar que seja clicado duas vezes 
        });

    }

    //classe que inicia a tela da calculadora e ja habilita a cola se tiver algo pra colar
    init() {

        this.setLastNumberToDisplay();
        this.pasteFromToClipboard();

    }

    //classe que inicia o teclado, que faz os eventos de teclado 
    initKeyboard() {
        //chama o evento de tecla pra cima
        document.addEventListener('keyup', e => {

            switch (e.key) {
                case 'Escape':
                    this.clearAll(); //apaga tudo
                    break;
                case 'Backspace':
                    this.clearEntry(); //apaga a ultima entrada
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key); //adiciona uma operaçao ou numero
                    break;
                case 'Enter':
                case '=':
                    this.calc(); //calcula
                    break;
                case '.':
                case ',':
                    this.addDot(); //adiciona ponto
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key)); //adiciona uma operaçao e numero 
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard(); //habilita a copia
                    break;
                case 'v':
                    if (e.ctrlKey) this.pasteFromToClipboard(); //faz a cola
                    break;
            }

        });
    }

    initButtonsEvents() {

        //pega todos os buttons do DOM  
        let buttons = document.querySelectorAll("button");
        //percorre buttons, colocando cada botao no btn e add o evento d click nele, tedo o segundo parametro tras tb o nome especifico do botao na DOM

        buttons.forEach(btn => {
            //metodo criado para fazer varios eventos sem ter que copiar varios, javascript so suporta um evento por vez
            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.className.replace("btn-", "");
                this.execBtn(textBtn);

            });


            this.addEventListenerAll(btn, "mouseover mouseup mousedow", e => {
                btn.style.cursor = "pointer";
            });


        })
    }



}