App.Handlers.jogar_click = $('#jogar').click(function(){
    $('.card').addClass('flipped');
});

App.Handlers.ok_click = $('#confirm_button').click(function(){
    $('.card').removeClass('flipped');
});