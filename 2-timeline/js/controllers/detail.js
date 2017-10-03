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
        var newMoments = randomMoments(data.eras[id-1].Moments);
        $("#draggable-wrapper").html($.templates("#draggable-template").render(newMoments));
    	$('#detail').removeClass('hidden fadeOut').addClass('animated fadeIn');
        Init.isSelectionScreen();
        buildGame(id);
    }

    var randomMoments = function(moments) {
        var newMoments = [];
        $.each(moments, function(key, val){
            var random = Math.floor(Math.random() * newMoments.length);
            newMoments.splice(random, 0, val);
        });
        console.log(newMoments);
        return newMoments;
    }

    var countDroppedEls = function() {
        if (!$('#detail').hasClass('hidden')) {
            var era = $('#droppable-container').attr('data-era');
            var numberDropped = $('.dropped').length;
            var numberDroppable = $('.droppable-widget').length;
            console.log(numberDropped);

            if (numberDropped == numberDroppable) {
                $('.era-block[data-era="' + era + '"]').addClass('completed');
                setTimeout(function() { displayExploreScreen(era); }, 750);
            }
        }
    }

    var displayExploreScreen = function(era) {
        
        
        if (era !== null && typeof era === 'object') {
            var era = $(this).attr('data-timeline');
            $('#explore').html($.templates("#explore-template").render(data));
            $('.transition-overlay').addClass('hidden');
             if (era == 1) {
                $('.era-container[data-era="2"]').addClass('hidden');
                $('.era-container[data-era="3"]').addClass('hidden');
            } else if (era == 2) {
                $('.era-container[data-era="3"]').addClass('hidden');
                $('.timeline-wrapper').css('width', '3500px');
            } else {
                $('.timeline-wrapper').css('width', '4800px');
            }
            console.log(era);
        } else {
            console.log('era is defined. it is ' + era);
            $('#explore').html($.templates("#explore-template").render(data));
            if (era == 1) {
                $('.era-container[data-era="2"]').addClass('hidden');
                $('.era-container[data-era="3"]').addClass('hidden');
            } else if (era == 2) {
                $('.era-container[data-era="3"]').addClass('hidden');
                $('.timeline-wrapper').css('width', '3500px');
            } else {
                $('.timeline-wrapper').css('width', '4800px');
            }
        }
        $('#explore').removeClass('animated fadeIn hidden');
        $('#selection').addClass('fadeOut hidden');
        $('#detail').addClass('fadeOut hidden');
    
    }



    var displayModal = function(era, moment) {
        $("#correct-answer").html($.templates("#modal-template").render(data.eras[era-1].Moments[moment-1]));
        $('#correct-answer').modal('show');
    }

    
    var hideText = function(id) {
       var id = $(this).attr('data-timeline');
       $('.draggable-text[data-timeline="' + id + '"]').addClass('active');
       $('.draggable-widget[data-timeline="' + id + '"]').addClass('active');
    }


    var showText = function(id) {
        var id = $(this).attr('data-timeline');
        if ($(this).hasClass('dragged')) {
            $('.draggable-text[data-timeline="' + id + '"]').addClass('active');
            $('.draggable-widget[data-timeline="' + id + '"]').addClass('active');
        } else {
            $('.draggable-text[data-timeline="' + id + '"]').removeClass('active');
            $('.draggable-widget[data-timeline="' + id + '"]').removeClass('active');
        }

    }

    
   

    var buildGame = function(id) {
        $('#lightgallery').lightGallery({
            subHtmlSelectorRelative: true
        });
        $('[data-toggle=tooltip]').tooltip('hide');
        $('.draggable-img-wrapper').draggable({
            appendTo: 'body',
            tolerance: 'touch',
            snap: '.droppable-widget',
            revert: 'invalid',
            snapMode: 'interior',
            snapTolerance: 10
            //cursorAt: {top: 0, left: 10}
        });

        $('.droppable-widget').droppable({

            drop: function( event, ui ) {
                

                var droppableNumber = $(this).data('timeline');
                var originalLeft = $(this).css('left');
                var originalTop = $(this).css('top');
              
              
                    if(ui.draggable.is('[data-timeline="' + droppableNumber + '"]')) {
                        ui.draggable.addClass('dragged');
                        ui.draggable.find('.draggable-overlay').removeClass('hidden');
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
                        var draggableNumber = ui.draggable.attr('data-timeline');
                        var draggableShell = $('.draggable-widget[data-timeline="' + draggableNumber + '"]');
                        setTimeout(function() {   draggableShell.tooltip('show'); }, 1000);
                        setTimeout(function() {   draggableShell.tooltip('hide'); }, 3000);
                       
                       
                    }
            
            }

        });

    }

    var bindEvents = function() {
        $(document).on('click tap', '.start-timeline-btn[data-timeline]', displayDetailScreen);
        $(document).on('click tap', '.view-timeline-btn[data-timeline]', displayExploreScreen);
        $(document).on('hidden.bs.modal', countDroppedEls);
        $(document).on('dragstart', '.draggable-img-wrapper[data-timeline]', hideText);
        $(document).on('dragstop', '.draggable-img-wrapper[data-timeline]', showText);
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


