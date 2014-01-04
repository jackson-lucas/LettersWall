App.Handlers.jogar_click = $('#jogar').click(function(){
    $('.card').addClass('flipped');
});

App.Handlers.ok_click = $('#confirm_button').click(function(){
    $('.card').removeClass('flipped');
});

App.Handlers.submit_click = $('#submit').click(function(){
    // TODO Alterar audio somente se ouve mudanças

    $("#confirmation-alert").hide('fast');
    $("#confirmation-alert").show('fast');
    
});