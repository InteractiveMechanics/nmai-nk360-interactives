/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    var init = function() {
    	bindEvents();
    }

    var displaySelectionScreen = function() {
    	if ($('#selection').hasClass('hidden')) {
    		$('#selection').removeClass('hidden fadeOut').addClass('fadeIn');
            displayEra2();
            displayEra3();
            era3Complete();
    	}

    	if (!$('#detail').hasClass('hidden')) {
    		$('#detail').addClass('hidden');
    	}

    	if (!$('#explore').hasClass('hidden')) {
    		$('#explore').addClass('hidden');
    	}
    };

    var isSelectionScreen = function() {
    	if ($('#selection').hasClass('hidden')) {
    		$('.icon-home').removeClass('hidden');

    	} else {
    		$('.icon-home').addClass('hidden');
    	}
    }

    var displayEra2 = function() {
        if ($('.era-block[data-era="1"]').hasClass('completed')) {
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="2"]').find('.start-timeline-btn').removeClass('hidden');
            $('.era-block[data-era="2"]').addClass('active');

        }
    }

    var displayEra3 = function() {
        if ($('.era-block[data-era="2"]').hasClass('completed')) {
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
            $('.era-block[data-era="3"]').find('.start-timeline-btn').removeClass('hidden');
            $('.era-block[data-era="3"]').addClass('active');

        }
    }

    var era3Complete = function() {
        if ($('.era-block[data-era="3"]').hasClass('completed')) {
            $('.completed').find('.start-timeline-btn').addClass('hidden');
            $('.completed').find('.view-timeline-btn').removeClass('hidden'); 
        }
    }
    

    var bindEvents = function() {
         $(document).on('click tap', '.icon-home', displaySelectionScreen);
         $(document).ready(isSelectionScreen);
    }
    
    return {
        init: init,
        isSelectionScreen: isSelectionScreen
    }
})();
