App.Handlers.jogar_click = $('#jogar').click(function(){
    if (document.getElementById('canvasOne').getContext) {
        App.Objects.game = new App.Classes.Game('canvasOne', 'confirm_button');
        setTimeout(function() { App.Objects.game.chamar_proximo_frame() }, 2000);
        $('.card').addClass('flipped');
    } else {
        console.error('Canvas not supported');
    }
});

App.Handlers.confirm_click = $('#confirm_button').click(function(){
    
});

App.Handlers.submit_click = $('#submit').click(function(){
    // TODO Alterar audio somente se ouve mudanças

    $("#confirmation-alert").hide('fast');
    $("#confirmation-alert").show('fast');
    
});