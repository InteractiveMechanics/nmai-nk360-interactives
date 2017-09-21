Game = (function() {

    var settings = {
      speed: 6,
      position: 0,
      fishSelection: null,
      pause: true,
      started: false
    };

    var init = function() {
        bindEvents();
    }
    var bindEvents = function() {
        $('body').on('click tap', '#show-instructions', showIntro);
        $('body').on('click tap', '#instructions', showIntroModal);
        $('body').on('click tap', '.get-started', showSalmonSelection);
        $('body').on('click tap', '#close-select-fish', hideSelectSalmon);
        $('body').on('click tap', '.fish-row .col', selectSalmon);
        $('body').on('click tap', '.hotspot', hotspotClicked);
        $('body').on('click tap', '.quiz-options button', quizHandler);
        $('body').on('click tap', '.close-icon', closePopup);

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();

        initGame();
    }


    var updateWorld = function() {
        console.log(settings.pause);
        if(settings.pause) {
          if (-settings.position < $('.game-world').outerWidth() - window.innerWidth) {
              settings.position -= settings.speed;
              $('.game-world').css('left', settings.position + 'px');
          }
          requestAnimationFrame(updateWorld);
        }
    };

    var startGame = function() {
        setTimeout(function () {
            requestAnimationFrame(updateWorld);
        }, 1000/60);
    };

    var initGame = function() {
      $('.start button').on('click', startGame);
    };


    var hideSelectSalmon = function() {
      var isFaded = $('#close-select-fish').hasClass('faded');

      if(!isFaded) {
        $('#select-fish').removeClass('show').addClass('hidden');
        startGame();
      }
    }

    var selectSalmon = function() {
      var _this = $(this);
      var fish = _this.data('fish');
      settings.fishSelection = fish.toLowerCase();

      $('.fish-row .col').addClass('faded');
      _this.removeClass('faded');

      $('#close-select-fish').removeClass('faded');
    }

    var hotspotClicked = function() {
      var _this = $(this);
      var hotspotID = _this.data('hotspot');
      settings.pause = false;

      $('.slider-wrapper').removeClass('hidden').addClass('show');
    }

    var showPopup = function (htmlData){

    }

    var showIntro = function () {
      if(settings.started) {
        settings.pause = false;
      }
    }

    var showIntroModal = function() {
      if(!settings.started) {
        setTimeout(function() {
          settings.started = true;
          $('.intro-slider-wrapper').removeClass('hidden').addClass('show');

          $(".intro-slider").slick({
            dots: true,
            infinite: false,
            slidesToShow: 1,
            variableWidth: true,
            afterChange: function(slick, currentSlide) {
              console.log(currentSlide);
              console.log(slick.count);
            }
          });

          $('.intro-slider').on('afterChange', function(e, slick, currentSlide){
              if(slick.slideCount == currentSlide + 1) {
                
                setTimeout(function(){
                  showSalmonSelection();
                }, 200);

              }
          });


        }, 100);
      }

      if(settings.started) {
        settings.pause = true;
        requestAnimationFrame(updateWorld);
      }
    }

    var showSalmonSelection = function() {
      $('.intro-slider-wrapper').addClass('hidden');
      setTimeout(function(){
        $('#select-fish').removeClass('hidden').addClass('show');
      }, 100);
    }

    var quizHandler = function () {
      var isAlreadyAnswered = $('.quiz-options').data('answered');

      if(!isAlreadyAnswered) {
        var isRightAnswer = $(this).hasClass('right-answer');

        if(isRightAnswer) {
          $(this).addClass('correct');
        } else {
          $(this).addClass('wrong');
          $('.right-answer').addClass('correct');
        }

        $('.quiz-options').data('answered', true);
        $('.quiz-options').addClass('quiz-answered');


        setTimeout(function(){
          $('.quiz-solution').removeClass('hidden').addClass('show');
           $('.quiz-detail').removeClass('hidden').addClass('show');
        }, 200);
        setTimeout(function(){
          $('.slider-wrapper').removeClass('show').addClass('hidden');
          settings.pause = true;
          requestAnimationFrame(updateWorld);
        }, 1500);
      }
    }

    var closePopup = function () {
      var isVisible = $(".slider-wrapper").is(":visible");
      if(isVisible) {
        $('.slider-wrapper').removeClass('show').addClass('hidden');
      }
    }

    
    return {
        init: init
    }
})();
