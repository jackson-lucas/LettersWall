/*
Made by: Jackson Lucas - jackson.lsl87@gmail.com

"Dividir para conquistar, nada é impossível e nunca existe apenas um caminho"


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
Touch events OK

*/
// is_selected = 0:no, 1:yes, 2:invalid
// block = [letter, y, is_selected]
// column = block[]
// selected_block = [letter, column_id, position_id]
// vogais e consoantes, cada LETRA terá [letter, actual_quantity, max_percentage]
App.Classes.Game = (function () {
    function Game(canvas_id, confirm_button_id, points_id) {
        this.BLOCK_WIDTH = 50;
        this.BLOCK_HEIGHT = 50;
        this.COLUMNS_INITIAL_POSITION_X = [0, 50, 100, 150];
        this.LETTERS_POSITION_X = [25, 75, 125, 175];
        this.COLUMNS_INITIAL_POSITION_Y = -50;
        this.LETTERS_INITIAL_POSITION_Y = this.COLUMNS_INITIAL_POSITION_Y + this.BLOCK_HEIGHT - 10;
        this.VOWELS = [['A', 0, 15], ['E', 0, 12.89], ['I', 0, 6.33], ['O', 0, 11], ['U', 0, 4.74]];
        this.CONSONANTS = [['B', 0, 1.01] , ['C', 0, 3.78], ['D', 0, 4.86], ['F', 0, 0.99], ['G', 0, 1.26], ['H', 0, 1.24], ['J', 0, 0.39], ['L', 0, 2.71], ['M', 0, 4.62], ['N', 0, 4.92], ['P', 0, 2.45], ['Q', 0, 1.17], ['R', 0, 6.36], ['S', 0, 7.61], ['T', 0, 4.23], ['V', 0, 1.62], ['X', 0, 0.2], ['Z', 0, 0.45]];
        this.COLUMNS_SIZE = 7;
        this.COLUMNS_QUANTITY = 4;
        this.SCREEN_HEIGHT = 350;
        this.DICTIONARY = JSON.parse(App.JSON.DICTIONARY);
        this.SPEED_INCREASE = 1;
        this.POINTS_PER_LEVEL = 15;
        this.columns = [[], [], [], []];
        this.selected_blocks = [];
        this.speed = 1;
        this.create_vowel = false;
        this.end_game = false;
        this.frame_counter = 0;
        this.frame = 60;
        this.create_block_interval = 3;// seconds
        this.is_paused = false;
        this.letters_quantity = 0;

        // Private members
        var that = this,
            points = 0,
            sounds = document.getElementsByTagName("audio");

        
        function score() {
            var selected_blocks_length = that.selected_blocks.length;

            if(!that.end_game) {
                if (selected_blocks_length > 1) {
                    points += selected_blocks_length * 2;
                } else {
                    points++;
                }

                that.change_score_on_screen();
            }
        }

        function get_points() {
            return points;
        }

        // Public members

        this.background_music = sounds[0];
        this.background_music.play();
        this.background_music.volume = App.Objects.background_volume;
        this.confirm_sfx = sounds[1];
        this.confirm_sfx.volume = App.Objects.sounds_effects_volume;
        this.deny_sfx = sounds[2];
        this.deny_sfx.volume = App.Objects.sounds_effects_volume;

        
        this.canvas = document.getElementById(canvas_id);
        this.canvas.onclick = this.onclick.bind(this);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = "center";
        this.context.font = "30pt Arial";
        this.confirm_button = document.getElementById(confirm_button_id);
        this.confirm_button.onclick = this.on_confirm.bind(this);
        this.score_screen = document.getElementById(points_id);
        this.score_screen.textContent = "0";

        document.onkeypress = this.on_press_enter.bind(this);
        window.addEventListener("blur", this.change_status.bind(this, 1), false);
        window.addEventListener("focus", this.change_status.bind(this, 0), false);

        // Privileged members
        this.score = function () {
            score();
        };
        this.get_points = function () {
            return get_points();
        };

    }

    Game.prototype.remove_selected_blocks = function () {
        var i;
        console.log("removendo:");
        for (i = this.selected_blocks.length - 1; i >= 0; i--) {
            console.log("Coluna da remocao: " + this.columns[this.selected_blocks[i][1]]);
            console.log("Letra: " + this.columns[this.selected_blocks[i][1]][this.selected_blocks[i][2]] + " Coluna: " + this.selected_blocks[i][1] + " Posição: " + this.selected_blocks[i][2]);
            this.columns[this.selected_blocks[i][1]].splice(this.selected_blocks[i][2], 1);
            console.log("Coluna depois da remocao: " + this.columns[this.selected_blocks[i][1]]);
        }
        this.selected_blocks = [];
    };

    Game.prototype.is_column_full = function (id) {
        if (this.columns[id][0] == undefined || this.columns[id].length < this.COLUMNS_SIZE) {
            return false;
        }
        return true;
    };

    Game.prototype.finish = function() {
        this.end_game = true;

        // Stop background music
        this.background_music.pause();
        this.background_music.currentTime = 0;

        console.log("terminou jogo");
        $('#new_game').show('fast');

        // Aqui armazenar a pontuação em outro local
    };

    Game.prototype.create_new_block = function () {
        var column_id = Math.floor(Math.random() * 4), letter_id, letter, columns_full = 0;

        while (this.is_column_full(column_id)) {
            columns_full++;
            if (columns_full >= 4) {
                if (this.columns[0][0][1] >= 0 && this.columns[1][0][1] >= 0 && this.columns[2][0][1] >= 0 && this.columns[3][0][1] >= 0) {
                    this.finish();
                }

                // Situação em que todas as colunas estão cheias porém o muro não foi completado
                return;
            }

            if (column_id == this.COLUMNS_QUANTITY - 1) {
                column_id = 0;
            } else {
                column_id++;
            }
        }

        if (!this.end_game) {
            if (this.create_vowel) {
                do {
                    letter_id = Math.floor(Math.random() * this.VOWELS.length);    
                } while( ((this.VOWELS[letter_id][1] / this.letters_quantity) * 100) > this.VOWELS[letter_id][2]);
                
                letter = this.VOWELS[letter_id][0];
            } else {
                do {
                    letter_id = Math.floor(Math.random() * this.CONSONANTS.length);
                } while( ((this.CONSONANTS[letter_id][1] / this.letters_quantity) * 100) > this.CONSONANTS[letter_id][2]);

                letter = this.CONSONANTS[letter_id][0];
            }
            this.create_vowel = !this.create_vowel;
            this.letters_quantity++;

            // Adicionando na tela
            this.context.strokeRect(this.COLUMNS_INITIAL_POSITION_X[column_id], this.COLUMNS_INITIAL_POSITION_Y, this.BLOCK_WIDTH, this.BLOCK_HEIGHT);
            this.context.fillText(letter, this.LETTERS_POSITION_X[column_id], this.LETTERS_INITIAL_POSITION_Y);

            // Adicionando na coluna
            console.log(column_id, [letter, this.COLUMNS_INITIAL_POSITION_Y, 0]);
            console.table(this.selected_blocks);
            this.columns[column_id].push([letter, this.COLUMNS_INITIAL_POSITION_Y, 0]);
        }
    };

    Game.prototype.status = function() {
        return this.is_paused;
    };

    // 1 = pausar, 0 = continuar
    Game.prototype.change_status = function(status) {
        if(!this.end_game) {
            if($('#page').hasClass('flipped')) {
                if(status == 1) {
                    this.is_paused = true;
                    this.background_music.pause();;
                    $('#game-status-img').attr('src', 'app/assets/images/play-3-icon-32.png');
                } else {

                    this.background_music.volume = App.Objects.background_volume;
                    this.background_music.play();
                    this.sounds_effects_volume = App.Objects.sounds_effects_volume;
                    $('#game-status-img').attr('src', 'app/assets/images/pause-3-icon-32.png');
                    this.is_paused = false;
                }
            }
        }
    };

    Game.prototype.next_frame = function () {
        var i, j, next_block_position_y, actual_column_length, actual_column, block_length_and_position;

        this.context.clearRect(0, 0, 200, 350);

        if (!this.is_paused) {       
            
            if(this.frame_counter === 0) {
                this.create_new_block();
            }
            this.frame_counter++;
            if (this.frame_counter >= (this.frame * this.create_block_interval) ) {// seconds
                this.frame_counter = 0;
            }

            // Gerador gráfico
            for (j = 0; j < this.COLUMNS_QUANTITY; j++) {
                actual_column = this.columns[j];
                actual_column_length = actual_column.length;

                if (actual_column_length > 0) {

                    for (i = 0; i < actual_column_length; i++) {

                        block_length_and_position = actual_column[i][1] + this.BLOCK_HEIGHT;
                        // Caso exista um bloco posterior
                        if (i - 1 >= 0) {

                            next_block_position_y = actual_column[i - 1][1];

                            if (block_length_and_position + this.speed < next_block_position_y) {
                                actual_column[i][1] += this.speed;
                            } else if(block_length_and_position < next_block_position_y) {
                                actual_column[i][1] += next_block_position_y - block_length_and_position;
                            }

                        } else if (block_length_and_position + this.speed < this.SCREEN_HEIGHT) {
                            actual_column[i][1] += this.speed;
                        } else if (block_length_and_position < this.SCREEN_HEIGHT) {
                            actual_column[i][1] += this.SCREEN_HEIGHT - block_length_and_position;
                        }

                        // Definição da cor do bloco
                        if (this.columns[j][i][2]) {
                            if (this.columns[j][i][2] == 1) {
                                // Letra selecionada
                                this.context.fillStyle = "#3ADF00";
                            } else {
                                // Letra invalidada na formação da palavra
                                this.columns[j][i][2] = 0;
                                this.context.fillStyle = "#FF0000";
                            }

                            this.context.fillRect(this.COLUMNS_INITIAL_POSITION_X[j], this.columns[j][i][1], this.BLOCK_WIDTH, this.BLOCK_HEIGHT);
                            this.context.fillStyle = "black";
                        }

                        // Geração do bloco + letra
                        this.context.strokeRect(this.COLUMNS_INITIAL_POSITION_X[j], this.columns[j][i][1], this.BLOCK_WIDTH, this.BLOCK_HEIGHT);
                        this.context.fillText(this.columns[j][i][0], this.LETTERS_POSITION_X[j], this.columns[j][i][1] + this.BLOCK_HEIGHT - 10);
                    }
                }
            }
        } else {
            this.context.font = "15pt Arial";
            this.context.fillText("Jogo Pausado", 100, 175);
            this.context.font = "30pt Arial";
        }

    };

    // Pega posicao do mouse em relação ao canvas e não a janela.
    Game.prototype.get_mouse_position = function (event) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    Game.prototype.remove_block_from_selected = function (column_id, position_on_column) {
        var i, length = this.selected_blocks.length;
        for (i = 0; i < length; i++) {
            if (this.selected_blocks[i][1] == column_id && this.selected_blocks[i][2] == position_on_column) {
                this.selected_blocks.splice(i, 1);
                break;
            }
        }
    };

    Game.prototype.ascending_order_by_letter = function (block1, block2) {
        return block1[0] > block2[0];
    };

    Game.prototype.greater_index = function (selected_block1, selected_block2) {
        return selected_block1[2] - selected_block2[2];
    };

    Game.prototype.check_level = function() {
        var level = Math.floor(this.get_points() / this.POINTS_PER_LEVEL);

        if(level < 13) {
            this.speed = (level * this.SPEED_INCREASE) || this.speed;    
        } else if(this.create_block_interval > 1) {// seconds
            this.create_block_interval -= 0.5 * (level - 12);// seconds
        }
        
        console.log("speed atual: " + this.speed);
        console.log("create_block_interval: " + this.create_block_interval);// seconds
    };

    Game.prototype.change_score_on_screen = function() {
        this.score_screen.textContent = this.get_points();
    };

    // selected_block = [letter, column_id, position_id]
    Game.prototype.on_confirm = function () {
        var word_to_search = "", i, selected_blocks_length = this.selected_blocks.length, dictionary, dictionary_length;

        if (!this.is_paused) { 
            if (selected_blocks_length > 0) {
                this.selected_blocks.sort(this.ascending_order_by_letter);

                for (i = 0; i < selected_blocks_length; i++) {
                    word_to_search += this.selected_blocks[i][0];
                }

                if (this.DICTIONARY[word_to_search[0]] != undefined) {
                    dictionary = this.DICTIONARY[word_to_search[0]][selected_blocks_length - 1];
                    if (dictionary != undefined) {
                        dictionary_length = dictionary.length;
                        for (i = 0; i < dictionary_length; i++) {
                            if (dictionary[i] == word_to_search) {
                                this.confirm_sfx.play();
                                this.score();
                                this.check_level();
                                console.log("Pontuação: " + this.get_points());
                                console.log("palavra: " + word_to_search);
                                this.selected_blocks.sort(this.greater_index);
                                console.log("Blocos reoodernados: " + this.selected_blocks);
                                this.remove_selected_blocks();

                                return;
                            }
                        }
                    }
                }

                for (i = 0; i < selected_blocks_length; i++) {
                    this.columns[this.selected_blocks[i][1]][this.selected_blocks[i][2]][2] = 2;
                }
                this.selected_blocks = [];
                this.deny_sfx.play();
                console.log("não existe");
            }
        }
    };

    // on_confirm com enter
    Game.prototype.on_press_enter = function(event) {
        if(event.key == "Enter" || event.keyCode == 13) {
            this.on_confirm();
        }
    }

    Game.prototype.onclick = function (event) {
        var mouse_position = this.get_mouse_position(event), id, i;

        if (!this.is_paused) { 

            console.log(mouse_position.x, mouse_position.y);

            if (mouse_position.x < 50) {
                id = 0;
            } else if (mouse_position.x < 100) {
                id = 1;
            } else if (mouse_position.x < 150) {
                id = 2;
            } else if (mouse_position.x < 200) {
                id = 3;
            }

            for (i = 0; i < this.columns[id].length; i++) {
                if (mouse_position.y >= this.columns[id][i][1]) {

                    if (this.columns[id][i][2] === 0) {
                        this.columns[id][i][2] = 1;
                        this.selected_blocks.push([this.columns[id][i][0], id, i]);
                    } else {
                        this.columns[id][i][2] = 0;
                        this.remove_block_from_selected(id, i);
                    }
                    console.table(this.selected_blocks);
                    break;
                }
            }
        }
    };
    
    Game.prototype.call_next_frame = function () {
        this.next_frame();

        if(!this.end_game) {
            requestAnimationFrame(this.call_next_frame.bind(this));            
        }
    };

    return Game;
})();