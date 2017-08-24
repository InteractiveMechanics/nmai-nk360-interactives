/**
 * Loads data and initializes all functions
 * Data is scoped as a global variable
 */

var data = function() {};
$(function(){
    $.get('./data/m4a1.json', function(response) {
        data = response;

        Init.init();
        Instructions.init();
        Detail.init();

    }, 'json');
});
