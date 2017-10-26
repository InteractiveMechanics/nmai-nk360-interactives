/**
 * All Instructions functions, data and event binding
 */
Instructions = (function() {
    var init = function() {
        checkQuerystring();
        bindEvents();
    }
    var bindEvents = function() {
        $(document).on('click tap', '#instructions', closeInstructions);
        $(document).on('click tap', '#show-instructions', openInstructions);
        $(document).on('click tap', '#close-instructions', closeInstructions);
        $(document).on('keypress', '#close-instructions', closeInstructionsKeypress);
    }
    var openInstructions = function() {
        $('#instructions').removeClass('hidden');
        setTimeout(function() {
            $('#instructions').addClass('show');
        }, 100);

        sendAnalyticsEvent('Instructions', 'open');
    }
    var closeInstructions = function() {
        var that = $(this);
        $(this).removeClass('show');
        setTimeout(function() {
            that.addClass('hidden');
        }, 500);

        sendAnalyticsEvent('Instructions', 'close');
    }
    var closeInstructionsKeypress = function(e) {
        if(e.which == 13){
            $('#close-instructions').click();
        }
    }

    var checkQuerystring = function() {
        if (getParameterByName('instructions') == 'false'){
            $('#instructions').addClass('hidden').removeClass('show');
        }
    }
    var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    return {
        init: init
    }
})();
