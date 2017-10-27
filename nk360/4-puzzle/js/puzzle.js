Puzzle = (function() {

    var droppableTimeout;
    var popoverTimeout; 
   


    var init = function() {
    	bindEvents();
    }


    /**
    * Determines whether or not the complete overlay should be displayed based on whether the number of 'dropped' cards equals * the number of cards.
    * @param takes no arguments
    * @return {string|int|array} does not return anything.  Addds/removes classes if number of 'dropped' cards equals number of cards
    **/
    var showComplete = function() {
        var numberDropped = $('.answered').length;
        var numberCards = $('.card').length
        if (numberDropped == numberCards) {
            $('#droppable-wrapper').addClass('hidden animated fadeOut');
            $('#complete-overlay').removeClass('hidden').addClass('animated fadeIn');
            $('#puzzle-download').removeClass('hidden');
            $('.puzzle-img-zoom-icon').removeClass('hidden');
            sendAnalyticsEvent('Puzzle', 'complete');
        }
    }

    /**
    * Determines whether an array contains a value. Found on SO: https://stackoverflow.com/questions/1181575/determine-whether-an-array-contains-a-value
    * @param {int} this is the value we want to check against the array (the haystack)
    * @return {boolean} I think returns true/false based on whether the value is in the array
    **/
    var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;

    };

    
    
    /**
    * Initializes both the draggable and droppable elements, and determines what to do if a draggable element is dropped in the right or wrong droppable element
    * @param {} doesn't take any arguments
    * @return {} doesn't return anything but manipulates the DOM based on whether or not a draggable element matches a droppable element
    **/
    var buildGame = function() {

        // $('.lg-wrapper-card').lightGallery({
        //     controls: true
        // });



         $('.draggable-widget').draggable({
            snap: '.droppable-widget',
            revert: 'invalid',
            snapMode: 'interior',
            snapTolerance: 10,
            greedy: false,
            start: function(event, ui) { 
                $(this).draggable("option", "cursorAt", {
                    left: Math.floor(this.clientWidth / 2),
                    top: Math.floor(this.clientHeight / 2)
                }); 
            }
        });

         $('.droppable-widget').droppable({
            tolerance: 'touch',
            drop: function( event, ui ) {
                

                var droppableNumber = $(this).data('theme');
                var originalLeft = $(this).css('left');
                var originalTop = $(this).css('top');
                var draggableEl = ui.draggable.find('.modal-content');
                var draggableElThemes = draggableEl.attr('data-theme');
                var draggableElArray =  draggableElThemes.split(',').map(Number);
                

              
              
                    if(contains.call(draggableElArray, droppableNumber)) {
                        ui.draggable.addClass('dragged');
                        ui.draggable.draggable('option', 'revert', 'invalid');
                        var cardNumber = ui.draggable.data('card');
                        $('.card[data-card="' + cardNumber + '"]').addClass('hidden animated fadeOut answered');

                        ui.draggable.addClass('dragged animated');
                        $(this).addClass('dropped');
                        $('#card-modal').modal('hide').removeClass('fadeIn').addClass('animated');
                        hideDroppablesTimeout();
                        

                        ui.draggable.position({
                            my: "center",
                            at: "center",
                            of: $(this),
                            using: function(pos) {
                                $(this).animate(pos, 200, "linear");
                            }
                        });

                        ui.draggable.css('left', '0').css('top', '0');
                        showComplete();
                        sendAnalyticsEvent('Puzzle', 'correct');
                       


                    } else {
                        sendAnalyticsEvent('Puzzle', 'incorrect');
                        setPopover();
                        ui.draggable.draggable('option', 'revert', true);
                        $(this).css('border', '3px solid white');
                        $(this).popover('show');
                        $('.droppable-widget').tooltip('hide');
                        hidePopoverTimeout();
                       
                       
                    }
            
            }

        });
    }


    /**
    * sets up a timeout that hides the droppable elements after 1 second
    * @param {} doesn't take any arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/
    var hideDroppablesTimeout = function() {
        droppableTimeout = setTimeout(function() { hideDroppables(); }, 1000);
    }

    /**
    * sets up a timeout that manually hides a popover after 3 second
    * @param {} doesn't take any arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/
    var hidePopoverTimeout = function() {
        popoverTimeout = setTimeout(function() { hidePopover(); }, 3000);
    }

  

    /**
    * Determines whether or not to display the modal based on checking to see if the number of cards 'answered' is the same as same as the nubmer of cards; if the modal is shown, it updates the modal and shows/hides other element in the DOM
    * @param {} doesn't take any arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/  
    var showModal = function() {
        sendAnalyticsEvent('Puzzle', 'open');
        var numberDropped = $('.answered').length;
        var numberCards = $('.card').length

        if (numberDropped < numberCards) {
            showTooltip();
            showModalCard();
            clearTimeout(droppableTimeout);
            clearTimeout(hidePopoverTimeout);
            hidePopover();
            hideTooltip();
            resetDroppables();
            $('#droppable-wrapper').removeClass('hidden fadeOut').addClass('animated fadeIn');

            var id = $(this).attr('data-card');
            
            $('.modal-dialog').html();
            $(".modal-dialog").html($.templates("#modal-template").render(data.puzzles[0].Cards[id-1]));
            $('#mobile-btn-wrapper').html($.templates('#mobile-btn-template').render(data.puzzles[0]));
            $(".droppable-widget").attr('data-content', data.puzzles[0].Cards[id-1].incorrect);
            
            if ($('.modal-dialog').hasClass('dragged')) {
                $('.modal-dialog').removeClass('dragged animated fadeOutDown');
                $('.modal-dialog').css('left', '0').css('top', '0');
            
            }
        
            //var id = $(this).attr('data-card');
        
            updateModal(id);
            $('#card-modal').modal('show');
        }

    }


    /**
    * updates the mo
    * @param {int} the value of a data attribute ('data-card') 
    * @return {} doesn't return anything but manipulates the DOM 
    **/
    var updateModal = function(id) {
        $('.draggable-widget').data('card', id);
        resetDroppables();
    }

    /**
    * Hides the 'complete puzzle overlay' and shows the 'read more' button 
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/
    var exploreImg = function() {
        $('#complete-overlay').addClass('hidden animated fadeOutUp');
        $('.read-more').removeClass('hidden');

    }


    /**
    * Displays the learning points modal
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/
    var showLearningPts = function() {
        $('#learning-points').removeClass('hidden');
        if ($('#learning-points').hasClass('animated fadeOut')) {
            $('#learning-points').removeClass('animated fadeOut');
        }
        if ($('.learning-points-card').hasClass('hidden')) {
            $('.learning-points-card').removeClass('hidden').addClass('animated slideInDown');
            sendAnalyticsEvent('Learning points', 'open');
        }
    }

    /**
    * Hides the learning points modal
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/    
    var hideLearningPts = function() {
        $('#learning-points').addClass('hidden animated fadeOut');
        sendAnalyticsEvent('Learning points', 'close');
    }


    /**
    * Hides the droppable elements and clears popovers and tooltips
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var hideDroppables = function() {
        $('#droppable-wrapper').removeClass('fadeIn').addClass('animated fadeOut');
        $('.droppable-widget').tooltip('hide');
        clearTimeout(hidePopoverTimeout);
        hidePopover();
    }

    
    /**
    * Hides the the card modal
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var hideModalCard = function() {
        $('.modal-dialog').addClass('hidden');
        sendAnalyticsEvent('Puzzle', 'close');
    } 


    /**
    * Shows the the card modal
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var showModalCard = function() {
        $('.modal-dialog').removeClass('hidden');
    }

    /**
    * Adds animation to droppable elements
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var animateDroppables = function() {
       $('.droppable-widget').addClass('animated pulse infinite');
        
    }

    /**
    * Removes animation from droppable elements
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var disableAnimateDroppables = function() {
        $('.droppable-widget').removeClass('animated pulse infinite');
    }
    
    /**
    * Removes 'dropped' class from droppable elements, effectively readying them for the next card
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var resetDroppables = function() {
        if ($('.droppable-widget').hasClass('dropped')) {
            $('.droppable-widget').removeClass('dropped');
        }
    }

    /**
    * Manually initializes tooltip
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var showTooltip = function() {
        $('.droppable-widget').tooltip({
            trigger: 'hover focus'
        });
        
    }

    /**
    * Hides tooltip
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var hideTooltip = function() {
         $('.droppable-widget').tooltip('hide');
    }

    /**
    * Initializes popover by changing data-toggle to popover (default is tooltip), emptying the tooltip title so that it doesn't display as a popover title (which is the default behavior) and sets options.
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var setPopover = function() {
        $('.droppable-widget').attr('data-toggle', 'popover');
        $('.popover-title').html('');
        $('.droppable-widget').popover({
            placement: 'top',
            trigger: 'manual'
        })
    }

    /**
    * Shows popover
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var showPopover = function() {
        $('.droppable-widget').popover('show');
    }

    /**
    * Hides popover
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var hidePopover = function() {
        $('.droppable-widget').popover('hide');
    }


    /**
    * Sets up game for display on mobile, replacing drag and drop game with multiple choice buttons 
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var mobileGame = function() {
        var droppableNumber = $(this).data('theme');
        var draggableEl = $('.draggable-widget').find('.modal-content');
        var mobileDraggable = $(this).find('.draggable-widget');
        var draggableElThemes = draggableEl.attr('data-theme');
        var draggableElArray =  draggableElThemes.split(',').map(Number);

        if(contains.call(draggableElArray, droppableNumber)) {
            mobileDraggable.addClass('dragged');
            var cardNumber = draggableEl.data('card');
            $('.card[data-card="' + cardNumber + '"]').addClass('hidden animated fadeOut answered');

            mobileDraggable.addClass('dragged animated');
            $(this).addClass('dropped');
            setTimeout(function() {$('#card-modal').modal('hide').removeClass('fadeIn').addClass('animated');}, 1000);
            showComplete();
        } else {
            setPopover();
            $(this).css('border', '3px solid white');
            $(this).popover('show');
            $('.droppable-widget').tooltip('hide');
            hidePopoverTimeout();
        }


        
    }

    /**
    * Enables or disables draggable elements based on window width
    * @param {int} takes no arguments
    * @return {} doesn't return anything but manipulates the DOM 
    **/ 
    var checkWindowWidth = function() {
        var windowWidth = $( window ).width();
        if (windowWidth >= 768) {
            $('.draggable-widget').draggable('enable');
        } else {
            $('.draggable-widget').draggable('disable');
        }
    }

   


    var bindEvents = function() {
        $(document).ready(checkWindowWidth);
        $(document).on('click tap', '.card[data-card]', showModal);
        $(document).on('click tap', '#explore-img-btn', exploreImg);
    	$(document).on('click tap', '#read-more-btn', showLearningPts);
        $(document).on('click tap', '#learning-points', hideLearningPts);
        $(document).on('hidden.bs.modal', hideDroppables);
        $(document).on('onAfterOpen.lg', hideDroppables);
        $(document).on('onCloseAfter.lg', showModal);
        $('.draggable-widget').on('drag', hideTooltip);
        $('.draggable-widget').on('drag', animateDroppables);
        $('.draggable-widget').on('dragstop', disableAnimateDroppables);
        $(document).on('click tap', '.droppable-widget[data-theme]', mobileGame);
    }

    
    return {
        init: init,
        buildGame: buildGame,
        showComplete: showComplete
    }
})();
