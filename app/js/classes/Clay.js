App.Classes.Clay = ( function() { 
    var Clay = Clay || {};
    Clay.gameKey = "murodeletras";
    Clay.readyFunctions = [];
    Clay.ready = function( fn ) {
        Clay.readyFunctions.push( fn );
    };

    ( function() {
        var clay = document.createElement("script"); clay.async = true;
        clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api-leaderboard.js"; 
        var tag = document.getElementsByTagName("script")[0]; tag.parentNode.insertBefore(clay, tag);
    } )();

    return Clay;

})();