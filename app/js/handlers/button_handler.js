$(document).ready(function () {

    $('#jogar').click(function(){
        if (document.getElementById('canvas').getContext) {

            if(App.Objects.game) {
                App.Objects.game.pausar_jogo = false;
            } else {
                App.Objects.game = new App.Classes.Game('canvas', 'confirm_button', 'pontos', 'new_game');
                setTimeout(function() { App.Objects.game.chamar_proximo_frame() }, 2000);
            }
            $('.card').addClass('flipped');
            
        } else {
            console.error('Canvas not supported');
        }
    });

    $('#submit').click(function(){
        // TODO Alterar audio somente se ouve mudanças

        $("#confirmation-alert").hide('fast');
        $("#confirmation-alert").show('fast');
        
    });

    $('.nav-button').click(function(){
        switch( parseInt( $(this).data("value") ) ) {
            case 1:
                $('#instructions').slideToggle('slow');
                break;
            case 2:
                $('#about').slideToggle('slow');
                break;
            case 3:
                $('#options').slideToggle('slow');
                $("#confirmation-alert").hide('slow');
                break;
            case 4:
                if(App.Objects.game.pausar_jogo === true) {
                    App.Objects.game.pausar_jogo = false;
                    $(this).find('img').attr('src', 'app/assets/images/pause-3-icon-32.png');
                } else {
                    App.Objects.game.pausar_jogo = true;
                    $(this).find('img').attr('src', 'app/assets/images/play-3-icon-32.png');
                }
                break;
            case 5:
                App.Objects.game.pausar_jogo = true;
                $('.card').removeClass('flipped');
        }
        
    });

    $('#new_game').click(function () {
        App.Objects.game = new App.Classes.Game('canvas', 'confirm_button', 'pontos', 'new_game');
        App.Objects.game.chamar_proximo_frame();
        $('#pontos').text('0');
        $(this).hide('fast');
    });

});