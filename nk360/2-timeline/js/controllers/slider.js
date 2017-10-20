/**
 * All slider functions, data and event binding
 */
Slider = (function() {
    var init = function() {
    	bindEvents();
    }

    var checkSlider = function() {
        var windowWidth = $(window).width();
        if (windowWidth <= 991) {
            enableSlider();
        } else {
            disableSlider();
        }

    }

    var enableSlider = function() {
        $('.era-wrapper').slick({
            dots: true,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1
        });
    }


    var disableSlider = function() {
        if($('.era-wrapper').hasClass('slick-initialized')) {
            $('.era-wrapper').unslick();
        }
    }
   
    

    var bindEvents = function() {
        $(document).ready(checkSlider);
        $(window).resize(checkSlider);
    }

    return {
        init: init,
    }
})();
