Puzzle = (function() {
    var init = function() {
    	bindEvents();
    }

    

    var buildGame = function() {
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
                

                var droppableNumber = $(this).data('theme');
                var originalLeft = $(this).css('left');
                var originalTop = $(this).css('top');

              
              
                    if(ui.draggable.is('[data-theme="' + droppableNumber + '"]')) {
                        ui.draggable.addClass('dragged');
                        ui.draggable.draggable('option', 'revert', 'invalid');
                        var cardNumber = ui.draggable.data('card');
                        $('.card[data-card="' + cardNumber + '"]').addClass('hidden animated fadeOut answered');

                        alert('the thing is dropped!');
                        alert('card number ' + cardNumber);

                        ui.draggable.addClass('dragged animated fadeOutDown');
                        $(this).addClass('dropped');
                        

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
        $('#card-modal').modal('show');
    }


    var updateModal = function(id) {
        $('.draggable-widget').data('card', id);
    }

    
    var bindEvents = function() {
        $(document).on('click tap', '.card[data-card]', showModal);
    	
    }
    
    return {
        init: init,
        buildGame: buildGame
    }
})();
