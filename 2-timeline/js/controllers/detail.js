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

    var countDroppedEls = function() {
        var numberDropped = $('.dropped').length;
        console.log(numberDropped);
        if (numberDropped == 5) {
            setTimeout(function() { displayExploreScreen(); }, 2000);
        }
    }

    var displayExploreScreen = function() {
        $('#explore').removeClass('animated fadeIn hidden');
        $('#detail').addClass('fadeOut hidden');
    }



    var displayModal = function() {
         $('#correct-answer').modal('show');
    }

    


    var buildGame = function() {
        $('[data-toggle=tooltip]').tooltip('hide');
        $('.draggable-widget').draggable({
            tolerance: 'touch',
            snap: '.droppable-widget',
            revert: 'invalid',
            snapMode: 'interior',
            snapTolerance: 10,
            //cursorAt: {top: 10, left: 10}
        });

        $('.droppable-widget').droppable({
            drop: function( event, ui ) {
                

                var droppableNumber = $(this).data('timeline');
                var originalLeft = $(this).css('left');
                var originalTop = $(this).css('top');
              
              
                    if(ui.draggable.is('[data-timeline="' + droppableNumber + '"]')) {
                        ui.draggable.addClass('dragged');

                        alert('the thing is dropped!');

                        ui.draggable.addClass('dragged');
                        $(this).addClass('dropped');
                        displayModal();


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
                        setTimeout(function() {   ui.draggable.tooltip('show'); }, 1000);

                        setTimeout(function() {   ui.draggable.tooltip('hide'); }, 3000);
                       
                       
                    }
            
            }

        });

    }

    var bindEvents = function() {
        $(document).on('click tap', '.start-timeline-btn', displayDetailScreen);
        $(document).on('hidden.bs.modal', countDroppedEls);
    }

    


	return {

		init: init,
        displayExploreScreen: displayExploreScreen,
        displayModal: displayModal
	
	}


})();


/*
var template = $.templates("#theTmpl");

var htmlOutput = template.render(data);

$("#result").html(htmlOutput);

$("#result").html($.templates("#theTmpl").render(data));
*/


