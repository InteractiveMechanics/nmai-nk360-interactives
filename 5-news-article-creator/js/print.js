/**
 * All setup and init functions, data and event binding
 */
Print = (function() {
    var init = function() {
        bindEvents();
    }
    var bindEvents = function() {
        $('#print-your-paper-btn').on('click tap', openPrintPreview);
    }

    var openPrintPreview = function() {
        buildPrintView();
        $('#print-preview').removeClass('hidden');
        setTimeout(function() {
            $('#print-preview').addClass('show');
        }, 100);
    }
    var closePrintPreview = function() {
        $('#print-preview').removeClass('show');
        setTimeout(function() {
            that.addClass('hidden');
        }, 500);
    }
    var buildPrintView = function() {
        // Get all of the data from the activity first
        var articleRaw = Cards.getEditorContents();
        var article = articleRaw.ops[0].insert;

        // Then generate the newspaper
        $('.paper-preview').html(article);
    }

    return {
        init: init
    }
})();
