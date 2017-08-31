/**
 * All setup and init functions, data and event binding
 */
Cards = (function() {
    var editor;

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
            debug: 'info',
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
    }

    var getEditorContents = function() {
        return Cards.editor.getContents();
    }
    var getEditorTextLength = function() {
        var text = Cards.editor.getText();
        return text.split(" ").length;
    }

    var updateWordCount = function() {
        var count = getEditorTextLength();
        $('.article-word-count').text(count + ' words');
    }
    
    return {
        init: init,
        getEditorContents: getEditorContents
    }
})();
