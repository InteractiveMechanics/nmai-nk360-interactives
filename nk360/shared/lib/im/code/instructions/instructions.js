/**
 * All Instructions functions, data and event binding
 */
Instructions = (function() {
    var init = function() {
        bindEvents();
    }
    var bindEvents = function() {
        $(document).on('click tap', '#instructions', closeInstructions);
        $(document).on('click tap', '#show-instructions', openInstructions);
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
    
    return {
        init: init
    }
})();
