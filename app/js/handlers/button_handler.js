$(document).ready(function () {

    $('#jogar').click(function(){
        if (document.getElementById('canvas').getContext) {

            if(App.Objects.game && App.Objects.game.acabar_jogo === false) {
                App.Objects.game.mudar_estado_do_jogo(0);
            } else {
                App.Objects.game = new App.Classes.Game('canvas', 'confirm_button', 'pontos', 'new_game');
                setTimeout(function() { App.Objects.game.chamar_proximo_frame() }, 2000);
                $('#new_game').hide('fast');
            }
            $('.card').addClass('flipped');
            
        } else {
            console.error('Canvas not supported');
        }
    });

    $('#submit').click(function(){
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
                if(App.Objects.game.estado_do_jogo() === true) {
                    App.Objects.game.mudar_estado_do_jogo(0);
                    $(this).find('img').attr('src', 'app/assets/images/pause-3-icon-32.png');
                } else {
                    App.Objects.game.mudar_estado_do_jogo(1);
                    $(this).find('img').attr('src', 'app/assets/images/play-3-icon-32.png');
                }
                break;
            case 5:
                App.Objects.game.mudar_estado_do_jogo(1);
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