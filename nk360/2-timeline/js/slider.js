/**
 * All slider functions, data and event binding
 */
Slider = (function() {
    var init = function() {
    	bindEvents();
    }

    /**
    * Gets the width of the window and if it is equal to or less than 991px, enables the slider, otherwise disables the slider.
    * @param no param
    * @return {string|int|array} returns nothing
    **/
    var checkSlider = function() {
        var windowWidth = $(window).width();
        if (windowWidth <= 991) {
            enableSlider();
        } else {
            disableSlider();
        }

    }

    /**
    * Sets the options for the Slick Slider.  
    * @param no param
    * @return {string|int|array} returns nothing
    **/
    var enableSlider = function() {
        $('.era-wrapper').slick({
            dots: true,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
                {
                breakpoint: 767,
                settings: {
                    dots: false 
                    }
                },
                {
                breakpoint: 480,
                settings: {
                    dots: false    
                    }
                }
   
            ]
        });
    }


    /**
    * If the slider has already been initializes, it disables the slider
    * @param no param
    * @return {string|int|array} returns nothing
    **/
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
