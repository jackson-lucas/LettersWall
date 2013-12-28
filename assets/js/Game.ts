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

// TODO normalizar velocidade
// TODO Blocos responsivos
// TODO Carregamento do audio
// TODO Implementação do audio
// TODO Construção do menu
// TODO Construção do 'ajuda'
interface Console {
    table;
}

interface HTMLElement {
    getContext;
}
declare var DICIONARIO_JSON;


// esta_selecionado = 0:não, 1:sim, 2:invalido
// bloco = [letra, y, esta_selecionado]
// Coluna = bloco[]
// bloco_selecionado = [letra, coluna_id, posicao_id]
class Game {
    BLOCO_LARGURA:number = 50;
    BLOCO_ALTURA:number = 50;
    COLUNAS_POSICAO_X:number[] = [0, 50, 100, 150];
    LETRAS_POSICAO_X:number[] = [25, 75, 125, 175];
    COLUNAS_POSICAO_Y_INICIAL:number = -50;
    LETRAS_POSICAO_Y_INICIAL:number = this.COLUNAS_POSICAO_Y_INICIAL + this.BLOCO_ALTURA - 10;
    VOGAIS:string[] = ['A', 'E', 'I', 'O', 'U'];
    CONSOANTES:string[] = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'X', 'Z'];
    COLUNAS_TAMANHO:number = 7;
    QUANTIDADE_DE_COLUNAS:number = 4;
    ALTURA_DA_TELA:number = 350;
    DICIONARIO = JSON.parse(DICIONARIO_JSON);
    colunas = [[], [], [], []];
    blocos_selecionados:any = [];
    velocidade:number = 10;
    criar_vogal:boolean = false;
    acabar_jogo:boolean = false;
    canvas;
    context;
    botao_ok; 
    pontuar; 
    get_pontos;

    constructor (canvas_id, botao_ok_id) {
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

    esta_cheia_coluna(id:number) {
        if (this.colunas[id][0] == undefined || this.colunas[id].length < this.COLUNAS_TAMANHO) {
            return false;
        }
        return true;
    }

    criar_novo_bloco() {
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
    }

    proximo_frame() {
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
    }

    // Pega posicao do mouse em relação ao canvas e não a janela.
    get_posicao_mouse(evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    remover_bloco_dos_selecionado(coluna_id:number, posicao_na_coluna:number) {
        var i, length = this.blocos_selecionados.length;
        for (i = 0; i < length; i++) {
            if (this.blocos_selecionados[i][1] == coluna_id && this.blocos_selecionados[i][2] == posicao_na_coluna) {
                this.blocos_selecionados.splice(i, 1);
                break;
            }
        }
    }

    ordenacao_crescente_por_letra (bloco1, bloco2) {
        return bloco1[0] > bloco2[0];
    }

    remover_blocos_selecionados = function() {
        var i;
        console.log("removendo:");
        for (i = this.blocos_selecionados.length - 1; i >= 0; i--) {
            console.log("Letra: " + this.colunas[this.blocos_selecionados[i][1]][this.blocos_selecionados[i][2]] + " Coluna: " + this.blocos_selecionados[i][1] + " Posição: " + this.blocos_selecionados[i][2]);
            this.colunas[ this.blocos_selecionados[i][1] ].splice(this.blocos_selecionados[i][2], 1);

        }
        this.blocos_selecionados = [];
    };

    maior_index(bloco_selecionado1, bloco_selecionado2) {
        return bloco_selecionado1[2] - bloco_selecionado2[2];
    }

    // bloco_selecionado = [letra, coluna_id, posicao_id]
    ao_confirmar() {
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
    }

    ao_clicar(evt) {
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
    }
    chamar_proximo_frame() {
        this.proximo_frame();

        //if(!this.acabar_jogo) {
        requestAnimationFrame(this.chamar_proximo_frame.bind(this));
        //}
    }
}