/**
 * All setup and init functions, data and event binding
 */
Init = (function() {
    var init = function() {
    	bindEvents();
    }

    var displayPuzzleScreen = function() {
    	$('#puzzle').removeClass('hidden').addClass('animated fadeIn');
        $('#puzzle-header').html($.templates("#puzzle-header-template").render(data.puzzles[0]));
        $('#puzzle-wrapper').html($.templates('#puzzle-wrapper-template').render(data.puzzles[0]));
        $('#droppable-wrapper').html($.templates('#droppable-template').render(data.puzzles[0]));
        $('#complete-overlay').html($.templates('#complete-template').render(data.puzzles[0]));
        $('#learning-points').html($.templates('#learning-points-template').render(data.puzzles[0]));
        Puzzle.buildGame();
        setHeaderTooltip();
    }

    var setHeaderTooltip = function() {
         $('.header-themes').tooltip({
            trigger: 'hover focus'
         });
    }
 
    var displayIntroModal = function() {
        $('#intro').html($.templates('#intro-template').render(data.puzzles[0]));
    	if ($('.intro-card').hasClass('hidden')) {
    		$('.intro-card').removeClass('hidden').addClass('animated slideInDown');
    	}
        //displayPuzzleScreen();
    }

    var hideIntroModal = function() {
        $('#intro').addClass('hidden animated fadeOut');
    }


    
    var bindEvents = function() {
        $(document).ready(displayPuzzleScreen);
    	$('body').on('click tap', '#intro', hideIntroModal);
    	$('body').on('click tap', '#instructions', displayIntroModal);
    }
    
    return {
        init: init
    }
})();
