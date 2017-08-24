Detail = (function() {

	 var init = function() {
        bindEvents();
    }

    var displayDetailScreen = function() {
    	$('#selection').addClass('hidden animated fadeOut');
    	$('#detail-template').tmpl().appendTo('#detail');
    	$('#detail').removeClass('hidden').addClass('animated fadeIn');
    }


    var bindEvents = function() {
    	$(document).on('click tap', '.start-timeline-btn', displayDetailScreen);
    }


	return {

		init: init
	
	}


})();