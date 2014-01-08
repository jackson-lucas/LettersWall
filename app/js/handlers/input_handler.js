$(document).ready(function () {
    $('li > input.input-type-range').change(function() {
        switch ( parseInt( $(this).data("value") ) ) {
            case 1:
                $('#som-ambiente-volume').text( $(this).val() );
                break;
            case 2:
                $('#efeitos-sonoros-volume').text( $(this).val() );
        }
    });
});