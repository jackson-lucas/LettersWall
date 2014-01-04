App.Handlers.slide_click = $('.slide').click(function(){
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
    }
    
});