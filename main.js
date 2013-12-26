if (document.getElementById('canvasOne').getContext) {
    App.Objects.game = new App.Classes.Game('canvasOne', 'OK');
    App.Objects.game.chamar_proximo_frame();
} else {
    console.error('Canvas not supported');
}