Game = (function() {

    var settings = {
      speed: 2,
      position: 0,
      fishSelection: null,
      pause: true,
      started: false
    };

    var randomEncounters = [];
    var oceanEncounters = [];
    var wildernessEncounters = [];
    var cityEncounters = [];

    var init = function(data) {
        gameData = data;
        
        bindEvents();
        setData();
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
        $('body').on('click tap', '#close-congrats-screen', closeCongratsScreen);
        $('body').on('click tap', '#restart', restartSalmonChallenges);
        $('body').on('click tap', '#pause-icon', hitPause);

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();

        initGame();
    }

    var hitPause = function() {
      var isPlaying = $('#pause-icon').hasClass('icon-play');

      if(isPlaying) {
        settings.pause = true;
        $('#pause-icon').removeClass('icon-play').addClass('icon-pause');
      } else {
        settings.pause = true;
        $('#pause-icon').removeClass('icon-pause').addClass('icon-play');
      }
    }

    var restartSalmonChallenges = function() {
      window.location.reload();
    }

    var setData = function() {
      setIntroCard();
      setObstacles();
      setRandomEncounters();
    }

    var setIntroCard = function() {
      var sliderTemplate = $.templates("#introSliderTemplate");
      var sliderTemplateHTMLOutput = sliderTemplate.render(gameData.intro_cards);
      $(".intro-slider").html(sliderTemplateHTMLOutput);
    }

    var setObstacles = function() {
    }

    var setRandomEncounters = function() {
      var encounters = gameData.random;

      for (var i = 0; i < encounters.length; i++) {
        switch (encounters[i].location) {

          case 'city':
            encounters[i].hotspot_index = cityEncounters.length;
            cityEncounters.push(encounters[i]);
            break;

          case 'ocean':
            encounters[i].hotspot_index = oceanEncounters.length;
            oceanEncounters.push(encounters[i]);
            break;

          case 'wilderness':
            encounters[i].hotspot_index = wildernessEncounters.length;
            wildernessEncounters.push(encounters[i]);
            break;

          default:
            encounters[i].hotspot_index = randomEncounters.length;
            randomEncounters.push(encounters[i]);
        }
      };


      var x = getRandomValue(400, 12000);
      var y = getRandomValue(150, window.innerHeight - 200);
      
      cityEncounters[0].left = 1000;//x;
      cityEncounters[0].bottom = y;
      
      var encounter = cityEncounters[0];
      var hotspotHTML = createHotspotHTML(encounter);

      console.log(hotspotHTML);
      $('.encounters').html(hotspotHTML);
    }

    var createHotspotHTML = function(encounter) {
      var hotspotTemplate = $.templates("#hotspotTemplate");
      var hotSpotHTMLOutput = hotspotTemplate.render(encounter);
      //$(".intro-slider").html(sliderTemplateHTMLOutput);

      return hotSpotHTMLOutput;
    }

    var createCityEncounters = function() {

    }

    var getRandomValue = function(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    var closeCongratsScreen = function() {

    }


    var updateWorld = function() {
        if(settings.pause) {
          if (-settings.position < 15840) {
              settings.position -= settings.speed;
              $('.game-world').css('left', settings.position + 'px');
              requestAnimationFrame(updateWorld);
          } else {
            console.log('game-complete');
          }
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
      $('#SelectedSalmon').removeClass().addClass(settings.fishSelection + "-0");

    }

    var hotspotClicked = function() {

      var isSliderShowing = $('.slider-wrapper').hasClass('show');
      if(isSliderShowing) {
        return;
      }

      var _this = $(this);
      var hotspot_index = _this.data('hotspot');
      var location = _this.data('location');

      settings.pause = false;

      if(location == 'city') {
        createEncounterSlider( cityEncounters[hotspot_index] );
      }

      if(location == 'city') {

      }

      if(location == 'city') {

      }

      $('.slider-wrapper').removeClass('hidden').addClass('show');
    }

    var createEncounterSlider = function(encounter) {
      var sliderHTML = "";
      var cards = encounter.cards;
      for (var i = 0; i < cards.length; i++) {
        
        if(cards[i].type == 'quiz') {
          sliderHTML += getQuizCardHTML(cards[i]);
        }

        if(cards[i].type == 'information') {
          sliderHTML += getInformationCardHTML(cards[i]);
        }

      };

      $('.slider').html(sliderHTML);
      console.log(sliderHTML);

      //Slick slider call if multiple slides
      if(cards.length > 1) {

        $(".slider").slick({
          dots: true,
          infinite: false,
          slidesToShow: 1,
          variableWidth: true
        });

        $('.slider').on('afterChange', function(e, slick, currentSlide){
            if(slick.slideCount == currentSlide + 1) {
              $('.close-icon').removeClass('faded');
            }
        });

      }
    }

    var getInformationCardHTML = function(card) {
      var template = $.templates("#informationSlideTemplate");
      var output = template.render(card);

      return output;
    }

    var getQuizCardHTML = function(card) {
      var template = $.templates("#hotspotTemplate");
      var output = template.render(card);

      return output;
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
            variableWidth: true
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
      //var isVisible = $(".slider-wrapper").is(":visible");
      var isFaded = $(this).hasClass('faded');
      if(!isFaded) {
        $('.slider-wrapper').removeClass('show').addClass('hidden');
        settings.pause = true;
        requestAnimationFrame(updateWorld);

        $('.salmon').removeClass('steelhead-0').addClass('steelhead-1')
      }

      $('.slider-wrapper').removeClass('show').addClass('hidden');
        settings.pause = true;
        requestAnimationFrame(updateWorld);

        $('.salmon').removeClass('steelhead-0').addClass('steelhead-1')
    }

    
    return {
        init: init
    }
})();
