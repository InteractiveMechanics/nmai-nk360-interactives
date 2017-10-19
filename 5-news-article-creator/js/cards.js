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
    var featured;

    /**
     * Initializes all cards, renders templates, and builds sliders
     */
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
            touchMove: true,
            centerMode: true
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
            placeholder: 'What story do the sources tell about the compelling question? Construct a news article to address the question and explain how the sources support your argument.',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline']
                ],
                history: true
            }
        });

        bindEvents();
    }

    /**
     * Bind all events
     */
    var bindEvents = function() {
        Cards.editor.on('text-change', updateWordCount);

        $(document).on('click tap', '.btn-theme', setTheme);
        $(document).on('click tap', '.image-step img', toggleImage);
        $(document).on('click tap', '.quote-step', toggleQuote);
        $(document).on('click tap', '.featured', toggleFeatured);

        $(document).on('click tap', '#navigation .nav-arrow-right', function(){ sendAnalyticsEvent('Navigation', 'next'); });
        $(document).on('click tap', '#navigation .nav-arrow-left', function(){ sendAnalyticsEvent('Navigation', 'previous'); });

        $(document).on('change', '.image-caption-text', setCaption);

        $('#masthead').on('change', setMasthead);
        $('#headline').on('change', setHeadline);

        $('#step-by-step-cards').on('afterChange', changeStep);

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();
    }

    /**
     * When a slider's afterChange event is called, do something specific
     * based on which slide it is. Params from Slick.
     */
    var changeStep = function(event, slick, currentSlide) {
        var id = slick.$slider[0].id;
        var slide = $('.slick-track').children().eq(currentSlide).data('title');

        if (id == 'step-by-step-cards'){
            sendAnalyticsEvent('Navigation', 'Navigate to ' + slide);
    
            if (slide == 'Byline'){
                $('#masthead').focus();
            }
            if (slide == 'Article'){
                Cards.editor.focus();
            }
            if (slide == 'Headline'){
                $('#headline').focus();
            }
        }
    }

    /**
     * When an image is selected/deselected, toggle the UI for that
     * image and change the variables that track it
     */
    var toggleImage = function() {
        var id = $(this).data('id');

        // If the image is not selected already
        if ($(this).parent().parent().hasClass('selected')){
            // and the totalCount and imageCount are above zero
            if ((Cards.totalCount > 0) && (Cards.imageCount > 0)){
                // Increment down by one each
                Cards.imageCount -= 1;
                Cards.totalCount -= 1;

                $(this).parent().parent().removeClass('selected');
                removeImageFromArray(id);
            }
            
        } else {
            // and the totalCount and imageCount are under their max
            if ((Cards.totalCount < 4) && (Cards.imageCount < 3)){
                // Increment up and toggle the selected class on
                Cards.imageCount += 1;
                Cards.totalCount += 1;

                $(this).parent().parent().addClass('selected');
                addImageToArray(id);
            } else {
                // Checks to see if the total number of images/quotes is above 4
                checkTotalImagesQuotes();
            }
        }

        // Required to reload the slideshow for Image Captions
        // otherwise you run into a styling bug where width isn't properly set
        $('#image-captioning .card-slider-container').slick('setPosition');
    }

    /**
     * Add the image to the array by ID
     */
    var addImageToArray = function(id) {
        var image = data.images[id];
        Cards.images[id] = image;
        Cards.images[id].id = id;

        updateImageCaptions(id, true);
    }
    
    /**
     * Remove the image from array by ID
     */
    var removeImageFromArray = function(id) {
        Cards.images.splice(id, 1);
        updateImageCaptions(id, false);
    }

    /**
     * When an quote is selected/deselected, toggle the UI for that
     * quote and change the variables that track it
     */
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
            } else {
                // Checks to see if the total number of images/quotes is above 4
                checkTotalImagesQuotes();
            }
        }
    }

    /**
     * Add the quote to the array by ID
     */
    var addQuoteToArray = function(id) {
        var quote = data.quotes[id];
        Cards.quotes[id] = quote;
    }

    /**
     * Remove the quote from array by ID
     */
    var removeQuoteFromArray = function(id) {
        Cards.quotes.splice(id, 1);
    }

    /**
     * Checks to see if the total number of images and quotes
     * combined is greater than four, and if so, show an alert
     */
    var checkTotalImagesQuotes = function() {
        var message = '';

        if (Cards.totalCount == 4){
            message = 'Your article can only have up to four images and quotes total.';
        } else {
            if (Cards.quoteCount == 3){
                message = 'You can only have up to three quotes in your article at a time.';
            }
            if (Cards.imageCount == 3){
                message = 'You can only have up to three images in your article at a time.';
            }
        }

        $('#error-alert').text(message).removeClass('hidden');
        setTimeout(function() {
            $('#error-alert').addClass('show');

            setTimeout(function() {
                $('#error-alert').removeClass('show');

                setTimeout(function() {
                    $('#error-alert').addClass('hidden');
                }, 500);
            }, 5000);
        }, 100);
    }

    /**
     * Set the theme, which also triggers that the
     * print view is now activated
     */
    var setTheme = function() {
        $('.btn-theme').removeClass('active');
        $(this).addClass('active');
        Cards.theme = $(this).data('theme');
        Print.activatePrintPreview();
    }

    /**
     * Set the byline
     */
    var setMasthead = function() {
        Cards.masthead = $(this).val();
    }
    
    /**
     * Set the headline
     */
    var setHeadline = function() {
        Cards.headline = $(this).val();
    }

    /**
     * Set the caption's text
     */
    var setCaption = function() {
        var text = $(this).val();
        var id = $(this).parent().parent().parent().data('id');

        Cards.images[id].caption = text;
    }

    /**
     * Get the content of the QuillJS editor
     */
    var getEditorContents = function() {
        return Cards.editor.getContents();
    }

    /**
     * Get the length of the text from the editor
     */
    var getEditorTextLength = function() {
        var text = Cards.editor.getText();
        return text.split(" ").length;
    }

    /**
     * Getter functions for all printed elements
     */
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
    var getFeatured = function() {
        return Cards.featured;
    }

    /**
     * Logic to handle toggling the featured image on/off
     */
    var toggleFeatured = function() {
        var id = $(this).parent().parent().parent().data('id');
        console.log(Cards.featured, id);

        $('.featured').removeClass('active');
        if (parseInt(Cards.featured) == id) {
            Cards.featured = null;
        } else {
            $(this).addClass('active');
            Cards.featured = id;
        }
    }
    
    /**
     * Gets the word count and changes the UI based on number
     */
    var updateWordCount = function() {
        var count = getEditorTextLength();

        if (count > 250) {
            $('.article-word-count').addClass('error');
            $('.article-word-count').text((250-count) + ' words');
        } else {
            $('.article-word-count').removeClass('error');
            $('.article-word-count').text(count + ' words');
        }
    }

    /**
     * Logic to handle when images are changed (added/removed)
     */
    var updateImageCaptions = function(id, addTo) {
        if (addTo) {
            var captionTemplate = $.templates("#imageCaptionTemplate");
            var captionTemplateHTMLOutput = captionTemplate.render(Cards.images[id]);
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
        getQuotes: getQuotes,
        getFeatured: getFeatured
    }
})();
