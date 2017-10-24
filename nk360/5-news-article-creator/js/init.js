/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    /**
     * Initializes all template content from JSON
     */
    var init = function() {
        generateGuidingQuestion();
        generatePaperTitle();
        generateReturnTo();
        generateCredits();

        bindEvents();
    }

    var bindEvents = function() {

    }
    
    var generateGuidingQuestion = function() {
        var question = data.question;
        $('.guiding-question').text(question);
    }

    var generatePaperTitle = function() {
        var paperTitle = data.paperTitle;
        $('.paper-title').text(paperTitle);
    }
    
    var generateReturnTo = function() {
        var returnTo = data.returnTo;
        $('#return-to')
            .attr('title', 'Return to ' + returnTo.title)
            .attr('href', returnTo.url)
            .find('div')
            .text('Return to ' + returnTo.title);
    }

    var generateCredits = function() {
        var credits = data.credits;
        $('#footer-credits').attr('data-content', credits);
    }
    
    return {
        init: init
    }
})();
