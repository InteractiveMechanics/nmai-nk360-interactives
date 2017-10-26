Game = (function() {
    //positions: [0, 4320, 8640, -1],
    var settings = {
      speed: 4,
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
      backgroundSpeed: 0,
      midgroundSpeed: .1,
      foregroundSpeed: 1,
      $background: $('.game-world .game-world__background'),
      $midground: $('.game-world .game-world__midground'),
      $foreground: $('.game-world .game-world__foreground'),
      backgroundPosition: 0,
      midgroundPosition: 0,
      foregroundPosition: 0,
      cityStart: 4400,
      cityEnd: 8600,
      oceanStart: 400,
      oceanEnd: 5000,
      wildernessStart: 8800,
      wildernessEnd: 11150,
      encounterSeen: 0
    };

    var AnalyticsLabel = "Salmon Challenges";

    var lastCard = null;

    var randomEncounters = [];
    var oceanEncounters = [];
    var wildernessEncounters = [];
    var cityEncounters = [];
    var randomNumberArray = [];
    var PositionArray = [];

    var init = function(data) {
        $('.icon-pause').hide();
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

      if(getParameterByName('instructions') == "false") {  
        $('#select-fish').removeClass('hidden').addClass('show');
      }
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
        $('body').on('click tap', '.restart', restartSalmonChallengesSkipInstructions);
        $('body').on('click tap', '#pause-icon', hitPause);
        $('body').on('click tap', '.icon-play', hitPause);
        $('body').on('click tap', '.icon-pause', hitPause);
        $('body').on('click tap', '.restart-skip-intro', restartSalmonChallengesSkipInstructions);
        $('body').keyup(hitPauseSpaceBar);

        

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();

        initGame();
    }

    var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var hitPause = function() {
      var isPlayingVisible = $('.icon-play').is(':visible');

      if(isPlayingVisible) {
        settings.pause = false;
        $('.icon-play').hide();
        $('.icon-pause').show();
        $('#SelectedSalmon').css('animation-play-state', 'paused');
        $('.hotspot').css('animation-play-state', 'paused');
        $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');
      } else {
        settings.pause = true;
        $('.icon-play').show();
        $('.icon-pause').hide();
        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').css('animation-play-state', 'running');
        $('.waves').css('animation-play-state', 'running');
      $('.waves-1').css('animation-play-state', 'running');
      $('.waves-2').css('animation-play-state', 'running');
        requestAnimationFrame(updateWorld);
      }
    }

    var hitPauseSpaceBar = function(e) {

      if(e.keyCode != 32) {
        return;
      }

      var isPlayingVisible = $('.icon-play').is(':visible');

      if(isPlayingVisible) {
        settings.pause = false;
        $('.icon-play').hide();
        $('.icon-pause').show();
        $('#SelectedSalmon').css('animation-play-state', 'paused');
        $('.hotspot').css('animation-play-state', 'paused');
        $('.waves').css('animation-play-state', 'paused');
        $('.waves-1').css('animation-play-state', 'paused');
        $('.waves-2').css('animation-play-state', 'paused');
      } else {
        settings.pause = true;
        $('.icon-play').show();
        $('.icon-pause').hide();
        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').css('animation-play-state', 'running');
        $('.waves').css('animation-play-state', 'running');
        $('.waves-1').css('animation-play-state', 'running');
        $('.waves-2').css('animation-play-state', 'running');
        requestAnimationFrame(updateWorld);
      }
    }

    var restartSalmonChallenges = function() {
      window.location.reload();
    }

    var restartSalmonChallengesSkipInstructions = function() {
      window.location.href = window.location.pathname + "?instructions=false";
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

      var hotspotHTML = createHotspotHTML(arr);
      $('.encounters').html(hotspotHTML);
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

      return encounter;
    };

    var getRandomArrayItem = function(encounters){
      var encounter = encounters[Math.floor(Math.random() * encounters.length)];
      if (encounter.alreadyUsing) {
        return getRandomArrayItem(encounters);
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

    var getRandomValue = function(min,max) {
      var number = Math.floor(Math.random() * (max - min + 1) + min);
      var isUnique = true;

      for (var i = randomNumberArray.length - 1; i >= 0; i--) {
        var n = randomNumberArray[i];
        if( (n - 200) >= number && (n + 200) <= number ) {
          isUnique = false;
        }
      };

      if(isUnique) {
        randomNumberArray.push(number);
        return number;
      } else {
        return getRandomValue(min, max);
      }
    }

    var getCityEncounter = function() {
      var position = getRandomPositon(settings.cityStart, settings.cityEnd, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(cityEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    var getOceanEncounter = function() {
      var position = getRandomPositon(settings.oceanStart, settings.oceanEnd, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(oceanEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    var getWildernessEncounters = function() {
      var position = getRandomPositon(settings.wildernessStart, settings.wildernessEnd, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(wildernessEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    var getRandomEncounters = function() {
      var position = getRandomPositon(400, 11150, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(randomEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    var getRandomPositon = function(xMin, xMax, yMin, yMax) {
      var xNumber = Math.floor(Math.random() * (xMax - xMin + 1) + xMin);
      var yNumber = Math.floor(Math.random() * (yMax - yMin + 1) + yMin);

      var isUnique = true;
      for(var i = 0; i < PositionArray.length; i++) {
        if ( (PositionArray[i].x == xNumber) && ((PositionArray[i].x <= xNumber - 80) && (PositionArray[i].x >= xNumber + 80)) ) {
          isUnique = false;
        }

        if ( (PositionArray[i].y == xNumber) && ((PositionArray[i].y <= xNumber - 80) && (PositionArray[i].y >= xNumber + 80)) ) {
          isUnique = false;
        }
      }

      if(isUnique) {
        PositionArray.push({
          x: xNumber,
          y: yNumber
        });

        return {
          x: xNumber,
          y: yNumber
        };

      } else {
        return getRandomPositon(xMin, xMax, yMin, yMax);
      }
    }

    var closeCongratsScreen = function() {
      $('#congrats-instructions').removeClass('show').addClass('hidden');

      showVictorySlider();
    }

    var checkEncounters = function(current_position) {
      var encounters = gameData.forced;
      for (var i = 0; i < encounters.length; i++) {
        if((encounters[i].trigger_location - 200) == current_position) {
          settings.pause = false;
          createForcedEncounterSlider(encounters[i]);
          //alert(encounters[i].cards[0].title)
        }
      };
    };

    var sendGoogleAnalyticsEvent = function(heading, action, label) {
      sendAnalyticsEvent(heading, action, label);
    }

    var updateWorld = function() {
        var totalPos = 0, prevPos = 0;

        if(settings.salmonCount > 0) {

          if(settings.pause) {
            var current_position = -settings.position;
            if (current_position < 17840) {

                if(checkEncounters(current_position)) {

                };

                if(current_position == 12500) {
                  $('.number-of-salmon').addClass('rising-water');
                  $('#SelectedSalmon').addClass('rising-water');
                }

                settings.position -= settings.speed;
                $('.game-world').css('left', settings.position + 'px');
            
                /*settings.backgroundPosition -= 0;
                settings.midgroundPosition -= .1;
                settings.foregroundPosition -= .5;
                
                settings.$background.css("transform", "translate(" + settings.backgroundPosition + "px,0)");
                settings.$midground.css("transform", "translate(" + settings.midgroundPosition + "px,0)");
                settings.$foreground.css("transform", "translate(" + settings.foregroundPosition + "px,0)");

                var menus = document.getElementsByClassName("hotspot");
                for (var i = menus.length - 1; i >= 0; i--)
                {
                  var _left = parseInt(menus[i].style.left) - 4;
                  menus[i].style.left = _left + "px";
                }*/
                
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
              $('#SelectedSalmon').css('animation-play-state', 'paused');
              $('.hotspot').css('animation-play-state', 'paused');
              $('.waves').css('display', 'none');
              $('.waves-1').css('display', 'none');
              $('.waves-2').css('display', 'none');

              $('#SelectedSalmon').addClass('sonic-effect');
              $('.number-of-salmon').addClass('sonic-effect');

              sendGoogleAnalyticsEvent("End game", "complete");


            }
          }

        } else {
          showGameOverScreen();
        }
    };

    var showGameOverScreen = function() {
      var isShowing = $('.intro-slider-wrapper').hasClass('show');
      if(!isShowing) {
        sendGoogleAnalyticsEvent("End game", "death");
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

      gameData.spawn_cards[gameData.spawn_cards.length - 1].isLastSlide = true;


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

        $('.spawn-death-slider').on('afterChange', function(e, slick, currentSlide){
            if(slick.slideCount == currentSlide + 1) {
              $('.close-icon').removeClass('close-faded');
              $('.slider .slick-next').hide();
            }

            if(slick.slideCount > currentSlide + 1) {
              $('.slider .slick-next').show();
            }
        });
      }, 200);

      setTimeout(function(){        
        $('.spawn-death-slider-wrapper').removeClass('hidden').addClass('show');
      }, 500);
    }

    var setGameOverSlider = function() {
      var sliderTemplate = $.templates("#introSliderTemplate");
      var sliderTemplateHTMLOutput = ""; sliderTemplate.render(gameData.death_cards);
      gameData.death_cards[gameData.death_cards.length - 1].isLastSlide = true;


      var cards = gameData.death_cards;

      for (var i = 0; i < cards.length; i++) {
        
        sliderTemplateHTMLOutput += getInformationCardHTML(cards[i]);

        console.log(getInformationCardHTML(cards[i]));

        
      };

      $(".spawn-death-slider").html(sliderTemplateHTMLOutput);

      setTimeout(function(){
        $(".spawn-death-slider").slick({
          dots: true,
          infinite: false,
          slidesToShow: 1,
          variableWidth: true
        });

        $('.spawn-death-slider').on('afterChange', function(e, slick, currentSlide){
            if(slick.slideCount == currentSlide + 1) {
              $('.close-icon').removeClass('close-faded');
              $('.slider .slick-next').hide();
            }

            if(slick.slideCount > currentSlide + 1) {
              $('.slider .slick-next').show();
            }
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
        sendGoogleAnalyticsEvent("Salmon selected", settings.fishSelection);
        $('#select-fish').removeClass('show').addClass('hidden');
        $('.number-of-salmon').text(settings.salmonCount);
        $('.number-of-salmon').css('opacity', .8);
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

      settings.started = true;
    }

    var setCloseIcon = function() {
      $('#SelectedSalmon').css('animation-play-state', 'paused');
      $('.hotspot').css('animation-play-state', 'paused');
      $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');
      if(!$('.close-icon').hasClass('close-faded')) {
        $('.close-icon').addClass('close-faded')
      }
    }

    var hotspotClicked = function() {
      if(!settings.pause) {
        return;
      }

      setCloseIcon();

      var wasAlreadyClicked = $(this).hasClass('hotspot-faded');
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

      $(this).addClass('hotspot-faded');

      settings.encounterSeen += 1;

      if(lastCard > 0) {        
        sendGoogleAnalyticsEvent("Encounter", "Random encounter - " + lastCard[0].title);
      }
    }

    var createForcedEncounterSlider = function(encounter) {
      setCloseIcon();

      var sliderHTML = "";
      var cards = encounter.cards;

      if(cards.length > 1) {
        $('.before-indicator').addClass('card-before');
        $('.after-indicator').addClass('card-after');
      }


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

        $('.slider').on('afterChange', function(e, slick, currentSlide){
            if(slick.slideCount == currentSlide + 1) {
              $('.close-faded').css('opacity', '.2');
              $('.slider .slick-next').hide();
            }

            if(slick.slideCount > currentSlide + 1) {
              $('.slider .slick-next').show();
            }
        });
      }

      $('.slider-wrapper').removeClass('hidden').addClass('show');
      sendGoogleAnalyticsEvent("Encounter", "Forced encounter - " + cards[0].title);
    }

    var createEncounterSlider = function(encounter) {
      var sliderHTML = "";
      var cards = encounter.cards;
      
      for (var i = 0; i < cards.length; i++) {
        sliderHTML += getInformationCardHTML(cards[i]);
      };

      $('.slider').html(sliderHTML);
      $('.close-icon').removeClass('close-faded');

      if(cards.length == 1) {
        $('.before-indicator').removeClass('card-before');
        $('.after-indicator').removeClass('card-after');
      }

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
              $('.close-icon').removeClass('close-faded');
              $('.slider .slick-next').hide();
            }

            if(slick.slideCount > currentSlide + 1) {
              $('.slider .slick-next').show();
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
    
    var noIntro = function() {
      $('#select-fish').removeClass('hidden').addClass('show');
      settings.pause = false;
      $('#instructions').data('instructionsclicked', true);
      $('#SelectedSalmon').css('animation-play-state', 'paused');
      $('.hotspot').css('animation-play-state', 'paused');
      $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');
    }

    var showIntro = function () {
      settings.pause = false;
      $('#instructions').data('instructionsclicked', true);
      $('#SelectedSalmon').css('animation-play-state', 'paused');
      $('.hotspot').css('animation-play-state', 'paused');
      $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');
    }



    var showIntroModal = function() {
      var instructionsClicked = $('#instructions').data('instructionsclicked');

      if(instructionsClicked) {
        settings.pause = true;
        $('#instructions').data('instructionsclicked', false);
        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').css('animation-play-state', 'running');
        $('.waves').css('animation-play-state', 'running');
        $('.waves-1').css('animation-play-state', 'running');
        $('.waves-2').css('animation-play-state', 'running');

        requestAnimationFrame(updateWorld);
      };

      if(!settings.started) {
        setTimeout(function() {
          $('.intro-slider-wrapper').removeClass('hidden').addClass('show');

          $(".intro-slider").slick({
            dots: true,
            infinite: false,
            slidesToShow: 1,
            variableWidth: true
          });

          $('.intro-slider').on('afterChange', function(e, slick, currentSlide){
              if(slick.slideCount == currentSlide + 1) {
                
                $('.close-icon').removeClass('close-faded');
                $('.intro-slider .slick-next').hide();

              }

              if(slick.slideCount > currentSlide + 1) {
                $('.intro-slider .slick-next').show();
              }
          });


        }, 100);
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
        $('.close-icon').removeClass('close-faded');
        $('.close-icon').css('opacity', 1);
        var add_fish = $(this).data('addfish');
        var lose_fish = $(this).data('losefish');
        var result = $(this).data('result');

        if(add_fish) {
          addFish();

          $(this).addClass('correct');

          $('.quiz-detail').text(result);

          if(lastCard > 0) {        
            sendGoogleAnalyticsEvent("Encounter", "Encounter - " + lastCard[0].title + " - correct");
          }
        }

        if(lose_fish) {
          loseFish();

          $(this).addClass('wrong');
          $('.answer-true').addClass('correct');

          $('.quiz-detail').text(result);
          if(lastCard > 0) {        
            sendGoogleAnalyticsEvent("Encounter", "Encounter - " + lastCard[0].title + " - incorrect");
          }
        }

        if(!add_fish && !add_fish) {
          $(this).addClass('wrong');
          $('.answer-true').addClass('correct');

          $('.quiz-detail').text(result);
        }

        $('.quiz-options').data('answered', true);

        setTimeout(function(){
          $('.quiz-detail').removeClass('hidden').addClass('show');
          $('.close-icon').removeClass('close-faded');
        }, 200);
      }
    }

    var closePopup = function () {
      var isFaded = $(this).hasClass('close-faded');
      var isSlider = $('.slider-wrapper').hasClass('show');
      if(!isFaded && isSlider) {
        $('.slider-wrapper').removeClass('show').addClass('hidden');
        settings.pause = true;
        requestAnimationFrame(updateWorld);

        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').css('animation-play-state', 'running');
        $('.waves').css('animation-play-state', 'running');
        $('.waves-1').css('animation-play-state', 'running');
        $('.waves-2').css('animation-play-state', 'running');
      } 

      var isIntroSlider = $('.intro-slider-wrapper').hasClass('show');
      if(!isFaded && isIntroSlider) {
        $('.intro-slider-wrapper').removeClass('show').addClass('hidden');
        showSalmonSelection();
      }
      if(lastCard) {
        if(lastCard.cards[0].lose_fish) {
          loseFish();
        }

        if(lastCard.cards[0].add_fish) {
          addFish();
        }
      }

      lastCard = null;
      $('.number-of-salmon').text(settings.salmonCount);
    }

    
    return {
        init: init
    }
})();
