/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    var init = function() {
    	bindEvents();
    }

    var displayPuzzleScreen = function() {
    	$('#intro').addClass('hidden animated fadeOut');
    	$('#puzzle').removeClass('hidden').addClass('animated fadeIn');
        Puzzle.buildGame();
    }

 
    var displayIntroModal = function() {
    	if ($('.intro-card').hasClass('hidden')) {
    		$('.intro-card').removeClass('hidden').addClass('animated slideInDown');
    	}
    }


    
    var bindEvents = function() {
    	$('body').on('click tap', '#intro', displayPuzzleScreen);
    	$('body').on('click tap', '#instructions', displayIntroModal);
    }
    
    return {
        init: init
    }
})();
