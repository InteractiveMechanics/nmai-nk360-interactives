Game = (function() {
    //positions: [0, 4320, 8640, -1],
    var settings = {
      speed: 2,
      position: 0,
      fishSelection: null,
      pause: true,
      started: false,
      $world: $('.game-world'),
      positions: [0, 5320, 9640, -1],
      leg: 0,
      $progress: $('.progressb'),
      scaling: 0,
      sectionLength: 0,
      sectionOffset: 0,
      position: 0,
      salmonCount: 3,
      backgroundSpeed: .5,
      midgroundSpeed: 1,
      foregroundSpeed: 1.5,
      $background: $('.game-world .game-world__background'),
      $midground: $('.game-world .game-world__midground'),
      $foreground: $('.game-world .game-world__foreground'),
      backgroundPosition: 0,
      midgroundPosition: 0,
      foregroundPosition: 0,
      cityStart: 4400,
      cityEnd: 8600,
      oceanStart: 400,
      oceanEnd: 4200,
      wildernessStart: 8800,
      wildernessEnd: 11150,
      encounterSeen: 0
    };

    var lastCard = null;

    var randomEncounters = [];
    var oceanEncounters = [];
    var wildernessEncounters = [];
    var cityEncounters = [];

    var init = function(data) {
        gameData = data;
        
        bindEvents();
        setData();

        settings.scaling = $('.progress-wrapper').width() / (settings.$world.width() - window.innerWidth);
        settings.sectionLength = $('.progress-wrapper').width() / (settings.positions.length - 1);
        settings.sectionOffset = (window.innerWidth) * settings.scaling;
        settings.positions.forEach(function(pos, index) {
            if (0 === pos) {
                pos = (window.innerWidth / 2);
            }
          if (-1 === pos) {
              pos = (settings.$world.width() - (window.innerWidth / 2));
          }
          $('.position-'+String(index + 1)+'-progress').css("left", (index * settings.sectionLength) - ($('.position-'+String(index + 1)+'-progress').width() / 2));
        });
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
        //$('body').on('click tap', '#', victoryContinueButton);

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();

        initGame();
    }

    var hitPause = function() {
      var isPlaying = $('#pause-icon').hasClass('icon-play');

      if(isPlaying) {
        settings.pause = false;
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


      /*var x = getRandomValue(400, 12000);
      var y = getRandomValue(150, window.innerHeight - 200);
      
      cityEncounters[0].left = 1000;//x;
      cityEncounters[0].bottom = y;
      
      var encounter = cityEncounters[0];
      var hotspotHTML = createHotspotHTML(encounter);
      $('.encounters').html(hotspotHTML);*/

      var arr = [];
      for(var i = 0; i < 3; i++) {
        var temp = getCityEncounter();
        arr.push(temp);
      }

      for(var i = 0; i < 3; i++) {
        var temp = getOceanEncounter();
        arr.push(temp);
      }

      for(var i = 0; i < 3; i++) {
        var temp = getWildernessEncounters();
        arr.push(temp);
      }

      /*for(var i = 0; i < 3; i++) {
        var temp = getRandomEncounters();
        arr.push(temp);
      }*/

      var hotspotHTML = createHotspotHTML(arr);
      $('.encounters').html(hotspotHTML);

      console.log(hotspotHTML);
    }

    var getCityEncounter = function() {
      var x = getRandomValue(settings.cityStart, settings.cityEnd);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(cityEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    var getOceanEncounter = function() {
      var x = getRandomValue(settings.oceanStart, settings.oceanEnd);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(oceanEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    var getWildernessEncounters = function() {
      var x = getRandomValue(settings.wildernessStart, settings.wildernessEnd);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(wildernessEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    var getRandomEncounters = function() {
      var x = getRandomValue(400, 11150);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(randomEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      console.log(randomEncounters.length);

      return encounter;
    };

    var getRandomArrayItem = function(encounters){
      var encounter = encounters[Math.floor(Math.random() * encounters.length)];
      if (encounter.alreadyUsing) {
        //return getRandomArrayItem(encounters);
      }
      return encounter;
    }

    var createHotspotHTML = function(encounter) {
      var hotspotTemplate = $.templates("#hotspotTemplate");
      var hotSpotHTMLOutput = hotspotTemplate.render(encounter);

      return hotSpotHTMLOutput;
    }

    var createCityEncounters = function() {

    }

    var randomNumberArray = [];

    var getRandomValue = function(min,max) {
      var number = Math.floor(Math.random() * (max - min + 1) + min);
      var isUnique = true;

      for (var i = randomNumberArray.length - 1; i >= 0; i--) {
        if( randomNumberArray[i] == number ) {
          isUnique = false;
        }
      };

      if(isUnique) {
        randomNumberArray.push(number);
        return number;
      } else {
        return getRandomValue(min, max);
      }

      //return Math.floor(Math.random()*(max-min+1)+min);
    }

    var closeCongratsScreen = function() {
      $('#congrats-instructions').removeClass('show').addClass('hidden');

      showVictorySlider();
    }

    var checkEncounters = function(current_position) {
      var encounters = gameData.forced;
      for (var i = 0; i < encounters.length; i++) {
        if(encounters[i].trigger_location == current_position) {
          settings.pause = false;
          createForcedEncounterSlider(encounters[i]);
        }
      };
    };

    var updateWorld = function() {
        var totalPos = 0, prevPos = 0;

        if(settings.salmonCount > 0) {

          if(settings.pause) {
            var current_position = -settings.position;
            if (current_position < 12840) {

                if(checkEncounters(current_position)) {

                };

                settings.position -= settings.speed;
                $('.game-world').css('left', settings.position + 'px');
                
                /*(settings.backgroundPosition -= settings.backgroundSpeed;
                settings.midgroundPosition -= settings.midgroundSpeed;
                settings.foregroundPosition -= settings.foregroundSpeed;
                settings.$background.css("transform", "translate(" + settings.backgroundPosition + "px,0)");
                settings.$midground.css("transform", "translate(" + settings.midgroundPosition + "px,0)");
                settings.$foreground.css("transform", "translate(" + settings.foregroundPosition + "px,0)");
  */
                settings.positions.forEach(function(pos, index) {
                    if (0 === pos) {
                        pos = (window.innerWidth / 2);
                    }
                    if (-1 === pos) {
                        pos = (settings.$world.width() - (window.innerWidth / 2));
                    }
                    if (index > 0) {
                        if ((-1 * settings.position + (window.innerWidth / 2)) >= pos) {
                          totalPos += settings.sectionLength;
                          $('.position-'+String(index + 1)+'-progress').addClass("highlight");
                        } else if ((-1 * settings.position + (window.innerWidth / 2)) > prevPos) {
                            totalPos += (((-1 * settings.position + (window.innerWidth / 2)) - prevPos) / (pos - prevPos)) * settings.sectionLength;
                        }
                    }
                    prevPos = pos;
                });
                settings.$progress.css("width", totalPos);
                requestAnimationFrame(updateWorld);
            } else {
              $('.fishes-left').text(settings.salmonCount);
              $('.encounters-hit').text(settings.encounterSeen);
              $('#congrats-instructions').removeClass('hidden').addClass('show');
            }
          }

        } else {
          showGameOverScreen();
        }
    };

    var showGameOverScreen = function() {
      var isShowing = $('.intro-slider-wrapper').hasClass('show');
      if(!isShowing) {

        setGameOverSlider();
      }
    }

    var showVictorySlider = function() {
      var isShowing = $('.intro-slider-wrapper').hasClass('show');
      if(!isShowing) {

        setVictorySlider();
      }
    }

    var setVictorySlider = function() {
      if($('.spawn-death-slider').hasClass('slick-initialized')) {
        $('.spawn-death-slider').slick('unslick'); 
      }

      var sliderTemplate = $.templates("#introSliderTemplate");
      var sliderTemplateHTMLOutput = sliderTemplate.render(gameData.spawn_cards);
      $(".spawn-death-slider").html(sliderTemplateHTMLOutput);


      setTimeout(function(){
        $(".spawn-death-slider").slick({
          dots: true,
          infinite: false,
          slidesToShow: 1,
          variableWidth: true
        });
      }, 200);

      setTimeout(function(){        
        $('.spawn-death-slider-wrapper').removeClass('hidden').addClass('show');
      }, 500);
    }

    var setGameOverSlider = function() {
      if($('.spawn-death-slider').hasClass('slick-initialized')) {
        $('.spawn-death-slider').slick('unslick'); 
      }

      var sliderTemplate = $.templates("#introSliderTemplate");
      var sliderTemplateHTMLOutput = sliderTemplate.render(gameData.death_cards);
      $(".spawn-death-slider").html(sliderTemplateHTMLOutput);


      setTimeout(function(){
        $(".spawn-death-slider").slick({
          dots: true,
          infinite: false,
          slidesToShow: 1,
          variableWidth: true
        });
      }, 200);

      setTimeout(function(){        
        $('.spawn-death-slider-wrapper').removeClass('hidden').addClass('show');
      }, 500);
    }

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
      $('.fish-row .col').removeClass('selected');

      $('.fish-row .col img').removeClass('animated pulse');
      _this.removeClass('faded');
      _this.addClass('selected');

      _this.find('img').addClass('animated pulse');

      $('#close-select-fish').removeClass('faded');
      $('#SelectedSalmon').removeClass().addClass(settings.fishSelection + '-' + settings.salmonCount);

    }

    var setCloseIcon = function() {
      if(!$('.close-icon').hasClass('faded')) {
        $('.close-icon').addClass('faded')
      }
    }

    var hotspotClicked = function() {
      setCloseIcon();

      var wasAlreadyClicked = $(this).hasClass('faded');
      if(wasAlreadyClicked) {
        return;
      }

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
        lastCard = cityEncounters[hotspot_index];
      }

      if(location == 'ocean') {
        createEncounterSlider( oceanEncounters[hotspot_index] );
        lastCard = oceanEncounters[hotspot_index]
      }

      if(location == 'wilderness') {
        createEncounterSlider( wildernessEncounters[hotspot_index] );
        lastCard = wildernessEncounters[hotspot_index]
      }

      $('.slider-wrapper').removeClass('hidden').addClass('show');

      $(this).addClass('faded');

      settings.encounterSeen += 1;
    }

    var createForcedEncounterSlider = function(encounter) {
      setCloseIcon();

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

      if($('.slider').hasClass('slick-initialized')) {
        $('.slider').slick('unslick'); 
        //$('.slider').remove(); 
      }
      $('.slider').html(sliderHTML);

      //Slick slider call if multiple slides
      if(cards.length > 1) {
        $(".slider").not('.slick-initialized').slick({
          dots: true,
          infinite: false,
          slidesToShow: 1,
          variableWidth: true
        });

        /*$(".slider").slick({
          dots: true,
          infinite: false,
          slidesToShow: 1,
          variableWidth: true
        });*/

      }

      $('.slider-wrapper').removeClass('hidden').addClass('show');
      //console.log(sliderHTML);
    }

    var createEncounterSlider = function(encounter) {
      var sliderHTML = "";
      var cards = encounter.cards;
      
      for (var i = 0; i < cards.length; i++) {
        sliderHTML += getInformationCardHTML(cards[i]);
      };

      $('.slider').html(sliderHTML);
      $('.close-icon').removeClass('faded');

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

    var addFish = function() {
      if(settings.salmonCount < 5) {
        updateFish(1);
      }
    }

    var loseFish = function() {
      if(settings.salmonCount < 0) {
        
      } else {
        updateFish(-1);
      }
    }

    var updateFish = function(value) {
      var val = settings.salmonCount + value;
      var fishType = settings.fishSelection + '-';
      var removedClass = fishType + settings.salmonCount;
      var addedClass = fishType + val;

      $('#SelectedSalmon').removeClass(removedClass).addClass(addedClass);
      settings.salmonCount = val;
    }

    var getInformationCardHTML = function(card) {
      var template = $.templates("#informationSlideTemplate");
      var output = template.render(card);

      return output;
    }

    var getQuizCardHTML = function(card) {
      var template = $.templates("#quizSlideTemplate");
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
                }, 375);

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
      $('.intro-slider-wrapper').removeClass('show').addClass('hidden');
      setTimeout(function(){
        $('#select-fish').removeClass('hidden').addClass('show');
      }, 100);
    }

    var quizHandler = function () {
      var isAlreadyAnswered = $('.quiz-options').data('answered');
      if(!isAlreadyAnswered) {
        var add_fish = $(this).data('addfish');
        var lose_fish = $(this).data('losefish');
        var result = $(this).data('result');

        if(add_fish) {
          addFish();

          $(this).addClass('correct');

          $('.quiz-detail').text(result);
          //$('.solution-text').text('Gain 1 fish'); 
        }

        if(lose_fish) {
          loseFish();

          $(this).addClass('wrong');
          $('.answer-true').addClass('correct');

          $('.quiz-detail').text(result);
          //$('.solution-text').text('Lose 1 fish');
        }

        if(!add_fish && !add_fish) {
          $(this).addClass('wrong');
          $('.answer-true').addClass('correct');

          $('.quiz-detail').text(result);
        }

        $('.quiz-options').data('answered', true);

        setTimeout(function(){
          //$('.quiz-solution').removeClass('hidden').addClass('show');
          $('.quiz-detail').removeClass('hidden').addClass('show');
          $('.close-icon').removeClass('faded');
        }, 200);
      }
      
      //var isAlreadyAnswered = $('.quiz-options').data('answered');

      //if(!isAlreadyAnswered) {
        /*var isRightAnswer = $(this).hasClass('right-answer');

        if(isRightAnswer) {
          $(this).addClass('correct');
        } else {
          $(this).addClass('wrong');
          $('.right-answer').addClass('correct');
        }

        $('.quiz-options').data('answered', true);
        $('.quiz-options').addClass('quiz-answered');*/


        /*setTimeout(function(){
          $('.quiz-solution').removeClass('hidden').addClass('show');
           $('.quiz-detail').removeClass('hidden').addClass('show');
        }, 200);
        setTimeout(function(){
          $('.slider-wrapper').removeClass('show').addClass('hidden');
          settings.pause = true;
          requestAnimationFrame(updateWorld);
        }, 1500);*/
      //}
    }

    var closePopup = function () {
      //var isVisible = $(".slider-wrapper").is(":visible");
      var isFaded = $(this).hasClass('faded');
      if(!isFaded) {
        $('.slider-wrapper').removeClass('show').addClass('hidden');
        settings.pause = true;
        requestAnimationFrame(updateWorld);
      } 

      /*$('.slider-wrapper').removeClass('show').addClass('hidden');
      settings.pause = true;
      requestAnimationFrame(updateWorld);*/

      if(lastCard) {
        if(lastCard.cards[0].lose_fish) {
          loseFish();
        }

        if(lastCard.cards[0].add_fish) {
          addFish();
        }
      }

      lastCard = null;
    }

    
    return {
        init: init
    }
})();
