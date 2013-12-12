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
Identificador de palavras OK
Colisão das bordas do canvas OK
Movimentação dos blocos OK
Mouse events OK
Touch events


Ideias:
    - Pode ter um botao para remover uma linha, caso tenha essa opção
    - Verificar se existe alguma pesquisa de quais consoantes e vogais mais aparecem em nosso idioma

*/
//  id = window.requestAnimationFrame() e window.cancelAnimationFrame(id)
// esta_selecionado = 0:não, 1:sim, 2:invalido
// bloco = [letra, y, esta_selecionado]
// Coluna = bloco[]
// bloco_selecionado = [letra, coluna_id, posicao_id]

// TODO verificar suporte do Tizen para Web Audio API
// TODO Blocos responsivos
// TODO Carregamento do audio
// TODO Implementação do audio
// TODO Construção do menu
// TODO Construção do 'ajuda'
var Game = (function () {
    function Game(canvas_id, botao_ok_id) {
        // Private members
        var that = this;
        var pontuacao = 0;

        function pontuar() {
            var blocos_selecionados_tamanho = that.blocos_selecionados.length;

            if(blocos_selecionados_tamanho > 1) {
                pontuacao += blocos_selecionados_tamanho * 2;
            } else {
                pontuacao++;
            }
        }

        function get_pontos() {
            return pontuacao;
        }

        // Public members
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
        this.DICIONARIO = JSON.parse(DICIONARIO_JSON);
        this.colunas = [[], [], [], []];
        this.blocos_selecionados = [];
        this.velocidade = 10;
        this.criar_vogal = false;
        this.acabar_jogo = false;

        this.canvas = document.getElementById(canvas_id);
        this.canvas.onclick = this.ao_clicar.bind(this);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = "center";
        this.context.font = "30pt Arial";
        this.botao_ok = document.getElementById(botao_ok_id);
        this.botao_ok.onclick = this.ao_confirmar.bind(this);

        // Privileged members
        this.pontuar = function() { pontuar(); };
        this.get_pontos = function() { return get_pontos(); };
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

    Game.prototype.remover_bloco_dos_selecionado = function (id, pos) {
        var i, length = this.blocos_selecionados.length;
        for (i = 0; i < length; i++) {
            if (this.blocos_selecionados[i][1] == id && this.blocos_selecionados[i][2] == pos) {
                this.blocos_selecionados.splice(i, 1);
                break;
            }
        }
    };

    Game.prototype.ordenacao_crescente_por_letra = function (bloco1, bloco2) {
        return bloco1[0] > bloco2[0];
    };

    Game.prototype.remover_blocos_selecionados = function() {
        var i;
        console.log("removendo:");
        for (i = this.blocos_selecionados.length - 1; i >= 0; i--) {
            console.log("Letra: " + this.colunas[this.blocos_selecionados[i][1]][this.blocos_selecionados[i][2]] + " Coluna: " + this.blocos_selecionados[i][1] + " Posição: " + this.blocos_selecionados[i][2]);
            this.colunas[ this.blocos_selecionados[i][1] ].splice(this.blocos_selecionados[i][2], 1);

        }
        this.blocos_selecionados = [];
    };

    Game.prototype.maior_index = function(bloco_selecionado1, bloco_selecionado2) {
        return bloco_selecionado1[2] - bloco_selecionado2[2];
    };

    // bloco_selecionado = [letra, coluna_id, posicao_id]
    Game.prototype.ao_confirmar = function () {
        var palavra_a_procurar = "", i, blocos_selecionados_tamanho = this.blocos_selecionados.length, lista_das_palavras, lista_das_palavras_tamanho;

        if(blocos_selecionados_tamanho > 0) {
            this.blocos_selecionados.sort(this.ordenacao_crescente_por_letra);
            
            for (i = 0; i < blocos_selecionados_tamanho; i++) {
                palavra_a_procurar += this.blocos_selecionados[i][0];
            }

            // Procurando palavra no dicionário
            if(this.DICIONARIO[ palavra_a_procurar[0] ] != undefined) {
                
                lista_das_palavras = this.DICIONARIO[ palavra_a_procurar[0] ][ blocos_selecionados_tamanho-1 ];
                if(lista_das_palavras != undefined) {

                    lista_das_palavras_tamanho = lista_das_palavras.length;
                    for(i=0; i<lista_das_palavras_tamanho; i++) {

                        // Se achar a palavra
                        if(lista_das_palavras[i] == palavra_a_procurar) {
                            this.pontuar();
                            console.log("Pontuação: " + this.get_pontos());
                            console.log("palavra: " + palavra_a_procurar);
                            this.blocos_selecionados.sort(this.maior_index);
                            console.log("Blocos reoodernados: " + this.blocos_selecionados);
                            this.remover_blocos_selecionados();
                            
                            return;
                        }
                    }
                }
            }

            // Caso não tenha achado
            for (i = 0; i < blocos_selecionados_tamanho; i++) {
                this.colunas[ this.blocos_selecionados[i][1] ][ this.blocos_selecionados[i][2] ][2] = 2;
            }
            this.blocos_selecionados = [];
            console.log("não existe");
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
                } else {
                    this.colunas[id][i][2] = 0;
                    this.remover_bloco_dos_selecionado(id, i);
                }
                console.table(this.blocos_selecionados);
                break;
            }
        }
    };
    Game.prototype.chamar_proximo_frame = function () {
        this.proximo_frame();

        //if(!this.acabar_jogo) {
        requestAnimationFrame(this.chamar_proximo_frame.bind(this));
        //}
    };
    return Game;
})();

if (document.getElementById('canvasOne').getContext) {
    var game = new Game('canvasOne', 'OK');
    game.chamar_proximo_frame();
} else {
    console.error('Canvas not supported');
}