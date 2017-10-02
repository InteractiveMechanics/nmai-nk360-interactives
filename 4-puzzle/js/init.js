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
        $('#puzzle-header').html($.templates("#puzzle-header-template").render(data.puzzles[0]));
        $('#puzzle-wrapper').html($.templates('#puzzle-wrapper-template').render(data.puzzles[0]));
        $('#droppable-wrapper').html($.templates('#droppable-template').render(data.puzzles[0]));
        $('#learning-points').html($.templates('#learning-points-template').render(data.puzzles[0]));
        Puzzle.buildGame();
    }

 
    var displayIntroModal = function() {
        $('#intro').html($.templates('#intro-template').render(data.puzzles[0]));
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
