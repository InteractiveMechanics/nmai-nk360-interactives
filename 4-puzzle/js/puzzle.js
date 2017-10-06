Puzzle = (function() {
    var init = function() {
    	bindEvents();
    }

    var showComplete = function() {
        var numberDropped = $('.answered').length;
        var numberCards = $('.card').length
        console.log(numberDropped);
        if (numberDropped == numberCards) {
            $('#droppable-wrapper').addClass('hidden animated fadeOut');
            $('#complete-overlay').removeClass('hidden').addClass('animated fadeIn');
            $('#puzzle-download').removeClass('hidden');
            $('.puzzle-img-zoom-icon').removeClass('hidden');
        }
    }

   
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

    
    

    var buildGame = function() {

        $('.lg-wrapper-card').lightGallery({
            controls: true
        });

         $('.draggable-widget').draggable({
            snap: '.droppable-widget',
            revert: 'invalid',
            snapMode: 'interior',
            snapTolerance: 10,
            //cursorAt: {top: 10, left: 10}
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
                console.log(Array.isArray(draggableElArray));
                /*works for one value
                poop.is('[data-theme="' + droppableNumber + '"]')
                */

              
              
                    if(contains.call(draggableElArray, droppableNumber)) {
                        ui.draggable.addClass('dragged');
                        ui.draggable.draggable('option', 'revert', 'invalid');
                        var cardNumber = ui.draggable.data('card');
                        $('.card[data-card="' + cardNumber + '"]').addClass('hidden animated fadeOut answered');

                        //alert('the thing is dropped!');
                        //alert('card number ' + cardNumber);

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

                        //ui.draggable.draggable('option', 'disabled', true);
                        ui.draggable.css('left', '0').css('top', '0');
                        showComplete();
                       


                    } else {
                        setPopover();
                        ui.draggable.draggable('option', 'revert', 'valid');
                        $(this).css('border', '3px solid white');
                        $(this).popover('show');
                        $('.droppable-widget').tooltip('hide');
                        hidePopoverTimeout();
                       
                       
                    }
            
            }

        });
    }


    var droppableTimeout;
    var popoverTimeout; 
   

    var hideDroppablesTimeout = function() {
        droppableTimeout = setTimeout(function() { hideDroppables(); }, 1000);
    }

    var hidePopoverTimeout = function() {
        popoverTimeout = setTimeout(function() { hidePopover(); }, 3000);
    }

  
    var showModal = function() {
        var numberDropped = $('.answered').length;
        var numberCards = $('.card').length
        console.log(numberDropped);
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
        $(".droppable-widget").attr('data-content', data.puzzles[0].Cards[id-1].incorrect);
        if ($('.modal-dialog').hasClass('dragged')) {
            $('.modal-dialog').removeClass('dragged animated fadeOutDown');
            $('.modal-dialog').css('left', '0').css('top', '0');
        }
        //var id = $(this).attr('data-card');
        updateModal(id);
        $('#card-modal').modal('show').removeClass('fadeOut').addClass('animated fadeIn');
        }
    }


    var updateModal = function(id) {
        $('.draggable-widget').data('card', id);
        resetDroppables();
    }

    var exploreImg = function() {
        $('#complete-overlay').addClass('hidden animated fadeOutUp');
        $('.read-more').removeClass('hidden');
        $('.lg-link').removeClass('disabled-link');
        $('.lg-wrapper-puzzle').lightGallery({
            controls:true
        });
    }


    var showLearningPts = function() {
        $('#learning-points').removeClass('hidden');
        if ($('#learning-points').hasClass('animated fadeOut')) {
            $('#learning-points').removeClass('animated fadeOut');
        }
        if ($('.learning-points-card').hasClass('hidden')) {
            $('.learning-points-card').removeClass('hidden').addClass('animated slideInDown');
        }
    }

    var hideLearningPts = function() {
        $('#learning-points').addClass('hidden animated fadeOut');
    }

    var hideDroppables = function() {
        console.log('hide droppables is running');
        $('#droppable-wrapper').removeClass('fadeIn').addClass('animated fadeOut');
        $('.droppable-widget').tooltip('hide');
        clearTimeout(hidePopoverTimeout);
        hidePopover();
    }

    
    var hideModalCard = function() {
        $('.modal-dialog').addClass('hidden animated fadeOut').removeClass('fadeIn');
    } 

    var showModalCard = function() {
        $('.modal-dialog').removeClass('hidden fadeOut').addClass('fadeIn');
    }

    var animateDroppables = function() {
        console.log('animateDroppables is running');
        $('.droppable-widget').addClass('animated pulse infinite');
    }
    
    var resetDroppables = function() {
        if ($('.droppable-widget').hasClass('dropped')) {
            $('.droppable-widget').removeClass('dropped');
        }
    }

    var showTooltip = function() {
        $('.droppable-widget').tooltip({
            trigger: 'hover focus'
        });
    }

    var hideTooltip = function() {
         $('.droppable-widget').tooltip('hide');
    }

    var setPopover = function() {
        $('.droppable-widget').attr('data-toggle', 'popover');
        $('.popover-title').html('');
        $('.droppable-widget').popover({
            placement: 'top',
            trigger: 'manual'
        })
    }

    var showPopover = function() {
        $('.droppable-widget').popover('show');
    }

    var hidePopover = function() {
        $('.droppable-widget').popover('hide');
    }

   


    var bindEvents = function() {
        $(document).on('click tap', '.card[data-card]', showModal);
        $(document).on('click tap', '#explore-img-btn', exploreImg);
    	$(document).on('click tap', '#read-more-btn', showLearningPts);
        $(document).on('click tap', '#learning-points', hideLearningPts);
        $(document).on('hidden.bs.modal', hideDroppables);
        $(document).on('shown.bs.modal', animateDroppables);
        $(document).on('onAfterOpen.lg', hideDroppables);
        $(document).on('onCloseAfter.lg', showModal);
    }

    
    return {
        init: init,
        buildGame: buildGame
    }
})();
