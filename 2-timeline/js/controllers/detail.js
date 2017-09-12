Detail = (function() {

	 var init = function() {
        bindEvents();
    }

    var displayDetailScreen = function() {
        var id = $(this).attr('data-timeline');
        console.log(id);
    	$('#selection').addClass('hidden animated fadeOut');
        $("#detail").html($.templates("#detail-template").render(data.eras[id-1]));
    	//$('#detail-template').tmpl().appendTo('#detail');
    	$('#detail').removeClass('hidden fadeOut').addClass('animated fadeIn');
        Init.isSelectionScreen();
        buildGame(id);
    }

    var countDroppedEls = function() {
        if (!$('#detail').hasClass('hidden')) {
            var era = $('#droppable-container').attr('data-era');
            var numberDropped = $('.dropped').length;
            var numberDroppable = $('.droppable-widget').length;
            console.log(numberDropped);

            if (numberDropped == numberDroppable) {
                $('.era-block[data-era="' + era + '"]').addClass('completed');
                setTimeout(function() { displayExploreScreen(era); }, 2000);
            }
        }
    }

    var displayExploreScreen = function(era) {
        if (era !== null && typeof era === 'object') {
            var booger = $(this).attr('data-timeline');
            $('#explore').html($.templates("#explore-template").render(data.eras[booger-1]));
            $('.transition-overlay').addClass('hidden');
            console.log(booger);
        } else {
            console.log('era is defined. it is ' + era);
            $('#explore').html($.templates("#explore-template").render(data.eras[era-1]));
        }
        $('#explore').removeClass('animated fadeIn hidden');
        $('#selection').addClass('fadeOut hidden');
        $('#detail').addClass('fadeOut hidden');
    
    }





    var displayModal = function(era, moment) {
        $("#correct-answer").html($.templates("#modal-template").render(data.eras[era-1].Moments[moment-1]));
        $('#correct-answer').modal('show');
    }

    


    var buildGame = function(id) {
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
                        ui.draggable.draggable('option', 'revert', 'invalid');


                        //alert('the thing is dropped!');

                        ui.draggable.addClass('dragged');
                        $(this).addClass('dropped');
                        displayModal(id, droppableNumber);


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
        $(document).on('click tap', '.start-timeline-btn[data-timeline]', displayDetailScreen);
        $(document).on('click tap', '.view-timeline-btn[data-timeline]', displayExploreScreen);
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


