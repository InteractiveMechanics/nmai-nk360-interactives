Puzzle = (function() {
    var init = function() {
    	bindEvents();
    }

    var showComplete = function() {
        var numberDropped = $('.answered').length;
        console.log(numberDropped);
        if (numberDropped == 8) {
            $('.droppable-wrapper').addClass('hidden animated fadeOut');
            $('#complete-overlay').removeClass('hidden').addClass('animated fadeIn');
        }
    }
    

    var buildGame = function() {
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

              
              
                    if(ui.draggable.is('[data-theme="' + droppableNumber + '"]')) {
                        ui.draggable.addClass('dragged');
                        ui.draggable.draggable('option', 'revert', 'invalid');
                        var cardNumber = ui.draggable.data('card');
                        $('.card[data-card="' + cardNumber + '"]').addClass('hidden animated fadeOut answered');

                        //alert('the thing is dropped!');
                        //alert('card number ' + cardNumber);

                        ui.draggable.addClass('dragged animated fadeOutDown');
                        $(this).addClass('dropped');
                        $('#card-modal').modal('hide').removeClass('fadeIn').addClass('animated fadeOut');
                        

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
                        ui.draggable.draggable('option', 'revert', 'valid');
                        setTimeout(function() {   ui.draggable.tooltip('show'); }, 1000);

                        setTimeout(function() {   ui.draggable.tooltip('hide'); }, 3000);
                       
                       
                    }
            
            }

        });
    }

   

    var showModal = function() {
        $('.modal-dialog').html();
        $(".modal-dialog").html($.templates("#modal-template").render());
        if ($('.modal-dialog').hasClass('dragged')) {
            $('.modal-dialog').removeClass('dragged animated fadeOutDown');
            $('.modal-dialog').css('left', '0').css('top', '0');
        }
        var id = $(this).attr('data-card');
        updateModal(id);
        $('#card-modal').modal('show').removeClass('fadeOut').addClass('animated fadeIn');
    }


    var updateModal = function(id) {
        $('.draggable-widget').data('card', id);
    }

    var exploreImg = function() {
        $('#complete-overlay').addClass('hidden animated fadeOutUp');
        $('.read-more').removeClass('hidden');
        $('.lg-link').removeClass('disabled-link');
        $('.puzzle-img-wrapper').lightGallery({
            controls:true
        });
    }


    var showLearningPts = function() {
        alert('showLearningPts is working');
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
    
    var bindEvents = function() {
        $(document).on('click tap', '.card[data-card]', showModal);
        $(document).on('click tap', '#explore-img-btn', exploreImg);
    	$(document).on('click tap', '#read-more-btn', showLearningPts);
        $(document).on('click tap', '#learning-points', hideLearningPts);
    }
    
    return {
        init: init,
        buildGame: buildGame
    }
})();
