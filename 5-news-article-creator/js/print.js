/**
 * All setup and init functions, data and event binding
 */
Print = (function() {
    var init = function() {
        bindEvents();
    }
    var bindEvents = function() {
        $(document).on('click tap', '.print-preview-btn', openPrintPreview);
        $(document).on('click tap', '.icon-print', openPrintPreview);
        $(document).on('click tap', '.close-preview', closePrintPreview);
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
            $('#print-preview').addClass('hidden');
        }, 500);
    }
    var activatePrintPreview = function() {
        $('.print-preview-btn').removeClass('disabled').attr('disabled', false);
        $('.icon-print').removeClass('disabled').attr('disabled', false);
    }
    var buildPrintView = function() {
        // Get all of the data from the activity first
        var articleArray = Cards.getEditorContents();
        var article = buildArticleCopy(articleArray);
        var theme = Cards.getTheme();
        var masthead = Cards.getMasthead();
        var headline = Cards.getHeadline();
        var images = Cards.getImages();
        var quotes = Cards.getQuotes();
        var featured = Cards.getFeatured();

        // Then generate the newspaper
        buildMasthead(theme);
        $('.print-preview-container').addClass(theme);
        $('.paper-preview-article').html(article);
        $('.paper-preview-masthead .byline').text(masthead);
        buildHeadline(headline);
        
        $.each(images, function(key, val){
            var html = '';
            if (featured == val.id){
                html += '<figure class="featured">';
            }
            else {
                html += '<figure>';
            }
            html += '<img src="' + val.url + '" alt="' + val.credit + '" title="' + val.credit + '" />';
            html += '<figcaption>';
            if (val.caption){
                html += val.caption + ' ';
            }
            html += '<em>' + val.caption + '</em> ' + val.credit + '</figcaption>';
            html += '</figure>';

            $('.paper-preview-article').prepend(html);
        });
        $.each(quotes, function(key, val){
            var html = '';
            html += '<blockquote class="blockquote">';
            html += '<p>' + val.text + '</p>';
            html += '<footer class="blockquote-footer">' + val.source + ' </footer>';
            html += '</blockquote>';

            $('.paper-preview-article').append(html);
        });
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
                if (value.length > 1){
                    newStr += value;
                    newStr += '</p><p>';
                }
            });
            return newStr;
        } else {
            return str;
        }
    }
    var buildMasthead = function(theme) {
        var img;
        var cost;
        var html = '';

        var today = new Date();
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var date = monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();

        if (theme == 'traditional') {
            img = data.paperImageTraditional;
            cost = 'Twenty Five Cents';
        } else {
            img = data.paperImageModern;
            cost = '$2.65';
        }

        html += '<img class="paper-preview-title" src="' + img + '" alt="' + data.paperTitle + '" title="' + data.paperTitle + '" />';
        html += '<hr/>';
        html += '<span class="pull-left paper-preview-date">' + date + '&nbsp;&nbsp;&nbsp;Issue 1</span>';
        html += '<span class="pull-right paper-preview-cost">' + cost + '</span>';
        html += '<hr/>';

        $('.paper-preview-header').html(html);
    }
    var buildHeadline = function(headline) {
        if (headline){
            var length = headline.length;
    
            if (length <= 26) {
                $('.paper-preview-headline').addClass('large').text(headline);
            } else {
                $('.paper-preview-headline').text(headline);
            }
        }
    }

    return {
        init: init,
        activatePrintPreview: activatePrintPreview
    }
})();
