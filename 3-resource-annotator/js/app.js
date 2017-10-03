/**
 * Loads data and initializes all functions
 * Data is scoped as a global variable
 */

var data = function() {};
$(function(){
    $.get('./data/m1a1.json', function(response) {
        data = response;

        Init.init();
        Instructions.init();
        Annotator.init(data);


    }, 'json');
});