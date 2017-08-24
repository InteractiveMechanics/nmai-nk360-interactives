/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    var init = function() {
    	bindEvents();
    }

    var displaySelectionScreen = function() {
    	if ($('#selection').hasClass('hidden')) {
    		$('#selection').removeClass('hidden');
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

    

    var bindEvents = function() {
         $(document).on('click tap', '.icon-home', displaySelectionScreen);
         $(document).ready(isSelectionScreen);
    }
    
    return {
        init: init
    }
})();
