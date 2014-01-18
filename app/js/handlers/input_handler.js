$(document).ready(function () {
    $('li > input.input-type-range').change(function() {
        switch ( parseInt( $(this).data("value") ) ) {
            case 1:
                $('#som-ambiente-volume').text( $(this).val() );
                App.Objects.background_volume = ( $(this).val() / 100 );
                break;
            case 2:
                $('#efeitos-sonoros-volume').text( $(this).val() );
                App.Objects.sounds_effects_volume = ( $(this).val() / 100 );
        }
    });
});