/**
 * All setup and init functions, data and event binding
 */
Print = (function() {
    var init = function() {
        bindEvents();
    }
    var bindEvents = function() {
        $(document).on('click tap', '.print-preview-btn', openPrintPreview);
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
    var activatePrintPreview = function() {
        $('.print-preview-btn').removeClass('disabled').attr('disabled', false);
    }
    var buildPrintView = function() {
        // Get all of the data from the activity first
        var articleArray = Cards.getEditorContents();
        var article = buildArticleCopy(articleArray);
        var theme = Cards.getTheme();
        var masthead = Cards.getMasthead();
        var headline = Cards.getHeadline();

        // Then generate the newspaper
        $('.paper-preview-container').addClass(theme);
        $('.paper-preview-article').html(article);
        $('.paper-preview-masthead .byline').text(masthead);
        $('.paper-preview-headline').text(headline);
    }
    var buildArticleCopy = function(articleArray) {
        var html = '<p>';
        var count = articleArray.ops.length;

        for (i = 0; i < count; i++){
            if (articleArray.ops[i].attributes){
                if (articleArray.ops[i].attributes.bold){
                    html += '<b>';
                }
                if (articleArray.ops[i].attributes.italic){
                    html += '<i>';
                }
                if (articleArray.ops[i].attributes.underline){
                    html += '<u>';
                }

                html += buildArticleCopyText(articleArray.ops[i].insert);
                
                if (articleArray.ops[i].attributes.underline){
                    html += '</u>';
                }
                if (articleArray.ops[i].attributes.italic){
                    html += '</i>';
                }
                if (articleArray.ops[i].attributes.bold){
                    html += '</b>';
                }
            } else {
                html += buildArticleCopyText(articleArray.ops[i].insert);
            }
        }
        html += '</p>';
        return html;
    }
    var buildArticleCopyText = function(str) {
        var splitStr = str.split("\n");

        if (splitStr.length > 1) {
            var newStr = '';
            $.each(splitStr, function( index, value ) {
                newStr += value;
                newStr += '<br />'
            });
            return newStr;
        } else {
            return str;
        }
    }

    return {
        init: init,
        activatePrintPreview: activatePrintPreview
    }
})();
