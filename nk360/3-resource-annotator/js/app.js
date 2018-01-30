/**
 * Loads data and initializes all functions
 * Data is scoped as a global variable
 */

var data = function() {};
$(function(){
    if(/Android/.test(navigator.appVersion)) {
        $('body').addClass('browser-android');
        window.addEventListener("resize", function() {
            if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
                document.activeElement.scrollIntoView();
            }
        });
    }
    $.get(jsondata, function(response) {
        data = response;

        Init.init();
        Instructions.init();
        Annotator.init(data);


    }, 'json');
});