/**
 * All setup and init functions, data and event binding
 */
Cards = (function() {
    var editor;
    var theme;
    var masthead;
    var headline;

    var init = function() {
        $('#step-by-step-cards').slick({
            accessibility: false,
            autoplay: false,
            prevArrow: $('#navigation .nav-arrow-left'),
            nextArrow: $('#navigation .nav-arrow-right'),
            dots: true,
            draggable: false,
            infinite: false,
            swipe: false,
            touchMove: true,
            customPaging: function(slider, i) {
                var title = $(slider.$slides[i]).data('title');
                return '<a data-toggle="tooltip" title="' + title + '"></a>';
            }
        });
        Cards.editor = new Quill('#text-editor', {
            debug: false,
            theme: 'snow',
            placeholder: 'Lorem ipsum sit dolor amet',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline']
                ],
                history: true
            }
        });

        bindEvents();
    }
    var bindEvents = function() {
        Cards.editor.on('text-change', updateWordCount);

        $('body').on('click tap', '.btn-theme', setTheme);
        $('#masthead').on('change', setMasthead);
        $('#headline').on('change', setHeadline);

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();
    }

    var setTheme = function() {
        $('.btn-theme').removeClass('active');
        $(this).addClass('active');
        Cards.theme = $(this).data('theme');
        Print.activatePrintPreview();
    }
    var setMasthead = function() {
        Cards.masthead = $(this).val();
    }
    var setHeadline = function() {
        Cards.headline = $(this).val();
    }

    var getEditorContents = function() {
        return Cards.editor.getContents();
    }
    var getEditorTextLength = function() {
        var text = Cards.editor.getText();
        return text.split(" ").length;
    }
    var getTheme = function() {
        return Cards.theme;
    }
    var getMasthead = function() {
        return Cards.masthead;
    }
    var getHeadline = function() {
        return Cards.headline;
    }

    var updateWordCount = function() {
        var count = getEditorTextLength();
        $('.article-word-count').text(count + ' words');
    }
    
    return {
        init: init,
        getEditorContents: getEditorContents,
        getTheme: getTheme,
        getMasthead: getMasthead,
        getHeadline: getHeadline
    }
})();
