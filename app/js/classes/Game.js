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
- Implementar history API

*/
// esta_selecionado = 0:não, 1:sim, 2:invalido
// bloco = [letra, y, esta_selecionado]
// Coluna = bloco[]
// bloco_selecionado = [letra, coluna_id, posicao_id]

App.Classes.Game = (function () {
    function Game(canvas_id, botao_confirmar_id) {
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
        this.DICIONARIO = JSON.parse(App.JSON.DICIONARIO);
        this.AUMENTO_DA_VELOCIDADE = 3;
        this.PONTUACAO_POR_NIVEL = 30;
        this.colunas = [[], [], [], []];
        this.blocos_selecionados = [];
        this.velocidade = 2;
        this.criar_vogal = false;
        this.acabar_jogo = false;
        this.contador_de_frames = 0;
        this.frame = 60;
        this.segundos_para_criar_bloco = 3;
        this.pausar_jogo = false;

        // Private members
        var that = this;
        var pontuacao = 0;

        function pontuar() {
            var blocos_selecionados_tamanho = that.blocos_selecionados.length;

            if(!that.acabar_jogo) {
                if (blocos_selecionados_tamanho > 1) {
                    pontuacao += blocos_selecionados_tamanho * 2;
                } else {
                    pontuacao++;
                }

                that.mudar_pontos_na_tela();
            }
        }

        function get_pontos() {
            return pontuacao;
        }

        // Public members
        this.canvas = document.getElementById(canvas_id);
        this.canvas.onclick = this.ao_clicar.bind(this);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = "center";
        this.context.font = "30pt Arial";
        this.botao_confirmar = document.getElementById(botao_confirmar_id);
        this.botao_confirmar.onclick = this.ao_confirmar.bind(this);

        // Privileged members
        this.pontuar = function () {
            pontuar();
        };
        this.get_pontos = function () {
            return get_pontos();
        };
    }

    Game.prototype.remover_blocos_selecionados = function () {
        var i;
        console.log("removendo:");
        for (i = this.blocos_selecionados.length - 1; i >= 0; i--) {
            console.log("Coluna da remocao: " + this.colunas[this.blocos_selecionados[i][1]]);
            console.log("Letra: " + this.colunas[this.blocos_selecionados[i][1]][this.blocos_selecionados[i][2]] + " Coluna: " + this.blocos_selecionados[i][1] + " Posição: " + this.blocos_selecionados[i][2]);
            this.colunas[this.blocos_selecionados[i][1]].splice(this.blocos_selecionados[i][2], 1);
            console.log("Coluna depois da remocao: " + this.colunas[this.blocos_selecionados[i][1]]);
        }
        this.blocos_selecionados = [];
    };

    Game.prototype.esta_cheia_coluna = function (id) {
        if (this.colunas[id][0] == undefined || this.colunas[id].length < this.COLUNAS_TAMANHO) {
            return false;
        }
        return true;
    };

    Game.prototype.finalizar = function() {
        this.acabar_jogo = true;
        // Aqui armazenar a pontuação em outro local
    };

    Game.prototype.criar_novo_bloco = function () {
        var coluna_id = Math.floor(Math.random() * 4), letra_id, letra, quantidade_colunas_cheias = 0;

        while (this.esta_cheia_coluna(coluna_id)) {
            quantidade_colunas_cheias++;
            if (quantidade_colunas_cheias >= 4) {
                if (this.colunas[0][0][1] >= 0 && this.colunas[1][0][1] >= 0 && this.colunas[2][0][1] >= 0 && this.colunas[3][0][1] >= 0) {
                    this.finalizar();
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
            console.table(this.blocos_selecionados);
            this.colunas[coluna_id].push([letra, this.COLUNAS_POSICAO_Y_INICIAL, 0]);
        }
    };

    Game.prototype.proximo_frame = function () {
        var i, j, bloco_posterior_posicao_y, tamanho_coluna_atual, coluna_atual, posicao_e_tamanho_do_bloco;

        if (!this.pausar_jogo) {       
            this.context.clearRect(0, 0, 200, 350);
            
            if(this.contador_de_frames === 0) {
                this.criar_novo_bloco();
            }
            this.contador_de_frames++;
            if (this.contador_de_frames >= (this.frame * this.segundos_para_criar_bloco) ) {
                this.contador_de_frames = 0;
            }

            // Gerador gráfico
            for (j = 0; j < this.QUANTIDADE_DE_COLUNAS; j++) {
                coluna_atual = this.colunas[j];
                tamanho_coluna_atual = coluna_atual.length;

                if (tamanho_coluna_atual > 0) {

                    for (i = 0; i < tamanho_coluna_atual; i++) {

                        posicao_e_tamanho_do_bloco = coluna_atual[i][1] + this.BLOCO_ALTURA;
                        // Caso exista um bloco posterior
                        if (i - 1 >= 0) {

                            bloco_posterior_posicao_y = coluna_atual[i - 1][1];

                            if (posicao_e_tamanho_do_bloco + this.velocidade < bloco_posterior_posicao_y) {
                                coluna_atual[i][1] += this.velocidade;
                            } else if(posicao_e_tamanho_do_bloco < bloco_posterior_posicao_y) {
                                coluna_atual[i][1] += bloco_posterior_posicao_y - posicao_e_tamanho_do_bloco;
                            }

                        } else if (posicao_e_tamanho_do_bloco + this.velocidade < this.ALTURA_DA_TELA) {
                            coluna_atual[i][1] += this.velocidade;
                        } else if (posicao_e_tamanho_do_bloco < this.ALTURA_DA_TELA) {
                            coluna_atual[i][1] += this.ALTURA_DA_TELA - posicao_e_tamanho_do_bloco;
                        }

                        // Definição da cor do bloco
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

                        // Geração do bloco + letra
                        this.context.strokeRect(this.COLUNAS_POSICAO_X[j], this.colunas[j][i][1], this.BLOCO_LARGURA, this.BLOCO_ALTURA);
                        this.context.fillText(this.colunas[j][i][0], this.LETRAS_POSICAO_X[j], this.colunas[j][i][1] + this.BLOCO_ALTURA - 10);
                    }
                }
            }
        }
    };

    // Pega posicao do mouse em relação ao canvas e não a janela.
    Game.prototype.get_posicao_mouse = function (evento) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: evento.clientX - rect.left,
            y: evento.clientY - rect.top
        };
    };

    Game.prototype.remover_bloco_dos_selecionado = function (coluna_id, posicao_na_coluna) {
        var i, length = this.blocos_selecionados.length;
        for (i = 0; i < length; i++) {
            if (this.blocos_selecionados[i][1] == coluna_id && this.blocos_selecionados[i][2] == posicao_na_coluna) {
                this.blocos_selecionados.splice(i, 1);
                break;
            }
        }
    };

    Game.prototype.ordenacao_crescente_por_letra = function (bloco1, bloco2) {
        return bloco1[0] > bloco2[0];
    };

    Game.prototype.maior_index = function (bloco_selecionado1, bloco_selecionado2) {
        return bloco_selecionado1[2] - bloco_selecionado2[2];
    };

    Game.prototype.verificar_nivel = function() {
        var nivel = Math.floor(this.get_pontos() / this.PONTUACAO_POR_NIVEL);

        if(nivel < 4) {
            this.velocidade = (nivel * this.AUMENTO_DA_VELOCIDADE) || this.velocidade;    
        } else {
            this.segundos_para_criar_bloco -= 0.5 * (nivel - 3);
        }
        
        console.log("velocidade atual: " + this.velocidade);
        console.log("segundos_para_criar_bloco: " + this.segundos_para_criar_bloco);
    };

    Game.prototype.mudar_pontos_na_tela = function() {
        $('#pontos').text( this.get_pontos() );
    };

    // bloco_selecionado = [letra, coluna_id, posicao_id]
    Game.prototype.ao_confirmar = function () {
        var palavra_a_procurar = "", i, blocos_selecionados_tamanho = this.blocos_selecionados.length, lista_das_palavras, lista_das_palavras_tamanho;

        if (!this.pausar_jogo) { 
            if (blocos_selecionados_tamanho > 0) {
                this.blocos_selecionados.sort(this.ordenacao_crescente_por_letra);

                for (i = 0; i < blocos_selecionados_tamanho; i++) {
                    palavra_a_procurar += this.blocos_selecionados[i][0];
                }

                if (this.DICIONARIO[palavra_a_procurar[0]] != undefined) {
                    lista_das_palavras = this.DICIONARIO[palavra_a_procurar[0]][blocos_selecionados_tamanho - 1];
                    if (lista_das_palavras != undefined) {
                        lista_das_palavras_tamanho = lista_das_palavras.length;
                        for (i = 0; i < lista_das_palavras_tamanho; i++) {
                            if (lista_das_palavras[i] == palavra_a_procurar) {
                                // TODO ativar audio de 'palavra certa'
                                this.pontuar();
                                this.verificar_nivel();
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

                for (i = 0; i < blocos_selecionados_tamanho; i++) {
                    this.colunas[this.blocos_selecionados[i][1]][this.blocos_selecionados[i][2]][2] = 2;
                }
                this.blocos_selecionados = [];
                // TODO ativar audio de 'palavra errada'
                console.log("não existe");
            }
        }
    };

    Game.prototype.ao_clicar = function (evento) {
        var mouse_posicao = this.get_posicao_mouse(evento), id, i;

        if (!this.pausar_jogo) { 

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

            for (i = 0; i < this.colunas[id].length; i++) {
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
        }
    };
    
    Game.prototype.chamar_proximo_frame = function () {
        this.proximo_frame();

        if(!this.acabar_jogo) {
            requestAnimationFrame(this.chamar_proximo_frame.bind(this));            
        }
    };

    return Game;
})();
