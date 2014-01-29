$(document).ready(function () {

    $('#jogar').click(function(){
        if (document.getElementById('canvas').getContext) {

            if(App.Objects.game && App.Objects.game.end_game === false) {
                App.Objects.game.change_status(0);
            } else {
                App.Objects.game = new App.Classes.Game('canvas', 'confirm_button', 'pontos', 'new_game');
                setTimeout(function() { App.Objects.game.call_next_frame() }, 2000);
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
                if(!App.Objects.game.end_game) {
                    if(App.Objects.game.status() === true) {
                        App.Objects.game.change_status(0);
                    } else {
                        App.Objects.game.change_status(1);
                    }
                }
                break;
            case 5:
                App.Objects.game.change_status(1);
                $('.card').removeClass('flipped');
        }
        
    });

    $('#new_game').click(function () {
        App.Objects.game = new App.Classes.Game('canvas', 'confirm_button', 'pontos', 'new_game');
        App.Objects.game.call_next_frame();
        $('#pontos').text('0');
        $(this).hide('fast');
    });

});