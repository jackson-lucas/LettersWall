/*
"Dividir para conquistar, nada é impossível e nunca existe apenas um caminho"

Deixar responsivo depois. primeiro conseguir fazer a lógica do jogo funcionar

Letters Wall

Entendimento
Cada bloco possui uma letra

O que é necessário?
Blocos
x, y, largura e altura

Colisão de blocos OK
Criação de bloco OK
Randomização de criação de letras OK
Identificador de palavras
Colisão das bordas do canvas OK
Movimentação dos blocos OK
Mouse events OK
Touch events
*/
//  id = window.requestAnimationFrame() e window.cancelAnimationFrame(id)
// esta_selecionado = 0:não, 1:sim, 2:invalido
// bloco = [letra, y, esta_selecionado]
// Coluna = bloco[]
/* TODO criar arquivo com JSON das palavras, as palavras deverão ficar em duas listas, com as palavras
reodernadas com as palavras em ordem alfabetica. e outra lista com a palavra em si.
Prioridade é que a primeira lista não tenha repetição, pensar se a segunda lista vai ser utilizado, se for tb deverá
eliminar essas repetições para não misturar os index das lista. as palavras devem está em caixa alta.
*/
var Game = (function () {
    function Game(id) {
        this.BLOCO_LARGURA = 50;
        this.BLOCO_ALTURA = 50;
        this.COLUNAS_POSICAO_X = [0, 50, 100, 150];
        this.LETRAS_POSICAO_X = [25, 75, 125, 175];
        this.COLUNAS_POSICAO_Y_INICIAL = -50;
        this.LETRAS_POSICAO_Y_INICIAL = this.COLUNAS_POSICAO_Y_INICIAL + this.BLOCO_ALTURA - 10;
        this.VOGAIS = ['A', 'E', 'I', 'O', 'U'];
        this.CONSOANTES = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'X', 'Z'];
        this.COLUNAS_TAMANHO = 7;
        this.QUANTIDADE_DE_COLUNAS = 4;
        this.ALTURA_DA_TELA = 350;
        this.colunas = [[], [], [], []];
        this.blocos_selecionados = [];
        this.velocidade = 10;
        this.criar_vogal = false;
        this.acabar_jogo = false;
        // Private members
        // Privileged - can acess private members
        this.canvas = document.getElementById(id);
        this.canvas.onclick = this.ao_clicar.bind(this);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = "center";
        this.context.font = "30pt Arial";
    }
    Game.prototype.esta_cheia_coluna = function (id) {
        if (this.colunas[id][0] == undefined || this.colunas[id].length < this.COLUNAS_TAMANHO) {
            return false;
        }
        return true;
    };

    Game.prototype.criar_novo_bloco = function () {
        var coluna_id = Math.floor(Math.random() * 4), letra_id, letra, quantidade_colunas_cheias = 0;

        while (this.esta_cheia_coluna(coluna_id)) {
            quantidade_colunas_cheias++;
            if (quantidade_colunas_cheias >= 4) {
                if (this.colunas[0][0][1] >= 0 && this.colunas[1][0][1] >= 0 && this.colunas[2][0][1] >= 0 && this.colunas[3][0][1] >= 0) {
                    this.acabar_jogo = true;
                }

                // Situação em que todas as colunas estão cheias porém o muro não foi completado
                return;
            }

            if (coluna_id == this.QUANTIDADE_DE_COLUNAS - 1) {
                coluna_id = 0;
            } else {
                coluna_id++;
            }
        }

        if (!this.acabar_jogo) {
            if (this.criar_vogal) {
                letra_id = Math.floor(Math.random() * this.VOGAIS.length);
                letra = this.VOGAIS[letra_id];
            } else {
                letra_id = Math.floor(Math.random() * this.CONSOANTES.length);
                letra = this.CONSOANTES[letra_id];
            }
            this.criar_vogal = !this.criar_vogal;

            // Adicionando na tela
            this.context.strokeRect(this.COLUNAS_POSICAO_X[coluna_id], this.COLUNAS_POSICAO_Y_INICIAL, this.BLOCO_LARGURA, this.BLOCO_ALTURA);
            this.context.fillText(letra, this.LETRAS_POSICAO_X[coluna_id], this.LETRAS_POSICAO_Y_INICIAL);

            // Adicionando na coluna
            console.log(coluna_id, [letra, this.COLUNAS_POSICAO_Y_INICIAL, 0]);
            this.colunas[coluna_id].unshift([letra, this.COLUNAS_POSICAO_Y_INICIAL, 0]);
        }
    };

    Game.prototype.proximo_frame = function () {
        var i, j, bloco_posterior_posicao_y, tamanho_coluna_atual, coluna_atual;

        this.context.clearRect(0, 0, 200, 350);

        this.criar_novo_bloco();

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

                    if (this.colunas[j][i][2]) {
                        if (this.colunas[j][i][2] == 1) {
                            // Letra selecionada
                            this.context.fillStyle = "#3ADF00";
                        } else {
                            // Letra invalidada na formação da palavra
                            this.colunas[j][i][2] = 0;
                            this.context.fillStyle = "#FF0000";
                        }

                        this.context.fillRect(this.COLUNAS_POSICAO_X[j], this.colunas[j][i][1], this.BLOCO_LARGURA, this.BLOCO_ALTURA);
                        this.context.fillStyle = "black";
                    }

                    this.context.strokeRect(this.COLUNAS_POSICAO_X[j], this.colunas[j][i][1], this.BLOCO_LARGURA, this.BLOCO_ALTURA);
                    this.context.fillText(this.colunas[j][i][0], this.LETRAS_POSICAO_X[j], this.colunas[j][i][1] + this.BLOCO_ALTURA - 10);
                }
            }
        }
    };

    // Pega posicao do mouse em relação ao canvas e não a janela.
    Game.prototype.get_posicao_mouse = function (evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    Game.prototype.remover_bloco_selecionado = function (id, pos) {
        var i, length = this.blocos_selecionados.length;
        for (i = 0; i < length; i++) {
            if (this.blocos_selecionados[i][1] == id && this.blocos_selecionados[i][2] == pos) {
                this.blocos_selecionados.splice(i, 1);
                break;
            }
        }
    };

    Game.prototype.ao_clicar = function (evt) {
        var mouse_posicao = this.get_posicao_mouse(evt), id, i;

        console.log(mouse_posicao.x, mouse_posicao.y);

        if (mouse_posicao.x < 50) {
            id = 0;
        } else if (mouse_posicao.x < 100) {
            id = 1;
        } else if (mouse_posicao.x < 150) {
            id = 2;
        } else if (mouse_posicao.x < 200) {
            id = 3;
        }

        for (i = this.colunas[id].length - 1; i >= 0; i--) {
            if (mouse_posicao.y >= this.colunas[id][i][1]) {
                if (this.colunas[id][i][2] === 0) {
                    this.colunas[id][i][2] = 1;
                    this.blocos_selecionados.push([this.colunas[id][i][0], id, i]);
                    console.table(this.blocos_selecionados);
                } else {
                    this.colunas[id][i][2] = 0;
                }
                break;
            }
        }
    };
    Game.prototype.chamar_proximo_frame = function () {
        this.proximo_frame();
        if (!this.acabar_jogo) {
            requestAnimationFrame(this.chamar_proximo_frame.bind(this));
        }
    };
    return Game;
})();

if (document.getElementById('canvasOne').getContext) {
    var game = new Game('canvasOne');
    game.chamar_proximo_frame();
} else {
    console.error('Canvas not supported');
}

console.log(PALAVRAS);