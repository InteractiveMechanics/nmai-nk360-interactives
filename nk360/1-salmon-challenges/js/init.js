/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    var init = function() {
        generateCredits();
    }

    var generateCredits = function() {
        var credits = data.credits;
        $('#footer-credits').attr('data-content', credits);
    }
    
    return {
        init: init
    }
})();
