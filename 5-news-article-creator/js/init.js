/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    var init = function() {
        generateGuidingQuestion();
        generateReturnTo();
    }
    
    var generateGuidingQuestion = function() {
        var question = data.question;

        $('.guiding-question').text(question);
    }
    
    var generateReturnTo = function() {
        var returnTo = data.returnTo;
        $('#return-to')
            .attr('title', 'Return to ' + returnTo.title)
            .attr('href', returnTo.url)
            .find('div')
            .text('Return to ' + returnTo.title);
    }
    
    return {
        init: init
    }
})();
