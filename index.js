/*
"Dividir para conquistar, nada é impossível e nunca existe apenas um caminho"

Deixar responsivo depois. primeiro conseguir fazer a lógica do jogo funcionar

Letters Wall

Entendimento
Cada bloco possui uma letra

O que é necessário?
Blocos
x, y, largura e altura

Colisão de blocos
Criação de bloco OK
Randomização de criação de letras OK
Identificador de palavras
Colisão das bordas do canvas
Movimentação dos blocos
Touch events
*/
//  id = window.requestAnimationFrame() e window.cancelAnimationFrame(id)
// bloco = [letra, y]
// Coluna = bloco[]
var Game = (function () {
    function Game(id) {
        // TODO impedir de formar uma pilha única
        this.BLOCO_LARGURA = 50;
        this.BLOCO_ALTURA = 50;
        this.COLUNAS_POSICAO_X = [0, 50, 100, 150];
        this.LETRAS_POSICAO_X = [25, 75, 125, 175];
        this.COLUNAS_POSICAO_Y_INICIAL = 0;
        this.LETRAS_POSICAO_Y_INICIAL = this.COLUNAS_POSICAO_Y_INICIAL + this.BLOCO_ALTURA - 10;
        this.VOGAIS = ['A', 'E', 'I', 'O', 'U'];
        this.CONSOANTES = ['B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Z'];
        this.COLUNAS_TAMANHO = 7;
        this.QUANTIDADE_DE_COLUNAS = 4;
        this.ALTURA_DA_TELA = 350;
        this.colunas = [[], [], [], []];
        this.blocos_selecionados = [];
        this.velocidade = 10;
        this.y = 10;
        // Private members
        // Privileged - can acess private members
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = "center";
        this.context.font = "30pt Arial";
    }
    Game.prototype.criar_novo_bloco = function () {
        var coluna_id = Math.floor(Math.random() * 4), letra_id, letra, vogal_ou_consoante = Math.floor(Math.random() * 3);

        if (vogal_ou_consoante == 0) {
            letra_id = Math.floor(Math.random() * 5);
            letra = this.VOGAIS[letra_id];
        } else {
            letra_id = Math.floor(Math.random() * 20);
            letra = this.CONSOANTES[letra_id];
        }

        // TODO verificação de fim de jogo(quando não poder mais colocar blocos)
        // Adicionando na tela
        this.context.fillStyle = "gray";
        this.context.fillRect(this.COLUNAS_POSICAO_X[coluna_id], this.COLUNAS_POSICAO_Y_INICIAL, this.BLOCO_LARGURA, this.BLOCO_ALTURA);
        this.context.fillStyle = "black";
        this.context.fillText(letra, this.LETRAS_POSICAO_X[coluna_id], this.LETRAS_POSICAO_Y_INICIAL);

        // Adicionando na coluna
        console.log(coluna_id, [letra, this.COLUNAS_POSICAO_Y_INICIAL]);
        this.colunas[coluna_id].unshift([letra, this.COLUNAS_POSICAO_Y_INICIAL]);
    };

    Game.prototype.proximo_frame = function () {
        var i, j, bloco_posterior_posicao_y, tamanho_coluna_atual, coluna_atual;

        this.context.clearRect(0, 0, 200, 350);

        if ((this.colunas[0][0] == undefined || this.colunas[0][0][1] >= 50) && (this.colunas[1][0] == undefined || this.colunas[1][0][1] >= 50) && (this.colunas[2][0] == undefined || this.colunas[2][0][1] >= 50) && (this.colunas[3][0] == undefined || this.colunas[3][0][1] >= 50)) {
            this.criar_novo_bloco();
        }

        for (j = 0; j < this.QUANTIDADE_DE_COLUNAS; j++) {
            coluna_atual = this.colunas[j];
            tamanho_coluna_atual = coluna_atual.length;

            if (tamanho_coluna_atual > 0) {
                for (i = tamanho_coluna_atual - 1; i >= 0; i--) {
                    if (i + 1 < tamanho_coluna_atual) {
                        bloco_posterior_posicao_y = coluna_atual[i + 1][1];

                        if ((coluna_atual[i][1] + this.BLOCO_ALTURA < this.ALTURA_DA_TELA) && (bloco_posterior_posicao_y && (coluna_atual[i][1] + this.BLOCO_ALTURA < bloco_posterior_posicao_y))) {
                            coluna_atual[i][1] += this.velocidade;
                        }
                    } else if (coluna_atual[i][1] + this.BLOCO_ALTURA < this.ALTURA_DA_TELA) {
                        coluna_atual[i][1] += this.velocidade;
                    }

                    // Desenhando bloco
                    //TODO Cor do bloco(se foi selecionado ou não) será aki
                    this.context.fillStyle = "gray";
                    this.context.strokeRect(this.COLUNAS_POSICAO_X[j], this.colunas[j][i][1], this.BLOCO_LARGURA, this.BLOCO_ALTURA);
                    this.context.fillStyle = "black";
                    this.context.fillText(this.colunas[j][i][0], this.LETRAS_POSICAO_X[j], this.colunas[j][i][1] + this.BLOCO_ALTURA - 10);
                }
            }
        }
    };

    Game.prototype.chamar_proximo_frame = function () {
        this.proximo_frame();
        if (this.y == 10)
            this.game_loop = requestAnimationFrame(this.chamar_proximo_frame.bind(this));
    };
    return Game;
})();

if (document.getElementById('canvasOne').getContext) {
    var game = new Game('canvasOne');
    game.canvas.onclick = function () {
        console.log(this.clientX, this.clientY);
    };
    game.chamar_proximo_frame();
} else {
    console.error('Canvas not supported');
}
