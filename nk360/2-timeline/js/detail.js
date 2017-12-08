Detail = (function() {

    timelineWidth = 2143;

    var tooltipShowTimeout;
    var tooltipHideTimeout;
    var lessonPlan1 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars-tactics/index.html';
    var lessonPlan2 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/backlash.cshtml';
    var lessonPlan3 = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/justice.cshtml';
    var lessonPlanComplete = 'http://nmai-webdev01.si.edu:84/nk360/pnw-fish-wars/index.cshtml#summative';




	var init = function() {
        bindEvents();
    }


    /**
    * Displays the Detail Screen by hiding the Selection screen and rendering data for the appropriate era.  It also calls the function that builds the drag-and-drop game and the function that shuffles the draggable elements.
    * @param takes no arguments
    * @return {string|int|array} does not return anything.  
    **/
    var displayDetailScreen = function() {
        Init.getEra();
        var id = $(this).attr('data-timeline');
        Init.updateURL(id);
    	$('#selection').addClass('hidden animated fadeOut');
        $("#detail").html($.templates("#detail-template").render(data.eras[id-1]));
        var newMoments = randomMoments(data.eras[id-1].Moments);
        $("#draggable-wrapper").html($.templates("#draggable-template").render(newMoments));
    	$('#detail').removeClass('hidden fadeOut').addClass('animated fadeIn');
        Init.isSelectionScreen();
        buildGame(id);
        sendAnalyticsScreen('Builder screen - ' + id);
    }


    /**
    * Shuffles the draggable elements (aka moments)
    * @param moments - an object
    * @return {string|int|array} an array of the shuffled moments  
    **/
    var randomMoments = function(moments) {
        var newMoments = [];
        $.each(moments, function(key, val){
            var random = Math.floor(Math.random() * newMoments.length);
            newMoments.splice(random, 0, val);
        });
        return newMoments;
    }


    /**
    * Gets the length of the number of dropped elements and compares that to the total number of droppable elememnts.  If the two numbers are equal, it displays the Explore screen
    * @param takes no parameters
    * @return {string|int|array} returns nothing; calls the function that displays the Explore screen if the number of dropped elements equals the number of droppable elements
    **/
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


    
   
    /**
    * This displays the Explore screen based on the designated era. It hides/shows the appropriate eras and, this is important, determines the width of the timeline.  Hides other screen.  Is called when the user click taps the Start This Timeline or View My Timeline buttons.
    * @param the value of the data attribute data-era, which is an integer
    * @return {string|int|array} returns nothing; displays the Explore screen if the number of dropped elements equals the number of droppable elements
    **/
    var displayExploreScreen = function(era) {
        if ($('.icon-home').hasClass('hidden')) {
            $('.icon-home').removeClass('hidden');
        }
        //this is for 'view my timeline'
        if (era !== null && typeof era === 'object') {
            var era = $(this).attr('data-timeline');
            var windowWidth = $(window).width();
          
            $('#explore').html($.templates("#explore-template").render(data));
            $('.transition-overlay').addClass('hidden');

             if (era == 1) {
                $('#back-to-module-btn').attr('href', lessonPlan1);
                $('.era-container[data-era="2"]').addClass('hidden');
                $('.era-container[data-era="3"]').addClass('hidden');
                Detail.timelineWidth = 2143;
                if (windowWidth <= 767) {
                    $('#explore').scrollLeft(0);
                } 
                $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era2').removeClass('timeline-wrapper-mobile-era3').removeClass('timeline-wrapper-mobile-era4').addClass('timeline-wrapper-mobile-era1');
                sendAnalyticsScreen('Explore screen - era 1');

            } else if (era == 2) {
                $('#back-to-module-btn').attr('href', lessonPlan2);
                $('.era-container[data-era="3"]').addClass('hidden');
                $('.timeline-wrapper').css('left', -1780);
                $('#prev-btn').removeClass('disabled');
                Detail.timelineWidth = 3500;
                $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era1').removeClass('timeline-wrapper-mobile-era3').removeClass('timeline-wrapper-mobile-era4').addClass('timeline-wrapper-mobile-era2');

                if (windowWidth <= 767) {
                    setTimeout(function(){ $('#explore').scrollLeft(1780); }, 0);
                } 
                sendAnalyticsScreen('Explore screen - era 2');

            } else if (era == 3) {
                $('#back-to-module-btn').attr('href', lessonPlan3);
                $('.timeline-wrapper').css('right', 0); //left, -3340
                Detail.timelineWidth = 4800;
                $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era1').removeClass('timeline-wrapper-mobile-era2').removeClass('timeline-wrapper-mobile-era4').addClass('timeline-wrapper-mobile-era3');
                if (windowWidth <= 767) {
                    setTimeout(function(){ $('#explore').scrollLeft(3340); }, 0);
                } 
                $('#prev-btn').removeClass('disabled');
                sendAnalyticsScreen('Explore screen - era 3');
            } else {
                $('#back-to-module-btn').attr('href', lessonPlanComplete);
                $('.timeline-wrapper').css('right', 0); //left -3340
                $('#prev-btn').removeClass('disabled');
                Detail.timelineWidth = 4800;
                $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era1').removeClass('timeline-wrapper-mobile-era2').removeClass('timeline-wrapper-mobile-era3').addClass('timeline-wrapper-mobile-era4');
                if (windowWidth <= 767) {
                    setTimeout(function(){ $('#explore').scrollLeft(3340); }, 0);
                } 
                sendAnalyticsScreen('Explore screen - era 4');

            }
        } else {
           
            $('#explore').html($.templates("#explore-template").render(data));
            $('.transition-overlay').html($.templates('#complete-template').render(data.eras[era-1]));
            if (era == 1) {
                $('#back-to-module-btn').attr('href', lessonPlan1);
                $('.era-container[data-era="2"]').addClass('hidden');
                Detail.timelineWidth = 2143;
                  $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era2').removeClass('timeline-wrapper-mobile-era3').removeClass('timeline-wrapper-mobile-era4').addClass('timeline-wrapper-mobile-era1')
                sendAnalyticsScreen('Explore screen - era 1');               

            } else if (era == 2) {
                $('#back-to-module-btn').attr('href', lessonPlan2);
                $('.era-container[data-era="3"]').addClass('hidden');
                $('.timeline-wrapper').css('left', -1780);
                 $('#prev-btn').removeClass('disabled');
                Detail.timelineWidth = 3500;
                $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era1').removeClass('timeline-wrapper-mobile-era3').removeClass('timeline-wrapper-mobile-era4').addClass('timeline-wrapper-mobile-era2');
                if (windowWidth <= 767) {
                    //$('#explore').scrollLeft(1780);
                    //console.log('testing else');
                } 
                sendAnalyticsScreen('Explore screen - era 2');

            } else if (era == 3) {
                $('#back-to-module-btn').attr('href', lessonPlan3);
                Detail.timelineWidth = 4800;
                 $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era1').removeClass('timeline-wrapper-mobile-era2').removeClass('timeline-wrapper-mobile-era4').addClass('timeline-wrapper-mobile-era3');
                $('.timeline-wrapper').css('right', 0); //left, -3340
                $('#prev-btn').removeClass('disabled');
                sendAnalyticsScreen('Explore screen - era 3');
            } else {
                $('#back-to-module-btn').attr('href', lessonPlanComplete);
                $('.timeline-wrapper').css('right', 0); //left, -3340
                $('#prev-btn').removeClass('disabled');
                Detail.timelineWidth = 4800;
                $('.timeline-wrapper').removeClass('timeline-wrapper-mobile-era1').removeClass('timeline-wrapper-mobile-era2').removeClass('timeline-wrapper-mobile-era3').addClass('timeline-wrapper-mobile-era4');
                sendAnalyticsScreen('Explore screen - era 4');
            }
        }
        $('#explore').removeClass('animated fadeIn hidden');
        $('#selection').addClass('fadeOut hidden');
        $('#detail').addClass('fadeOut hidden');
       
    
    }


    /**
    * Displays the modal with the appropriate data.  Hides any tooltips that are currently showing.
    * @param two parameters, the era, from data-era, and the moment, data-timeline.  both are integeters 
    * @return {string|int|array} returns nothing
    **/
    var displayModal = function(era, moment) {
        $("#correct-answer").html($.templates("#modal-template").render(data.eras[era-1].Moments[moment-1])).modal('show');
        $('[data-toggle=tooltip]').tooltip('hide');
        sendAnalyticsEvent('Timeline Entry', 'open');
    }

    /**
    * Re-opens the modal after the draggable has already been dropped
    * @param no parameters
    * @return {string|int|array} returns nothing
    **/
    var reopenModal = function() {
        var moment = $(this).attr('data-timeline');
        var era = $('#droppable-container').attr('data-era');
        displayModal(era, moment);
    } 

    /**
    * Hides the modal
    * @param no parameters
    * @return {string|int|array} returns nothing
    **/
    var hideModal = function() {
        $('#correct-answer').modal('hide');
        sendAnalyticsEvent('Timeline Entry', 'open');

    }


    /**
    * Shows the modal, called if data has already been rendered into the modal and modal just needs to be shown
    * @param no parameters
    * @return {string|int|array} returns nothing
    **/
    var showModal = function() {
        $('#correct-answer').modal('show');
    }

    
    /**
    * Gets the value of the data-attribute data-timeline and hides the appoprirate text, which is displayed next to the draggable element (thumbnail img) - this happens while the draggable element is actively dragging
    * @param the value of the data-timeline attribute, which is an integer
    * @return {string|int|array} returns nothing
    **/
    var hideText = function(id) {
       var id = $(this).attr('data-timeline');
       $('.draggable-widget').tooltip('hide');
       $('.draggable-text[data-timeline="' + id + '"]').addClass('active');
       $('.draggable-widget[data-timeline="' + id + '"]').addClass('active');

    }

    /**
    * Gets the value of the data-attribute data-tmeline and shows the apprpriate text, this may happen when the draggable element is no longer actively dragging and has reverted to its original location without being dropped
    * @param the value of the data-timeline attribute, which is an integer
    * @return {string|int|array} returns nothing
    **/
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

    
   
    /**
    * Builds the appropriate game by getting the width of the window and if it is large enough, displays a drag-and-drop game, if the width of the window is less than or equal to 768 the game is a sortable.  Designates actions to take palce if elements are placed in the appropriate spot or not and shows and hides tooltips as appropriate.
    * @param the value of the data-timeline attribute, which is an integer
    * @return {string|int|array} returns nothing
    **/
    var buildGame = function(id) {
        var windowWidth = $(window).width();

        $('#lightgallery').lightGallery({
            subHtmlSelectorRelative: true
        });
        $('[data-toggle=tooltip]').tooltip('hide');

        if (windowWidth >= 768) {
        $('.draggable-img-wrapper').draggable({
            appendTo: 'body',
            tolerance: 'touch',
            snap: '.droppable-widget',
            revert: 'invalid',
            snapMode: 'interior',
            snapTolerance: 10
        });
        } else {

            $('#draggable-wrapper').sortable({
                axis: 'y',
                cancel: '.sortableEl-disabled',
                stop: function( event, ui ) {
                    $('.draggable-holder').each(function(index, element){
                        var timeline = $(this).attr('data-timeline');
                        if (timeline == index+1) {
                            $(this).addClass('sortableEl-disabled dropped');
                        } else {
                            if ($(this).hasClass('sortableEl-disabled dropped')) {
                                $(this).removeClass('sortableEl-disabled dropped');
                            }
                        }
                        
                    });
                    countDroppedEls();
                }
            });
            
           
        }

        $('.droppable-widget').droppable({

            drop: function( event, ui ) {
                

                var droppableNumber = $(this).data('timeline');
                var originalLeft = $(this).css('left');
                var originalTop = $(this).css('top');
              
              
                    if(ui.draggable.is('[data-timeline="' + droppableNumber + '"]')) {
                        sendAnalyticsEvent('Builder', 'correct');
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
                        sendAnalyticsEvent('Builder', 'incorrect');
                        ui.draggable.draggable('option', 'revert', true);
                        var draggableNumber = ui.draggable.attr('data-timeline');
                        var draggableShell = $('.draggable-widget[data-timeline="' + draggableNumber + '"]');
                        setTimeout(function() {   draggableShell.tooltip('show'); }, 1000);
                        setTimeout(function() {   draggableShell.tooltip('hide'); }, 5000);
                       
                    }
            
            }

        });

    }

    var hideAccessibleDragDrop = function() {
        $('.accessible-droppables-container').addClass('hidden fadeOut').removeClass('fadeIn');
    }

    var accessibleDragDrop = function(e) {
        var id = $('#droppable-container').attr('data-era');
        var moment = $(this).attr('data-timeline');
        if (e.keyCode == 13 && $('.accessible-droppables-container[data-timeline="' + moment + '"]').hasClass('hidden')) {
            $('.accessible-droppables-container[data-timeline="' + moment + '"]').removeClass('hidden fadeOut').addClass('animated fadeIn');
            $(".accessible-droppables-container[data-timeline='" + moment + "']").html($.templates("#accessible-droppables-template").render(data.eras[id-1]));
        } else if (e.keyCode == 13 && $('.accessible-droppables-container').hasClass('fadeIn')) {
            hideAccessibleDragDrop();
        } else {                
        }
    }

    var checkForMatch = function(e) {
        var era = $('#droppable-container').attr('data-era');
        var id = $(this).attr('data-timeline');
        var moment = $(this).parent().attr('data-timeline');        
        if (e.keyCode == 13) {
            if (id == moment) {
                $(this).css('background-color', '#a8bd46'); 
                $('.draggable-img-wrapper[data-timeline="' + id + '"]').addClass('dragged');
                $('.droppable-widget[data-timeline="' + id + '"]').addClass('dropped dropped-accessible').attr('tabindex', 0);
                $('.draggable-holder[data-timeline="' + id + '"]').css('visibility', 'hidden');
                displayModal(era, moment);
                setTimeout(function() { hideAccessibleDragDrop(); }, 750);
                countDroppedEls();
            } else {
                $(this).css('background-color', 'rgba(225, 0, 0, 0.7)');
                var draggableShell = $('.draggable-widget[data-timeline="' + moment + '"]');
                setTimeout(function() {   draggableShell.tooltip('show'); }, 1000);
                setTimeout(function() {   draggableShell.tooltip('hide'); }, 5000);

            }
        }
    }

    var accessibleModal = function(e) {
        var moment = $(this).attr('data-timeline');
        var era = $('#droppable-container').attr('data-era');
        if (e.keyCode == 13) {
            displayModal(era, moment);
        }
    }

    


    var bindEvents = function() {
        $(document).on('click tap', '.start-timeline-btn[data-timeline]', displayDetailScreen);
        $(document).on('click tap', '.view-timeline-btn[data-timeline]', displayExploreScreen);
        $(document).on('hidden.bs.modal', countDroppedEls);
        $(document).on('dragstart', '.draggable-img-wrapper[data-timeline]', hideText);
        $(document).on('dragstop', '.draggable-img-wrapper[data-timeline]', showText);
        $(document).on('click tap', '.dragged[data-timeline]', reopenModal);
        $(document).on('keyup', '.draggable-img[data-timeline]', accessibleDragDrop);
        $(document).on('keyup', '.accessible-droppable[data-timeline]', checkForMatch);
        $(document).on('keyup', '.dropped-accessible[data-timeline]', accessibleModal);
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




