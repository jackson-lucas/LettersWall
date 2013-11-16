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
Criação de bloco
Randomização de criação de letras
Identificador de palavras
Colisão das bordas do canvas
Movimentação dos blocos
Touch events
*/
//  window.requestAnimationFrame() em vez de setInterval()
// bloco = [x, y, largura, altura]
// Coluna = bloco[]
var Game = (function () {
    function Game(id) {
        this.QUADRADO_LARGURA = 50;
        this.QUADRADO_ALTURA = 50;
        this.COLUNAS_POSICAO_X = [0, 50, 100, 150];
        this.LETRAS_POSICAO_X = [25, 75, 125, 175];
        this.COLUNAS_POSICAO_Y_INICIAL = 0;
        this.LETRAS_POSICAO_Y_INICIAL = this.COLUNAS_POSICAO_Y_INICIAL + this.QUADRADO_ALTURA - 10;
        this.ALFABETO = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.colunas = [[], [], [], []];
        this.quadrados_selecionados = [];
        // Private members
        // Privileged - can acess private members
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = "center";
        this.context.font = "30pt Arial";
    }
    Game.prototype.criar_bloco = function () {
        var coluna_id = Math.floor(Math.random() * 4), letra_id = Math.floor(Math.random() * 26);

        this.context.fillStyle = "gray";
        this.context.fillRect(this.COLUNAS_POSICAO_X[coluna_id], this.COLUNAS_POSICAO_Y_INICIAL, this.QUADRADO_LARGURA, this.QUADRADO_ALTURA);
        this.context.fillStyle = "green";
        this.context.fillText(this.ALFABETO[letra_id], this.LETRAS_POSICAO_X[coluna_id], this.LETRAS_POSICAO_Y_INICIAL);
    };
    return Game;
})();

if (document.getElementById('canvasOne').getContext) {
    var game = new Game('canvasOne');
    game.criar_bloco();
} else {
    console.error('Canvas not supported');
}
