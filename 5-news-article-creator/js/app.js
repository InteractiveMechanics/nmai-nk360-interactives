var data = function() {};
$(function(){
    $.get('./data/m4a1.json', function(response) {
        data = response;

        Init.init();

    }, 'json');
});