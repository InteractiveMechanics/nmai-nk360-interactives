/**
 * All Instructions functions, data and event binding
 */
Instructions = (function() {
    var init = function() {
        bindEvents();
    }
    var bindEvents = function() {
        $('body').on('click tap', '#instructions', closeInstructions);
        $('body').on('click tap', '#show-instructions', openInstructions);
    }
    var openInstructions = function() {
        $('#instructions').removeClass('hidden');
        setTimeout(function() {
            $('#instructions').addClass('show');
        }, 100);
    }
    var closeInstructions = function() {
        var that = $(this);
        $(this).removeClass('show');
        setTimeout(function() {
            that.addClass('hidden');
        }, 500);
    }
    
    return {
        init: init
    }
})();
