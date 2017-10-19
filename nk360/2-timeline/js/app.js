/**
 * Loads data and initializes all functions
 * Data is scoped as a global variable
 */

var data = function() {};
$(function(){
    $.get(jsondata, function(response) {
        data = response;

        Init.init();
        Instructions.init();
        Detail.init();
        Explore.init();
        Slider.init();

    }, 'json');
});
