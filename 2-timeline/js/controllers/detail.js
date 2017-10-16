Detail = (function() {

    timelineWidth = 2143;

    var tooltipShowTimeout;
    var tooltipHideTimeout;

	var init = function() {
        bindEvents();
    }

    var displayDetailScreen = function() {
        var id = $(this).attr('data-timeline');
    	$('#selection').addClass('hidden animated fadeOut');
        $("#detail").html($.templates("#detail-template").render(data.eras[id-1]));
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
        return newMoments;
    }

    var countDroppedEls = function() {
        if (!$('#detail').hasClass('hidden')) {
            var era = $('#droppable-container').attr('data-era');
            var numberDropped = $('.dropped').length;
            var numberDroppable = $('.droppable-widget').length;

            if (numberDropped == numberDroppable) {
                $('.era-block[data-era="' + era + '"]').addClass('completed');
                setTimeout(function() { displayExploreScreen(era); }, 750);
            }
        }
    }

    var setupTimelineScroll = function() {
        var containX1 = $('.timeline-wrapper').parent().offset().left;
        var containY1 = $('.timeline-wrapper').parent().offset().top;
        var containX2 =  ($(".timeline-wrapper").parent().outerWidth() + $(".timeline-wrapper").parent().offset().left - Detail.timelineWidth);
        var containY2 =  ($(".timeline-wrapper").parent().outerHeight() +  $(".timeline-wrapper").parent().offset().top - $('.timeline-wrapper').outerHeight()); 


        $('.timeline-wrapper').draggable({
            axis: 'x',
            containment: [containX1, containY1, containX2, containY1]
        });
    }     

   

    var displayExploreScreen = function(era) {
       
        //this is for 'view my timeline'
        if (era !== null && typeof era === 'object') {
            var era = $(this).attr('data-timeline');
            $('#explore').html($.templates("#explore-template").render(data));
            $('.transition-overlay').addClass('hidden');

             if (era == 1) {
                $('.era-container[data-era="2"]').addClass('hidden');
                $('.era-container[data-era="3"]').addClass('hidden');
                Detail.timelineWidth = 2143;
            } else if (era == 2) {
                $('.era-container[data-era="3"]').addClass('hidden');
                $('.timeline-wrapper').css('left', -1780);
                Detail.timelineWidth = 3500;
            } else {
                $('.timeline-wrapper').css('left', -3340)
                Detail.timelineWidth = 4800;
            }
        } else {
            console.log('era is defined. it is ' + era);
            $('#explore').html($.templates("#explore-template").render(data));
            $('.transition-overlay').html($.templates('#complete-template').render(data.eras[era-1]));
            if (era == 1) {
                $('.era-container[data-era="2"]').addClass('hidden');
                $('.era-container[data-era="3"]').addClass('hidden');
                Detail.timelineWidth = 2143;
                setupTimelineScroll();               
                

            } else if (era == 2) {
                $('.era-container[data-era="3"]').addClass('hidden');
                $('.timeline-wrapper').css('left', -1780);
                Detail.timelineWidth = 3500;
                setupTimelineScroll();

            } else {
                Detail.timelineWidth = 4800;
                $('.timeline-wrapper').css('left', -3340);
                setupTimelineScroll();
            }
        }
        $('#explore').removeClass('animated fadeIn hidden');
        $('#selection').addClass('fadeOut hidden');
        $('#detail').addClass('fadeOut hidden');    
    
    }



    var displayModal = function(era, moment) {
        $("#correct-answer").html($.templates("#modal-template").render(data.eras[era-1].Moments[moment-1])).modal('show');
        $('[data-toggle=tooltip]').tooltip('hide');
    }

    var reopenModal = function() {
        var moment = $(this).attr('data-timeline');
        var era = $('#droppable-container').attr('data-era');
        displayModal(era, moment);
    } 

    var hideModal = function() {
        $('#correct-answer').modal('hide');
    }

    var showModal = function() {
        $('#correct-answer').modal('show');
    }

    
    var hideText = function(id) {
       var id = $(this).attr('data-timeline');
       $('.draggable-widget').tooltip('hide');
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
                        ui.draggable.draggable('option', 'revert', true);
                        var draggableNumber = ui.draggable.attr('data-timeline');
                        var draggableShell = $('.draggable-widget[data-timeline="' + draggableNumber + '"]');
                        setTimeout(function() {   draggableShell.tooltip('show'); }, 1000);
                        setTimeout(function() {   draggableShell.tooltip('hide'); }, 5000);
                       
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
        $(document).on('click tap', '.dragged[data-timeline]', reopenModal);
        $(document).on('onBeforeOpen.lg', hideModal);
        $(document).on('onBeforeClose.lg', showModal);   

    }

    


	return {

		init: init,
        displayExploreScreen: displayExploreScreen,
        displayModal: displayModal,
        timelineWidth: timelineWidth
	
	}


})();




