/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    var init = function() {

    };

    var setupSlider = function() {
    	$('.slider').slick({
		  dots: true,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 3,
		  slidesToScroll: 3,
		  responsive: [
		    {
		      breakpoint: 600,
		      settings: {
		        slidesToShow: 2,
		        slidesToScroll: 2
		      }
		    },
		    {
		      breakpoint: 480,
		      settings: {
		        slidesToShow: 1,
		        slidesToScroll: 1
		      }
		    }
		  ]
		});
    }
    
    return {
        init: init,
        setupSlider: setupSlider
    }
})();
