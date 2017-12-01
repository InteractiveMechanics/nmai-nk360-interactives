Game = (function() {
    //positions: [0, 4320, 8640, -1],
    var settings = {
      speed: 4,
      position: 0,
      fishSelection: null,
      pause: true,
      started: false,
      $world: $('.game-world'),
      positions: [0, 5820, 10840, -1],
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

    /**
      * Initializer for the salmon challenges interactive
      * @param {array} data holds the content data for this interactive
    */
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

    /**
      * Binds all events for the salmon interactive, sets the tooltip then initializes the game
    */

    var bindEvents = function() {
        $('body').on('click tap', '#show-instructions', showIntro);
        $('body').on('click tap', '#instructions', showIntroModal);
        $('body').on('click tap', '.get-started', showSalmonSelection);
        $('body').on('click tap', '#close-select-fish', hideSelectSalmon);
        $('body').on('click tap enter', '.fish-row .col', selectSalmon);
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

        $('body').on('keypress', '.fish-row .col', selectSalmonEnter);
        $('body').on('keypress', '#close-select-fish', hideSelectSalmonEnter);
        $('body').on('keydown', '.close-icon', closePopupEnter);
        

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();

        initGame();
    }

    /**
      * Initializer for the salmon challenges interactive
      * @param {string} [name] the name querystring
      * @param {string} [url] THe page url
      * @return null if no param, or the value of the request querystring
    */
    var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /**
      * Handler for the pause and play icon click
    */
    var hitPause = function() {
      var isPlayingVisible = $('.icon-play').is(':visible');

      if(isPlayingVisible) {
        settings.pause = false;
        $('.icon-play').hide();
        $('.icon-pause').show();
        $('#SelectedSalmon').css('animation-play-state', 'paused');
        $('.hotspot').addClass('state-paused');
        $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');
      } else {
        settings.pause = true;
        $('.icon-play').show();
        $('.icon-pause').hide();
        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').removeClass('state-paused');
        $('.waves').css('animation-play-state', 'running');
      $('.waves-1').css('animation-play-state', 'running');
      $('.waves-2').css('animation-play-state', 'running');
        requestAnimationFrame(updateWorld);
      }
    }

    /**
      * Handler for the pause and play event via the space bar
      * @param {event} [e] keyevent that was pressed
    */
    var hitPauseSpaceBar = function(e) {

      if(e.keyCode != 32) {
        return;
      }

      hitPause();
    }

    /**
      * Restarts the interactives 
    */
    var restartSalmonChallenges = function() {
      window.location.reload();
    }

    /**
      * Restarts the interactives but adds a skip query param for the intructions in the beginning.
    */
    var restartSalmonChallengesSkipInstructions = function() {
      window.location.href = window.location.pathname + "?instructions=false";
    }

    /**
      * sets the data and creates the HTML views for the intro cards, hotsopts, and random encounters
    */
    var setData = function() {
      setIntroCard();
      setRandomEncounters();
    }

    /**
      * Creates the Intro Slider HTML
    */
    var setIntroCard = function() {
      var sliderTemplate = $.templates("#introSliderTemplate");
      var sliderTemplateHTMLOutput = sliderTemplate.render(gameData.intro_cards);
      $(".intro-slider").html(sliderTemplateHTMLOutput);
    }

    /**
      * Creates an array of ecounters from the salmon challenge data
    */
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
      $('.hotspot').addClass('state-paused');
    }

    /**
      * Gets a random city encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getCityEncounter = function() {
      var x = getRandomValue(settings.cityStart, settings.cityEnd);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(cityEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    /**
      * Gets a random ocean encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getOceanEncounter = function() {
      var x = getRandomValue(settings.oceanStart, settings.oceanEnd);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(oceanEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    /**
      * Gets a random wilderness encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getWildernessEncounters = function() {
      var x = getRandomValue(settings.wildernessStart, settings.wildernessEnd);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(wildernessEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      return encounter;
    };


    /**
      * Gets a random encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getRandomEncounters = function() {
      var x = getRandomValue(400, 11150);
      var y = getRandomValue(150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(randomEncounters);
      
      encounter.left = x;
      encounter.bottom = y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    /**
      * Find a random item in an array and if it's not in use returns it else keeps searching
      * @param {array}, the array to get the random result from
      * @return the random item in array
    */
    var getRandomArrayItem = function(encounters){
      var encounter = encounters[Math.floor(Math.random() * encounters.length)];
      if (encounter.alreadyUsing) {
        return getRandomArrayItem(encounters);
      }
      return encounter;
    }

    /**
      * Creates an hotspot html view based on the passed param.
      * @param {object} the encounter to make a hotspot view from
      * @return the html view
    */
    var createHotspotHTML = function(encounter) {
      var hotspotTemplate = $.templates("#hotspotTemplate");
      var hotSpotHTMLOutput = hotspotTemplate.render(encounter);

      return hotSpotHTMLOutput;
    }

    /**
      * Find a random item in an array and if it's not in use returns it else keeps searching
      * @param {array}, the array to get the random result from
      * @return the random item in array
    */
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

    /**
      * Gets a random city encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getCityEncounter = function() {
      var position = getRandomPositon(settings.cityStart, settings.cityEnd, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(cityEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    /**
      * Gets a random ocean encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getOceanEncounter = function() {
      var position = getRandomPositon(settings.oceanStart, settings.oceanEnd, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(oceanEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    /**
      * Gets a random wilderness encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getWildernessEncounters = function() {
      var position = getRandomPositon(settings.wildernessStart, settings.wildernessEnd, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(wildernessEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    /**
      * Gets a random encounter and sets it's left and bottom value to random numbers
      * @return the random ecounter
    */
    var getRandomEncounters = function() {
      var position = getRandomPositon(400, 11150, 150, window.innerHeight - 200);
      var encounter = getRandomArrayItem(randomEncounters);
      
      encounter.left = position.x;
      encounter.bottom = position.y;
      encounter.alreadyUsing = true;

      return encounter;
    };

    /**
      * Creates a hotspot position and checks if that position is unique 
      * @param {array}, 
      * @return the random item in array
    */
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

    /**
      * Shows the game complete victory slider when the user clears the victory modal at the end of the game
    */
    var closeCongratsScreen = function() {
      $('#congrats-instructions').removeClass('show').addClass('hidden');

      showVictorySlider();
    }

    /**
      * Checks the current position and sees if there's a forced encounter at that point
      * @param {current_position}, the current position of where you are in the game
    */
    var checkEncounters = function(current_position) {
      var encounters = gameData.forced;
      var minusValue = 200;
      if(window.innerWidth < 769) {
        var minusValue = -100;
      }

      for (var i = 0; i < encounters.length; i++) {
        if((encounters[i].trigger_location - minusValue) == current_position) {
          settings.pause = false;
          createForcedEncounterSlider(encounters[i]);
          //alert(encounters[i].cards[0].title)
        }
      };
    };

    /**
      * Send events to Google Analytics for events and actions we want to capture with Salmon Challenges
      * @param {string}, heading of the event that we are looking to capture
      * @param {string}, action of the event we are looking to capture
      * @param {string}, label of the event we are looking to capture
    */
    var sendGoogleAnalyticsEvent = function(heading, action, label) {
      sendAnalyticsEvent(heading, action, label);
    }

    /**
      * Handles the game logic for moving the backgrounds, hotspots, and progress bar movement
    */
    var updateWorld = function() {
        var totalPos = 0, prevPos = 0;

        if(settings.salmonCount > 0) {

          if(settings.pause) {
            var current_position = -settings.position;
            if (current_position < 17440) {

             /* if(checkEncounters(current_position)) {

              };

                if(current_position == 12500) {
                  $('.number-of-salmon').addClass('rising-water-number');
                  $('#SelectedSalmon').addClass('rising-water');
                }*/

                settings.position -= settings.speed;
                //s$('.game-world').css('left', settings.position + 'px');
                $('.game-world').css("transform", "translate(" + settings.position + "px,0)");

                /*settings.positions.forEach(function(pos, index) {
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
                settings.$progress.css("width", totalPos);*/
                requestAnimationFrame(updateWorld);
            } else {
              /*$('.fishes-left').text(settings.salmonCount);
              $('.encounters-hit').text(settings.encounterSeen);
              $('#congrats-instructions').removeClass('hidden').addClass('show');
              $('#SelectedSalmon').css('animation-play-state', 'paused');
              $('.hotspot').addClass('state-paused');
              $('.waves').css('display', 'none');
              $('.waves-1').css('display', 'none');
              $('.waves-2').css('display', 'none');

              $('#SelectedSalmon').addClass('sonic-effect');
              $('.number-of-salmon').addClass('sonic-effect');

              sendGoogleAnalyticsEvent("End game", "complete");*/


            }
          }

        } else {
          /*showGameOverScreen();*/
        }
    };

    /**
      * Shows the game over modal when the user completes the Salmon Challenges Game
    */
    var showGameOverScreen = function() {
      var isShowing = $('.intro-slider-wrapper').hasClass('show');
      if(!isShowing) {
        sendGoogleAnalyticsEvent("End game", "death");
        setGameOverSlider();
      }
    }

    /**
      * Shows and creates the end game slider when you complete Salmon Challenges
    */
    var showVictorySlider = function() {
      var isShowing = $('.intro-slider-wrapper').hasClass('show');
      if(!isShowing) {

        setVictorySlider();
      }
    }

    /**
      * Creates the game completition slider for salmon challenges
    */
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

    /**
      * Creates the html for the game completition slider for Salmon Challenges
    */
    var setGameOverSlider = function() {
      var sliderTemplate = $.templates("#introSliderTemplate");
      var sliderTemplateHTMLOutput = ""; sliderTemplate.render(gameData.death_cards);
      gameData.death_cards[gameData.death_cards.length - 1].isLastSlide = true;


      var cards = gameData.death_cards;

      for (var i = 0; i < cards.length; i++) {
        
        sliderTemplateHTMLOutput += getInformationCardHTML(cards[i]);

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

    /**
      * The start fuction call to start the Salmon Challenges interactive/game
    */
    var startGame = function() {
        $('.hotspot').removeClass('state-paused');
        setTimeout(function () {
            requestAnimationFrame(updateWorld);
        }, 1000/60);
    };

    /**
      * Fires the game start function call.
    */
    var initGame = function() {
      $('.start button').on('click', startGame);
    };


    /**
      * After the user has selected the salmon, and starts the activity we will hide the 
      * salmon selection screen and start the game.
    */
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

    /**
      * After the user has selected the salmon, and starts the activity we will hide the 
      * salmon selection screen and start the game.
    */
    var hideSelectSalmonEnter = function(e) {

      if(e.keyCode != 13) {
        return;
      }

      var isFaded = $('#close-select-fish').hasClass('faded');

      if(!isFaded) {
        sendGoogleAnalyticsEvent("Salmon selected", settings.fishSelection);
        $('#select-fish').removeClass('show').addClass('hidden');
        $('.number-of-salmon').text(settings.salmonCount);
        $('.number-of-salmon').css('opacity', .8);
        startGame();

        $('.fish-row .col').prop('tabIndex', -1);
        $(this).prop('tabIndex', -1);
      }
    }

    /**
      * Allows the user to select the salmon they which to use during Salmon Challenges. The salmon that 
      * weren't selected becomed faded and the button becomes active
    */
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

    /**
      * Allows the user to select the salmon they which to use during Salmon Challenges. The salmon that 
      * weren't selected becomed faded and the button becomes active
    */
    var selectSalmonEnter = function(e) {

      if(e.keyCode != 13) {
        return;
      }

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

      $('#close-select-fish').attr('tabindex', 4);
    }

    /**
      * Handles the close icon logic for the cards and will pause the running animations because
      * while a card is up all animation aren't supposed to be running
    */
    var setCloseIcon = function() {
      $('#SelectedSalmon').css('animation-play-state', 'paused');
      $('.hotspot').addClass('state-paused');
      $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');
      if(!$('.close-icon').hasClass('close-faded')) {
        $('.close-icon').addClass('close-faded')
      }
    }

    /**
      * Handler function for when a user clicks a hotspot. The close icon display/view is reseted and 
      * we check to see that the hotspot wasn't already clicked. and that a slider is already showing. 
      * If we pass all the checks we will find out what hotspot was clicked then display the right random 
      * ecounter card.
    */
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

    /**
      * Creates the slider of a forced encounter which is an encounter that 
      * happens at a specific position. 
      * @param {array}, contains the data for the encounter we want to create
    */
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

        var $carousel = $('.slider');
        $(document).on('keydown', function(e) {
            if(e.keyCode == 37) {
                $carousel.slick('slickPrev');
            }
            if(e.keyCode == 39) {
                $carousel.slick('slickNext');
            }
        });
      }

      $('.slider-wrapper').removeClass('hidden').addClass('show');
      sendGoogleAnalyticsEvent("Encounter", "Forced encounter - " + cards[0].title);
    }


    /**
      * Creates the slider of a random encounter which is an encounter that 
      * happens when a hotspot item was clicked
      * @param {array}, contains the data for the encounter we want to create
    */
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
        $('.close-icon').css('opacity', 1);
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

    /**
      * Increases the current salmon count by 1 unless the current number of salmon is 5
    */
    var addFish = function() {
      if(settings.salmonCount < 5) {
        updateFish(1);
      }
    }

    /**
      * Decreases the current salmon count by 1 unless the current number of salmon is 0
    */
    var loseFish = function() {
      if(settings.salmonCount < 0) {
        
      } else {
        updateFish(-1);
      }
    }

    /**
      * Updates the current salmon count and also updates the salmon view with one more or less fish
      * @param {int}, the number value of which the current number of Salmon will get increased or decreased by
    */
    var updateFish = function(value) {
      var val = settings.salmonCount + value;
      var fishType = settings.fishSelection + '-';
      var removedClass = fishType + settings.salmonCount;
      var addedClass = fishType + val;

      $('#SelectedSalmon').removeClass(removedClass).addClass(addedClass);
      settings.salmonCount = val;
    }

    /**
      * Generates the Information Card HTML view
      * @param {array}, contains an object literal of the current card
    */
    var getInformationCardHTML = function(card) {
      var template = $.templates("#informationSlideTemplate");
      var output = template.render(card);

      return output;
    }

    /**
      * Generates the Quiz Card HTML view for the slider
      * @param {array}, contains an object literal of the current card
    */
    var getQuizCardHTML = function(card) {
      var template = $.templates("#quizSlideTemplate");
      var output = template.render(card);

      return output;
    }
    
    /**
      * Function call for when the querystring to skip the instruction is present in the URL
    */
    var noIntro = function() {
      $('#select-fish').removeClass('hidden').addClass('show');
      settings.pause = false;
      $('#instructions').data('instructionsclicked', true);
      $('#SelectedSalmon').css('animation-play-state', 'paused');
      $('.hotspot').addClass('state-paused');
      $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');

      $('#close-instructions').attr('tabindex', -1);
    }

    /**
      * Similar to noIntro() but the querystring isn't present and we have a handler that checks to see if the
      * the game is paused
    */
    var showIntro = function () {
      var isPaused = $('.icon-pause').is(':visible');

      if(isPaused) {
        return;
      } 

      settings.pause = false;
      $('#instructions').data('instructionsclicked', true);
      $('#SelectedSalmon').css('animation-play-state', 'paused');
      $('.hotspot').addClass('state-paused');
      $('.waves').css('animation-play-state', 'paused');
      $('.waves-1').css('animation-play-state', 'paused');
      $('.waves-2').css('animation-play-state', 'paused');

      $('#close-instructions').attr('tabindex', -1);
    }



    /**
      * Creates the salmon challenge introduction slider
    */
    var showIntroModal = function() {
      var instructionsClicked = $('#instructions').data('instructionsclicked');

      if(instructionsClicked) {
        settings.pause = true;
        $('#instructions').data('instructionsclicked', false);
        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').removeClass('state-paused');
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

          var $carousel = $('.intro-slider');
          $(document).on('keydown', function(e) {
              if(e.keyCode == 37) {
                  $carousel.slick('slickPrev');
              }
              if(e.keyCode == 39) {
                  $carousel.slick('slickNext');
              }
          });

          $('.intro-slider').on('afterChange', function(e, slick, currentSlide){
              if(slick.slideCount == currentSlide + 1) {
                
                $('.close-icon').removeClass('close-faded');
                $('.intro-slider .slick-next').hide();
                $('.intro-slider-wrapper .close-icon').attr('tabindex', 5);
              }

              if(slick.slideCount > currentSlide + 1) {
                $('.intro-slider .slick-next').show();
              }
          });


        }, 100);
      }
    }

    /**
      * Shows the salmon selection screen to the user
    */
    var showSalmonSelection = function() {
      $('.intro-slider-wrapper').removeClass('show').addClass('hidden');
      setTimeout(function(){
        $('#select-fish').removeClass('hidden').addClass('show');
      }, 100);
    }


    /**
      * Functions the handles the logic for the quiz card. Makes sure the quiz isn't answered first.
      * Checks to see what the result of the answer that was selected and calls the appropriate add or 
      * lose fish method.
    */
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

          $('.answer-false').addClass('wrong');
          $('.answer-true').addClass('correct');

          $('.quiz-detail').text(result);

          if(lastCard > 0) {        
            sendGoogleAnalyticsEvent("Encounter", "Encounter - " + lastCard[0].title + " - correct");
          }
        }

        if(lose_fish) {
          loseFish();

          $('.answer-false').addClass('wrong');
          $('.answer-true').addClass('correct');

          $('.quiz-detail').text(result);
          if(lastCard > 0) {        
            sendGoogleAnalyticsEvent("Encounter", "Encounter - " + lastCard[0].title + " - incorrect");
          }
        }

        if(!add_fish && !add_fish) {
          $('.answer-false').addClass('wrong');
          $('.answer-true').addClass('correct');

          $('.quiz-detail').text(result);
        }

        $('.quiz-options').data('answered', true);

        setTimeout(function(){
          $('.quiz-detail').removeClass('hidden').addClass('show');
          $('.close-icon').removeClass('close-faded');
        }, 200);

        $('.slider-wrapper .close-icon').attr('tabindex', 5);
      }
    }

    /**
      * Close icon handler for the cards and sliders with Salmon Challenges. 
      * Checks to see if the slider is showing and if the close icon isn't faded, if so
      * the animations start back up running and the overlay, slider/card disappears.
    */
    var closePopup = function () {
      var isFaded = $(this).hasClass('close-faded');
      var isSlider = $('.slider-wrapper').hasClass('show');
      if(!isFaded && isSlider) {
        $('.slider-wrapper').removeClass('show').addClass('hidden');
        settings.pause = true;
        requestAnimationFrame(updateWorld);

        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').removeClass('state-paused');
        $('.waves').css('animation-play-state', 'running');
        $('.waves-1').css('animation-play-state', 'running');
        $('.waves-2').css('animation-play-state', 'running');

        $(this).css('opacity', 0);

        var className = settings.fishSelection + '-' + settings.salmonCount;
        $('#SelectedSalmon').removeClass(className);

        setTimeout(function(){
          $('#SelectedSalmon').addClass(className);
        }, 10);
        
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

      if(!isFaded && isSlider) {
        
        var className = settings.fishSelection + '-' + settings.salmonCount;
        $('#SelectedSalmon').removeClass(className);
        
        setTimeout(function(){
          $('#SelectedSalmon').addClass(className);
        }, 10);
        
      } 
    }

    /**
      * Close icon handler for the cards and sliders with Salmon Challenges. 
      * Checks to see if the slider is showing and if the close icon isn't faded, if so
      * the animations start back up running and the overlay, slider/card disappears.
    */
    var closePopupEnter = function (e) {

      var isFaded = $(this).hasClass('close-faded');
      var isSlider = $('.slider-wrapper').hasClass('show');
      if(!isFaded && isSlider) {
        $('.slider-wrapper').removeClass('show').addClass('hidden');
        settings.pause = true;
        requestAnimationFrame(updateWorld);

        $('#SelectedSalmon').css('animation-play-state', 'running');
        $('.hotspot').removeClass('state-paused');
        $('.waves').css('animation-play-state', 'running');
        $('.waves-1').css('animation-play-state', 'running');
        $('.waves-2').css('animation-play-state', 'running');

        $(this).css('opacity', 0);

        var className = settings.fishSelection + '-' + settings.salmonCount;
        $('#SelectedSalmon').removeClass(className);

        setTimeout(function(){
          $('#SelectedSalmon').addClass(className);
        }, 10);
        
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

      if(!isFaded && isSlider) {
        
        var className = settings.fishSelection + '-' + settings.salmonCount;
        $('#SelectedSalmon').removeClass(className);
        
        setTimeout(function(){
          $('#SelectedSalmon').addClass(className);
        }, 10);
        
      } 
    }

    /**
      * Returns the progress section value
      * @param {integer} index of the array we want to check
      * @return 3 the start of the game
    */
    var getProgressBarPositionsAtIndex = function(index) {
      return settings.positions[index];
    }

    /**
      * Returns the amont of salmon you start with at the beginning of the game
      * @return 3 the start of the game
    */
    var getStartingSalmonCount = function() {
      return settings.salmonCount;
    }
    
    return {
        init: init,
        getParameterByName: getParameterByName,
        getProgressBarPositionsAtIndex: getProgressBarPositionsAtIndex,
        getStartingSalmonCount: getStartingSalmonCount

    }
})();
