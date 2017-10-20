/**
 * Functions relating to mobile version of game
 */

 Mobile = (function() {
    var init = function() {
    	bindEvents();
    }

    var showMobileBtns = function() {
    	if ($('#mobile-btn-wrapper').hasClass('hidden'))  {
    		$('#mobile-btn-wrapper').removeClass('hidden');
    	}
    }

    var buildGame = function() {

        $('.lg-wrapper-card').lightGallery({
            controls: true
        });

        showMobileBtns();
    }



    var bindEvents = function() {
    }

    
    return {
        init: init
    }
})();
