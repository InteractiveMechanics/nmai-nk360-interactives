Detail = (function() {

	 var init = function() {
        bindEvents();
    }

    var displayDetailScreen = function() {
    	$('#selection').addClass('hidden animated fadeOut');
    	//$('#detail-template').tmpl().appendTo('#detail');
    	$('#detail').removeClass('hidden').addClass('animated fadeIn');
        Init.isSelectionScreen();
        buildGame();
    }


    var buildGame = function() {
        $('.draggable-widget').draggable({
            snap: '.droppable-widget',
            //revert: 'invalid',
            snapMode: 'interior',
            snapTolerance: 20,
            cursorAt: {top: 10, left: 100}
        });

        $('.droppable-widget').droppable({
            drop: function( event, ui ) {
                var droppableNumber = $(this).data('timeline');
                var originalLeft = $(this).css('left');
                var originalTop = $(this).css('top');
              ;
              
                    if(ui.draggable.is('[data-timeline="' + droppableNumber + '"]')) {
                        alert('the thing is dropped!');

                        ui.draggable.addClass('dragged');
                        $(this).addClass('dropped');


                        ui.draggable.position({
                            my: "center",
                            at: "center",
                            of: $(this),
                            using: function(pos) {
                                $(this).animate(pos, 200, "linear");
                            }
                        });

                        ui.draggable.draggable('option', 'disabled', true);

                       


                    } else {
                        ui.draggable.draggable('option', 'revert', 'valid');
                    }
            
            }

        });

    }

    var bindEvents = function() {
        $(document).on('click tap', '.start-timeline-btn', displayDetailScreen);
    }

    


	return {

		init: init
	
	}


})();