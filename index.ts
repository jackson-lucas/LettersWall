declare var document;
declare var console;
var n:number;
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
class Game {
    // TODO impedir de formar uma pilha única
    public BLOCO_LARGURA = 50;
    public BLOCO_ALTURA = 50;
    public COLUNAS_POSICAO_X = [0, 50, 100, 150];
    public LETRAS_POSICAO_X = [25, 75, 125, 175];
    public COLUNAS_POSICAO_Y_INICIAL = 0; // -40 é o valor oficial
    public LETRAS_POSICAO_Y_INICIAL = this.COLUNAS_POSICAO_Y_INICIAL + this.BLOCO_ALTURA - 10;
    public VOGAIS = ['A', 'E', 'I', 'O', 'U'];
    public CONSOANTES = ['B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'P', 'Q', 'R', 'S','T', 'U', 'V', 'X', 'Z'];
    public COLUNAS_TAMANHO = 7;
    public QUANTIDADE_DE_COLUNAS = 4;
    public ALTURA_DA_TELA = 350; // Pixels

    public colunas = [[],[],[],[]];
    public blocos_selecionados: number[][] = [];
    public canvas;
    public context;
    public game_loop;
    public velocidade: number = 10; // 10 pixels/frame

    constructor (id: string) {
        // Private members

        // Privileged - can acess private members
        this.canvas = document.getElementById(id);
        this.canvas.onclick = this.ao_clicar.bind(this);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = "center";
        this.context.font = "30pt Arial";
    }

    criar_novo_bloco() {
        var coluna_id: number = Math.floor(Math.random() * 4), // Número entre 0 e 3
            letra_id: number, // Número entre 0 e 25
            letra: string,
            vogal_ou_consoante: number = Math.floor(Math.random() * 3); // 1/3 de sair uma vogal

        if(vogal_ou_consoante == 0) {
            letra_id = Math.floor(Math.random() * 5);
            letra = this.VOGAIS[letra_id];
        } else {
            letra_id = Math.floor(Math.random() * 18);
            letra = this.CONSOANTES[letra_id];
        }

        // TODO verificação de fim de jogo(quando não poder mais colocar blocos)

        // Adicionando na tela
        this.context.strokeRect(this.COLUNAS_POSICAO_X[coluna_id], this.COLUNAS_POSICAO_Y_INICIAL, this.BLOCO_LARGURA, this.BLOCO_ALTURA);
        this.context.fillText(letra , this.LETRAS_POSICAO_X[coluna_id], this.LETRAS_POSICAO_Y_INICIAL);

        // Adicionando na coluna
        console.log(coluna_id, [letra, this.COLUNAS_POSICAO_Y_INICIAL, 0]);
        this.colunas[coluna_id].unshift( [letra, this.COLUNAS_POSICAO_Y_INICIAL, 0] );
    }

    proximo_frame() {
        var i, j, bloco_posterior_posicao_y, tamanho_coluna_atual, coluna_atual;
        
        this.context.clearRect(0, 0, 200, 350);

        // Se não tiver bloco na posição inicial, criar novo bloco
        if((this.colunas[0][0]==undefined || this.colunas[0][0][1] >= 50) && (this.colunas[1][0]==undefined || this.colunas[1][0][1] >= 50) && 
                (this.colunas[2][0]==undefined || this.colunas[2][0][1] >= 50) && (this.colunas[3][0]==undefined || this.colunas[3][0][1] >= 50)) {
            this.criar_novo_bloco();
        }

        // Mover blocos se não colidir com próximo e não passar a tela
        for(j=0; j<this.QUANTIDADE_DE_COLUNAS; j++) { 
           coluna_atual = this.colunas[j];
            tamanho_coluna_atual = coluna_atual.length;

            if(tamanho_coluna_atual > 0) {
                // A passagem pelas colunas é feita de ordem inversa para facilitar a verificação da colisão entre blocos
                for(i=tamanho_coluna_atual-1; i>=0; i--) {
                    
                    // Verifica se não colide com outro bloco ou se ultrapassa tela
                    if (i+1 < tamanho_coluna_atual) {
                        bloco_posterior_posicao_y = coluna_atual[i+1][1];

                        if((coluna_atual[i][1] + this.BLOCO_ALTURA < this.ALTURA_DA_TELA) &&
                                (bloco_posterior_posicao_y && (coluna_atual[i][1] + this.BLOCO_ALTURA < bloco_posterior_posicao_y))) {
                            coluna_atual[i][1] += this.velocidade;
                        }

                    }  else if(coluna_atual[i][1] + this.BLOCO_ALTURA < this.ALTURA_DA_TELA) {
                        coluna_atual[i][1] += this.velocidade;
                    }

                    // Desenhando bloco

                    // Para blocas selecionados
                    if(this.colunas[j][i][2]) {

                        if(this.colunas[j][i][2] == 1) {
                            // Letra selecionada
                            this.context.fillStyle = "#3ADF00"; //this green for selected    
                        } else {
                            // Letra invalidada na formação da palavra
                            this.colunas[j][i][2] = 0;
                            this.context.fillStyle = "#FF0000";// this red for error
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

    remover_bloco_selecionado(id: number, pos: number) {
        var i, length = this.blocos_selecionados.length;
        for(i=0; i<length; i++) {
            if (this.blocos_selecionados[i][1] == id &&
                    this.blocos_selecionados[i][2] == pos) {
                this.blocos_selecionados.splice(i, 1);
                break;
            }
        }
    }

    ao_clicar(evt) {
        var mouse_posicao = this.get_posicao_mouse(evt),
            id, i;

        console.log(mouse_posicao.x, mouse_posicao.y);

        // Procurar se algum bloco foi selecionado
        if(mouse_posicao.x < 50) {
            id = 0;
        } else if(mouse_posicao.x < 100) {
            id = 1;
        }else if(mouse_posicao.x < 150) {
            id = 2;
        }else if(mouse_posicao.x < 200) {
            id = 3;
        }

        /* Leitura de baixo p/ cima pelos seguintes motivos:
            1. Evita uma comparação a mais no if dentro do for para ter de diferenciar as posições dos blocos
            2. É provavel que o jogador clique primeiro nos blocos já parados(se é eficiente? não sei)
            3. Os blocos q estiverem no ar ainda poderão ser selecionados bastando clicar na area livre da coluna desse bloco.
                A ideia é q isso seja uma feature mas, vamos ver se na prática realmente é uma boa.
        */
        for(i = this.colunas[id].length-1; i>= 0; i--) {
            if(mouse_posicao.y >= this.colunas[id][i][1]) {
                if(this.colunas[id][i][2] === 0) {
                    this.colunas[id][i][2] = 1;
                    this.blocos_selecionados.push([this.colunas[id][i][0], id, i]); // [letra, coluna, posicao_na_coluna]
                    console.table(this.blocos_selecionados);
                } else {
                    this.colunas[id][i][2] = 0;
                    this.remover_bloco_selecionado(id, i);
                    console.table(this.blocos_selecionados);
                }
                break;
            }
        }

    }

    public y = 10;
    chamar_proximo_frame() {
        this.proximo_frame();
        if(this.y == 10) this.game_loop = requestAnimationFrame(this.chamar_proximo_frame.bind(this));
    }
}

if(document.getElementById('canvasOne').getContext) {
    var game = new Game('canvasOne');
    game.chamar_proximo_frame();
    console.log("oi");
} else {
    console.error('Canvas not supported');
}

/*
var canvas = document.getElementById('canvasOne');
var context = this.canvas.getContext('2d');
var y = 10;
var loop;
var teste = function () {
    y += 10;
    if(y < 350) {
        context.clearRect(0, 0, 500, 350);
        context.fillStyle = "gray";
        context.fillRect(0, y, 50, 50);

        context.fillRect(50, y, 50, 50);
        context.fillRect(100, y, 50, 50);
        context.fillRect(150, y, 50, 50);

    } else {
        y = 10;
    }
    loop = requestAnimationFrame(teste);
}

teste();*/
//this.context.fillStyle = "black";
//this.context.fillText(coluna_atual[0], this.LETRAS_POSICAO_X[j], coluna_atual[1] + this.BLOCO_ALTURA - 10);