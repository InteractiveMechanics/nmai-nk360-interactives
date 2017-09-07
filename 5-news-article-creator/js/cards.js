/**
 * All setup and init functions, data and event binding
 */
Cards = (function() {
    var editor;
    var theme;
    var masthead;
    var headline;
    var images;
    var quotes;

    var totalCount;
    var imageCount;
    var quoteCount;

    var init = function() {
        Cards.images = new Array();
        Cards.quotes = new Array();

        Cards.totalCount = 0;
        Cards.imageCount = 0;
        Cards.quoteCount = 0;


        var imageTemplate = $.templates("#imageTemplate");
        var quoteTemplate = $.templates("#quoteTemplate");

        var imageTemplateHTMLOutput = imageTemplate.render(data.images);
        var quoteTemplateHTMLOutput = quoteTemplate.render(data.quotes);

        $("#image-selector .card-slider-container").html(imageTemplateHTMLOutput);
        $("#quote-selector .card-slider-container").html(quoteTemplateHTMLOutput);

        $("#image-selector .card-slider-container").slick({
            accessibility: false,
            autoplay: false,
            prevArrow: $('#image-selector .nav-arrow-left'),
            nextArrow: $('#image-selector .nav-arrow-right'),
            dots: true,
            infinite: false,
            swipe: true,
            touchMove: true
        });
        $("#image-captioning .card-slider-container").slick({
            accessibility: false,
            autoplay: false,
            prevArrow: $('#image-captioning .nav-arrow-left'),
            nextArrow: $('#image-captioning .nav-arrow-right'),
            dots: true,
            infinite: false,
            swipe: true,
            touchMove: true
        });
        $("#quote-selector .card-slider-container").slick({
            accessibility: false,
            autoplay: false,
            prevArrow: $('#quote-selector .nav-arrow-left'),
            nextArrow: $('#quote-selector .nav-arrow-right'),
            dots: true,
            infinite: false,
            swipe: true,
            touchMove: true
        });


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

        $(document).on('click tap', '.btn-theme', setTheme);
        $(document).on('click tap', '.image-step', toggleImage);
        $(document).on('click tap', '.quote-step', toggleQuote);

        $(document).on('change', '.image-caption-text', setCaption);

        $('#masthead').on('change', setMasthead);
        $('#headline').on('change', setHeadline);


        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();
    }


    var toggleImage = function() {
        var id = $(this).data('id');

        // If the image is not selected already
        if ($(this).hasClass('selected')){
            // and the totalCount and imageCount are above zero
            if ((Cards.totalCount > 0) && (Cards.imageCount > 0)){
                // Increment down by one each
                Cards.imageCount -= 1;
                Cards.totalCount -= 1;

                $(this).removeClass('selected');
                removeImageFromArray(id);
            }
            
        } else {
            // and the totalCount and imageCount are under their max
            if ((Cards.totalCount < 4) && (Cards.imageCount < 3)){
                // Increment up and toggle the selected class on
                Cards.imageCount += 1;
                Cards.totalCount += 1;

                $(this).addClass('selected');
                addImageToArray(id);
            }
        }
    }
    var addImageToArray = function(id) {
        var image = data.images[id];
        Cards.images[id] = image;
        Cards.images[id].id = id;

        updateImageCaptions(id, true);
    }
    var removeImageFromArray = function(id) {
        var index = Cards.images.indexOf(id);
        if (index > -1) {
            Cards.images.splice(index, 1);
        }
        updateImageCaptions(id, false);
    }


    var toggleQuote = function() {
        var id = $(this).data('id');

        // If the quote is not selected already
        if ($(this).hasClass('selected')){
            // and the totalCount and quoteCount are above zero
            if ((Cards.totalCount > 0) && (Cards.quoteCount > 0)){
                // Increment down by one each
                Cards.quoteCount -= 1;
                Cards.totalCount -= 1;

                $(this).removeClass('selected');
                removeQuoteFromArray(id);
            }

        } else {
            // and the totalCount and quoteCount are under their max
            if ((Cards.totalCount < 4) && (Cards.quoteCount < 3)){
                // Increment up and toggle the selected class on
                Cards.quoteCount += 1;
                Cards.totalCount += 1;

                $(this).addClass('selected');
                addQuoteToArray(id);
            }
        }
    }
    var addQuoteToArray = function(id) {
        var quote = data.quotes[id];
        Cards.quotes[id] = quote;
    }
    var removeQuoteFromArray = function(id) {
        var index = Cards.quotes.indexOf(id);
        if (index > -1) {
            Cards.quotes.splice(index, 1);
        }
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
    var setCaption = function() {
        var text = $(this).val();
        var id = $(this).parent().parent().data('id');

        Cards.images[id].caption = text;
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
    var getImages = function() {
        return Cards.images;
    }
    var getQuotes = function() {
        return Cards.quotes;
    }
    

    var updateWordCount = function() {
        var count = getEditorTextLength();
        $('.article-word-count').text(count + ' words');
    }
    var updateImageCaptions = function(id, addTo) {
        var captionTemplate = $.templates("#imageCaptionTemplate");
        var captionTemplateHTMLOutput = captionTemplate.render(Cards.images[id]);

        if (addTo) {
            $("#image-captioning .card-slider-container").slick('slickAdd', captionTemplateHTMLOutput);

            if (Cards.imageCount > 0) {
                $('#image-captioning h2').addClass('hidden');
                $('#image-captioning .card-slider-container').removeClass('hidden');
                $('#image-captioning .card-slider-nav').removeClass('hidden');
            }
        } else {
            var index = $("#image-captioning .card-slider-container").find('[data-id="' + id + '"]').data('slick-index');
            $("#image-captioning .card-slider-container").slick('slickRemove', index);

            if (Cards.imageCount == 0) {
                $('#image-captioning h2').removeClass('hidden');
                $('#image-captioning .card-slider-container').addClass('hidden');
                $('#image-captioning .card-slider-nav').addClass('hidden');
            }
        }
    }

    
    return {
        init: init,
        getEditorContents: getEditorContents,
        getTheme: getTheme,
        getMasthead: getMasthead,
        getHeadline: getHeadline,
        getImages: getImages,
        getQuotes: getQuotes
    }
})();
