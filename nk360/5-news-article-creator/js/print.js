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
        $(document).on('click tap', '#print', triggerPrint);

        $(document).on('keypress', '.print-preview-btn', function(e) { if(e.which == 13){ $(this).click(); } });
        $(document).on('keypress', '.icon-print', function(e) { if(e.which == 13){ $(this).click(); } });
        $(document).on('keypress', '.close-preview', function(e) { if(e.which == 13){ $(this).click(); } });
        $(document).on('keypress', '#print', function(e) { if(e.which == 13){ $(this).click(); } });
    }

    /**
     * Opens the print view
     */
    var openPrintPreview = function() {
        buildPrintView();
        $('#print-preview').removeClass('hidden');
        $('#static-ui .print-preview-btn').addClass('hidden');
        setTimeout(function() {
            $('#print-preview').addClass('show');
        }, 100);

        sendAnalyticsEvent('Print preview', 'open');
    }

    /**
     * Closes the print view
     */
    var closePrintPreview = function() {
        $('#print-preview').removeClass('show');
        $('#static-ui .print-preview-btn').removeClass('hidden');
        setTimeout(function() {
            $('#print-preview').addClass('hidden');
        }, 500);

        sendAnalyticsEvent('Print preview', 'close');
    }

    /**
     * Trigger the browser's print method
     */
    var triggerPrint = function() {
        window.print();

        sendAnalyticsEvent('Print preview', 'print');
    }

    /**
     * Toggles the print preview buttons on
     */
    var activatePrintPreview = function() {
        $('.print-preview-btn').removeClass('disabled').attr('disabled', false);
        $('.icon-print').removeClass('disabled').attr('disabled', false);
    }

    /**
     * Builds the print preview from data stored
     */
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

        var content = [];

        // Then generate the newspaper
        buildMasthead(theme);
        $('.print-preview-container').removeClass('traditional modern');
        $('.print-preview-container').addClass(theme);
        $('.paper-preview-masthead .byline').text(masthead);
        $('.paper-preview-article .article-col').html('');
        buildHeadline(headline);

        content = article.split('<break>');
        
        $.each(images, function(key, val){
            if (val){
                var html = '';
                if (featured == val.id){
                    html += '<figure class="featured">';
                }
                else {
                    html += '<figure>';
                }
                if (val.credit){
                    html += '<div class="image-wrapper"><img src="' + val.url + '" alt="' + val.credit + '" title="' + val.credit + '" /></div>';
                } else {
                    html += '<div class="image-wrapper"><img src="' + val.url + '" /></div>';
                }
                
                html += '<figcaption>';
                if (val.caption){
                    html += val.caption + ' ';
                }
                if (val.credit){
                    html += '<em>' + val.credit + '</em>';
                }
                html += '</figcaption>';
                html += '</figure>';
    
                if (featured == val.id){
                    content.unshift(html);
                } else {
                    content.push(html);
                }
            }
        });
        $.each(quotes, function(key, val){
            if (val){
                var html = '';
                html += '<blockquote class="blockquote">';
                if (val.text){
                    html += '<p>' + val.text + '</p>';
                }
                if (val.source){
                    html += '<footer class="blockquote-footer">' + val.source + ' </footer>';
                }
                html += '</blockquote>';
    
                content.push(html);
            }
        });

        var contentCount = 0;
        console.log(content.length);
        console.log(content);

        $.each(content, function(key, val){
            if (val !== '<p></p>'){
                if (contentCount < Math.ceil((content.length-1)/3)){
                    $('.article-col-1').append(val);
                } else if (contentCount < Math.ceil((content.length-1)/3)*2){
                    $('.article-col-2').append(val);
                } else {
                    $('.article-col-3').append(val);
                }
                contentCount++;
                console.log(contentCount);
            }
        });
    }

    /**
     * Takes the raw input of the QuillJS editor and applies
     * appropriate HTML markup to it for styling and spacing
     */
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

    /**
     * Adds in the correct amount of article text, splitting it
     * on new lines by adding in appropriate HTML markup
     */
    var buildArticleCopyText = function(str) {
        var splitStr = str.split("\n");

        if (splitStr.length > 1) {
            var newStr = '';
            $.each(splitStr, function( index, value ) {
                if (value.length > 1){
                    newStr += value;
                    newStr += '</p><break><p>';
                }
            });
            return newStr;
        } else {
            return str;
        }
    }

    /**
     * Builds the masthead with today's date, theme, and other custom items
     */
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

    /**
     * Builds the headline based on the number of characters
     */
    var buildHeadline = function(headline) {
        if (headline){
            var length = headline.length;
    
            if (length <= 24) {
                $('.paper-preview-headline').addClass('large').text(headline);
            } else {
                $('.paper-preview-headline').removeClass('large').text(headline);
            }
        }
    }

    return {
        init: init,
        activatePrintPreview: activatePrintPreview
    }
})();
