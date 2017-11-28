Annotator = (function() {
    var AnnotatorData;

    var hasShownThemeCard = false;
    var markersDefault = {
      "privileges": 3,
      "responibilities": 5,
      "theme3": 2
    };

    var AnalyticsLabel = "Resource Annotator";

    var objItem;

    var markersInJSON = [];
    var heading = "";

    var init = function(data) {
      AnnotatorData = data;
      bindEvents();
    }

    var modalWidth = 275;

    var markerArray = [
      './assets/marker-01@2x.png',
      './assets/marker-02@2x.png',
      './assets/marker-03@2x.png',
      './assets/marker-04@2x.png',
      './assets/marker-05@2x.png',
    ]

    var printEvent = window.matchMedia('print');

    /**
      * Handler that allows the user to bypass the instructions when they go to the source 
      * selection screen
    */
    var skipInstructions = function() {
      window.location.href = window.location.pathname + "?instructions=false";
    }

     /**
      * Handler that allows the user to bypass the instructions when they go to the source 
      * selection screen
    */
    var skipInstructionsEnter = function() {
      window.location.href = window.location.pathname + "?instructions=false";
    }
    
    /**
      * Creates the comma separated of themes for top heading
    */
    var createHeading = function() {
      var arr = markersInJSON;

      if(arr.length == 1) {
        heading =  arr[0].theme_id;
      }

      if(arr.length > 1) {
        for (var i = 0; i < arr.length; i++) {
          if( i == arr.length - 1) {
            heading = heading.substring(0, heading.length - 2);
            heading += " and " + arr[i].theme_id;
          } else {
            heading += arr[i].theme_id + ", ";
          }
        }
      }

    }

    /**
      * Hnadler to shows the annotation view when on mobile
    */
    var showView = function() {
      var isShowing = $('.show-right-screen').is(":Visible");
      if(isShowing) {
        $('.show-right-screen').addClass('hidden-mobile');
        $('.show-left-screen').removeClass('hidden-mobile');
      }
    };

    /**
      * Handler to show the additional content view when on mobile
    */
    var showContent = function() {
       var isShowing = $('.show-left-screen').is(":Visible");
       if(isShowing) {
        $('.show-left-screen').addClass('hidden-mobile');
        $('.show-right-screen').removeClass('hidden-mobile');
       }
    };

    /**
      * Click handler function for the mobile menu on the annotation screen
    */
    var mobileMenuClicked = function () {
      $('.half-menu').removeClass('active');
      $(this).addClass('active');
      var page = $(this).data('page');

      if(page == 'content') {
        showContent();
      } else {
        showView();
      }
    }

    /**
      * Handler that focus the textarea with a pin, when it shows up on the screen
    */
    var focusOnTextArea = function() {
      $(this).focus();
    }
    var bindEvents = function() {
        $('body').on('click tap', '.annotation-slider-screen .btn-success', openNotesScreen);
        $('body').on('click tap', '.icon-home', showLostProgress);
        $('body').on('keypress', '.icon-home', showLostProgressEnter);
        $('body').on('click tap', '#instructions', showIntro);
        $('body').on('click tap', '.close-icon', closePopup);
        $('body').on('keypress', '.close-icon', closePopupEnter);
        $('body').on('click tap', '.summary-link', paraphrasedClicked);

        $('body').on('click tap', '.print-notes', printPage);
        $('body').on('keypress', '.print-notes', printPageEnter);
        $('body').on('click tap', '.reload-page', skipInstructions);
        $('body').on('keypress', '.reload-page', skipInstructionsEnter);
        $('body').on('click tap', '#close-porgess', hideLostProgress);

        $('body').on('click tap', '.half-menu', mobileMenuClicked);

        $('body').on('click tap', 'textarea', focusOnTextArea);

        window.onbeforeprint = function() {
          sendGoogleAnalyticsEvent("Print preview", "open");
        }
        window.onafterprint=function(){
          sendGoogleAnalyticsEvent("Print preview", "closed");
        }


        printEvent.addListener(function(printEnd) {
          if (!printEnd.matches) { 
              sendGoogleAnalyticsEvent("Print preview", "closed");
          };
        });

        $('body').click(function (event)
        {
           if(!$(event.target).closest('.marker-in-text').length && !$(event.target).is('.marker-in-text')) {
             $( ".pin-visible" ).each(function(  ) {
                hidePin($(this));
              });
           }
        });



        createSlider();
        createThemeObj();
        createHeading();
        loadTemplate();

        // Initialize tooltips again
        $('[data-toggle="tooltip"]').tooltip();
    };

    var sendGoogleAnalyticsEvent = function(type, action) {
      sendAnalyticsEvent(type, action);
    }

    /**
      * Handler that launch the print view for the users device
    */
    var printPage = function() {
      if(!$(this).hasClass('disabled')) {
        window.print();
      }
    }

    /**
      * Handler that launch the print view for the users device
    */
    var printPageEnter = function() {
      if(!$(this).hasClass('disabled')) {
        window.print();
      }
    }

    /**
      * Shows the intro theme card after the user clears the instructions
    */
    var showIntro = function() {
      if(!hasShownThemeCard) {
        $('.intro-slider-wrapper').removeClass('hidden').addClass('show');
        hasShownThemeCard = true;
        $('.close-icon').attr('tabindex', 1);
      }
    }

    /**
      * Handler to close the theme popup that appears in the beginning of the interactive
    */
    var closePopup = function() {
      $('.intro-slider-wrapper').removeClass('show').addClass('hidden');
      sendAnalyticsScreen("Selection screen");
    }

    /**
      * Handler to close the theme popup that appears in the beginning of the interactive
    */
    var closePopupEnter = function(e) {

      if(e.keyCode != 13) {
        return;
      }
      $('.intro-slider-wrapper').removeClass('show').addClass('hidden');
      sendAnalyticsScreen("Selection screen");
    }

    /**
      * Handler to scroll down to the paraphrased item in the annotation screen
    */
    var paraphrasedClicked = function() {
      $(".content-height").animate({ scrollTop: $('#paraphrased').offset().top }, 1000);
    }

    /**
      * Gets the theme items and creates the JSON obj which will be used for the markers
    */
    var createThemeObj = function(){
      var themes = AnnotatorData.themes;

      for (var i = 0; i < themes.length; i++) {

        var marker_image = getMarker();
        var obj = {
          "theme_id": themes[i].title,
          "count": themes[i].count,
          "marker_image": marker_image
        };

        themes[i].marker_image = marker_image

        markersInJSON.push(obj);
      };
    };

    /**
      * Gets a marker from an array then deletes it so it won't be selected twice
      *
    */
    var getMarker = function() {
      var marker = markerArray[0];
      markerArray.shift();
      return marker;
    }

    /**
      * Loads the template with the theme card, heading, and page title on launch
    */
    var loadTemplate = function() {
      $('.intro-text').text(AnnotatorData.introduction);
      $('.theme-name').text(heading);
      $('.page-title').text(AnnotatorData.page_title);
    };

    /**
      * Starts the pin setup for Resource Annotator. Adds all the annotation text with span and class which
      * will be used to make the area droppable. Sets the markers and their count. 
    */
    var pinSetup = function() {

      var info = $('.info');
      findAndReplaceDOMText(info.get(0), {
        find: /\w+/g,
        wrap: 'span',
        wrapClass: 'pin-drop',
      });

      info.parent().find('.photo-container').addClass('pin-drop');

      // Init markers defaults
      for(var i = 0; i < markersInJSON.length; i++) {
        var id = markersInJSON[i].theme_id;
        var count = markersInJSON[i].count;

        setMarkerRemaining($('#' + id), count);
      }

      // Add data-marker to store the id of the marker
      $('.marker').each(function() {
        var m = $(this);
        var id = m.parent().attr('id');
        m.data('marker', id);
      });

      draggableSetup();

      // Adapt position of the pins on window resize
      $(window).resize(function() {
        $('.marker-in-text').each(function() {
          findPinPosition($(this));
        })
      });

      setupPrintLayout();

    };


    /**
      * Sets the draggable and droppable targets for the annotation sreen
    */
    var draggableSetup = function() {
      var markers = $('.marker');
      var words = $('.pin-drop');

      draggableEvent(markers);
      droppableEvent(words);
    }

    /**
      * Sets all the markers for the current annotation item to be draggable 
    */
    var draggableEvent = function(markers) {
      markers.draggable({
        containment: 'window',
        helper: 'clone',
        cursor: 'move',
        appendTo: 'body',
        // If there are no more pins available
        start: function(event, ui) {
          var m = $(this).parent();
          var val = getMarkerRemaining(m);
          if(val == 0) {
            m.find('.markers-remaining').css('color', 'red');
            setTimeout(function() {
              m.find('.markers-remaining').css('color', '');
            }, 1000);
            $('body').css('cursor', '');
            return false;
          }
        }
      });
    }

    /**
      * Gets the mouse coords which will be used for the marker dragging on the image.
      * @param {event} [ev] the fired mouse event
    */
    function mouseCoords(ev){
        // from http://www.webreference.com/programming/javascript/mk/column2/
        if(ev.pageX || ev.pageY){
            return {x:ev.pageX, y:ev.pageY};
        }
        return {
            x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y:ev.clientY + document.body.scrollTop  - document.body.clientTop
        };
    }

    /**
      * Sets all the words for the current annotation item in the original text and below area to be 
      * droppable
      * @param {string} [words] the name querystring
    */
    var droppableEvent = function(words) {
      // Make words on the left droppable
      words.droppable({
        accept: '.marker, .marker-in-text', // Accept both markers from the right or already existing markers
        classes: {
          'ui-droppable-active': 'ui-state-highlight'
        },
        tolerance: 'pointer',
        drop: function(event, ui) {
          var pin = ui.draggable;

          // If the marker was already in the text, move it and preserve its proprieties
          if(pin.hasClass('marker-in-text')) {
            var visibility = pin.hasClass('pin-visible') ? 'pin-visible' : 'pin-hidden';
            pin.removeClass().addClass('marker-in-text ' + visibility);
            pin.css({
              'left': '',
              'top': '',
            });
            pin.appendTo($(this));

            // If the pin has been dropped in the image, change the coordinates to %
           if($(this).hasClass('photo-container')) {
             var imgCoord = $(this).offset();
             var mouseCoord = mouseCoords(event);
             var x = mouseCoord.x - imgCoord.left;
             var y = mouseCoord.y - imgCoord.top;
             var xPerc = 100 * x / $(this).width();
             var yPerc = 100 * y / $(this).height();

             pin.css({
               'left': xPerc + '%',
               'top': yPerc + '%',
             });

             findPinPosition(pin);
           }
          }
          // If the marker comes from the right, create the correct HTML structure and decrement the available resources
          else {
            var newVal = getMarkerRemaining(pin.parent()) - 1;
            setMarkerRemaining(pin.parent(), newVal);

            var dataMaker = pin.data('marker');

            pin = pin.clone();

            pin.data('marker', dataMaker);

            $( ".pin-visible" ).each(function(  ) {
              hidePin($(this));
            });

            pin.removeClass().addClass('pin-visible marker-in-text');

            if(window.innerWidth < 600) {
              pin.addClass('fixed-bottom-marker');
            }

            pin.appendTo($(this));
            pin.find('img').removeAttr('width');
            pin.append('<textarea placeholder="Write your note here..." ></textarea>');
            pin.append('<span class="delete-btn"></span>');

            // If the pin has been dropped in the image, change the coordinates to %
           if($(this).hasClass('photo-container')) {
             var imgCoord = $(this).offset();
             var mouseCoord = mouseCoords(event);
             var x = mouseCoord.x - imgCoord.left;
             var y = mouseCoord.y - imgCoord.top;
             var xPerc = 100 * x / $(this).width();
             var yPerc = 100 * y / $(this).height();

             pin.css({
               'left': xPerc + '%',
               'top': yPerc + '%',
             });
           }

            findPinPosition(pin);

            $('.marker-in-text').each(function() {
              if($(this).is(pin)) return;
              hidePin($(this));
            });

            sendGoogleAnalyticsEvent("Markup", "add");
          }

          // When a marker is moved to another position, make it draggable
          pin.draggable({
            containment: 'document',
            cursor: 'move',
            // If not hovering droppable words, go back to the original position
            stop: function(event, ui) {
              /*
              pin.css({
                'left': '',
                'top': '',
              });*/

              findPinPosition(pin);

              $('.marker-in-text').each(function() {
                if($(this).is(pin)) return;
                hidePin($(this));
              });

              showPin(pin);

            }
          });

          // Unbind old listeners
          pin.find('button').off('click');
          pin.find('img').off('click');
          pin.find('textarea').off('keyup');

          // When the user clicks on "Delete"
          pin.find('.delete-btn').click(function() {
            deletePin(pin);
          });

          // Hide or show the content when the user clicks on the pin icon
          pin.find('img').click(function() {
            if(pin.hasClass('pin-visible')) {
              hidePin(pin);
            }
            else {
              //todo
              $('.marker-in-text').each(function() {
                if($(this).is(pin)) return;
                hidePin($(this));
              });

              showPin(pin);
            }
          });

          // Update print layout when an annotation changes
          pin.find('textarea').on('keyup', function() {
            setupPrintLayout();
            sendGoogleAnalyticsEvent("Markup", "edit");
          });

          // Update print layout when a pin is (re)positioned
          setupPrintLayout();
        }
      }); /** End of droppable **/
    }

    /**
      * Fires every time a pin is dropped or text is added in the textarea and will create the new
      * view of the print layout
      * @param {string} [words] the name querystring
      * @return null if no param, or the value of the request querystring
    */
    var setupPrintLayout = function() {
      var print = $('.print-view');
      var original = $('.original-text');

      // Remove old content
      print.find('.photo-container').html('');
      print.find('.print-info').html('');
      print.find('.print-notes ul').html('');
      print.find('.marker-in-text .number').remove();

      //print.find('.caption-text').html(objItem.caption);
      print.find('.discussion-text').html(objItem.question_text);
      print.find('.caption-text').html(objItem.caption);
      print.find('.paraphrased-text').html(objItem.paraphrase);

      // Add updated content
      original.find('.photo-container > *').clone().appendTo(print.find('.photo-container'));
      original.find('.info > *').clone().appendTo(print.find('.print-info'));

      //Add Themes
      //printListItems

      var printListItems = $.templates("#printListItems");
      var printListItemsOutput = printListItems.render(AnnotatorData);
      $(".theme-print-view").html(printListItemsOutput);

      // Close all pins
      print.find('.marker-in-text').each(function() {
        hidePin($(this));
      });

      //Add numbers
      var i = 0;
      print.find('.marker-in-text').each(function() {
        i++;
        var m = $(this);
        m.append('<span class="number" style="opacity:1; display:block;">' + i + '</span>');
      });

      // Add notes
      print.find('.marker-in-text').each(function() {
        var num = $(this).find('.number').text();
        var note = $(this).find('textarea').val();
        var name = $(this).find('img').data('pinname');
        var src = $(this).find('img').attr('src');
        print.find('.print-notes ul').append('<li>'+ noteHTMLSnippet(src, note, num) +'</li>');
        i++;
      });

      if(objItem.caption) {
        print.find('.print-caption').removeClass('print-hidden');
      }

      if(objItem.question_text) {
        print.find('.print-discussion').removeClass('print-hidden');
      }

      if(objItem.paraphrase) {
        print.find('.print-paraphrased').removeClass('print-hidden');
      }


      if(objItem.body) {
        print.find('.print-info').removeClass('print-hidden');
      }

      if(objItem.image_url) {
        print.find('.photo-container').removeClass('print-hidden');
      }

      if(AnnotatorData.themes > 0) {
        print.find('.print-themes').removeClass('print-hidden');
      }

      if(i >= 1) {
        print.find('.print-notes').removeClass('print-hidden');
      }
    }

    /**
      * Creates the HTML for the notes print section
      * @param {string} [src] the image of the marker chose for the note
      * @param {string} [note] the note in the textarea
      * @param {int} [num] the number of the note
      * @return the HTML of the note with the theme being used
    */
    var noteHTMLSnippet = function(src, note, num) {

      return '<div class="note-area">' +
                '<div class="note-pin" style="width:15%; display:inline;"><img src="'+ src +'" width="70%" /></div>' +

                '<div class="note-text" style="width:84%; display:inline;"><p><strong>'+ num +') </strong>'+ note +'</p></div>' +
              '</div><br style="clear:both;" />';
    }

    /**
      * Finds the positions of the pin that is being dragged and sets the popup box location and width and height
      * @param {obj} selected pin item that is being moved
    */
    var findPinPosition = function(pin) {
      var hide = pin.hasClass('pin-hidden');
      if(hide) {
        pin.find('*').not('img').show();
        return;
      }

      var width = pin.closest('.scrollbar-design').outerWidth();
      var scroll = pin.closest('.scrollbar-design').prop('scrollWidth');

      if(pin.parent().hasClass('photo-container') == false) {
        pin.css({
          'left': 0,
          'margin-left': '',
        });
        pin.find('img').css({
          'top': ''
        });
      }
      else {
        pin.css({
          'margin-left': 0
        });
        pin.find('img').css({
          'left': 0,
          'top': -60
        });
      }

      width = pin.closest('.scrollbar-design').outerWidth();
      scroll = pin.closest('.scrollbar-design').prop('scrollWidth');

      var height = pin.closest('.scrollbar-design').outerHeight();
      var scrollHeight = pin.closest('.scrollbar-design').prop('scrollHeight');

      if(width + 1 < scroll) {
        if(pin.parent().hasClass('photo-container') == false) {
          pin.css({
            'left': -320 + parseInt(pin.parent().width()),
            'bottom': 60
            //'top': ''
          });
        }

        if(pin.parent().hasClass('photo-container')) {
          pin.css({
            'margin-left': -320
          });
          pin.find('img').css({
            'left': '',
            'right': 0
          });
        }
        else {
          pin.find('img').css({
            'bottom': -50,
            'left': 320 - parseInt(pin.find('img').width()) + 10
          });
        }

        pin.removeClass('left-flipped').addClass('right-flipped');
      }
      else {
        if(pin.parent().hasClass('photo-container') == false) {
          pin.css({
            'left': 0,
            'bottom': 60
          });
        }

        if(pin.parent().hasClass('photo-container')) {
          pin.css({
            'margin-left': 0
          });
          pin.find('img').css({
            'right': '',
            'left': 0
          });
        }
        else {
          pin.find('img').css({
            'left': -10,
            'bottom': -50,
          });
        }

        pin.removeClass('right-flipped').addClass('left-flipped');
      }

      if(hide)
          pin.find('*').not('img').hide();
    }

    /**
      * Handler to delete a pin that has been placed on the annotation screen
      * @param {obj} the pin to be deleted
    */
    var deletePin = function(pin) {
      pin.append('<div class="delete-pin"><span>Permanently delete this note?</span><button class="btn btn-white confirm-delete">Delete</button><button class="btn btn-white undo-delete">Cancel</button></div>');

      pin.find('.confirm-delete').click(function() {
        var id = pin.data('marker');
        var m = $('#' + id);
        var newVal = getMarkerRemaining(m) + 1;
        setMarkerRemaining(m, newVal);
        pin.remove();
        setupPrintLayout();
        sendGoogleAnalyticsEvent("Markup", "delete");
      });

      pin.find('.undo-delete').click(function() {
        pin.find('.delete-pin').remove();
      });
    }

    /**
      * Handler to show a pin that has been placed on the annotation screen
      * @param {obj} the pin and popup view to be displayed
    */
    var showPin = function(pin) {

      pin.removeClass('pin-hidden').addClass('pin-visible');
      findPinPosition(pin);

      pin.find('*').not('img').finish().show().animate({
        'opacity': 1,
      }, 250, function(){
        pin.find('textarea').focus();
      });

      pin.css("background-color", "rgba(221, 221, 221, 1)");
      pin.css("border-color", "rgba(204, 204, 204, 1)");
      
      if(window.innerWidth < 600) {
        pin.addClass('fixed-bottom-marker');
      }
    };

    /**
      * Handler to hide a pin that has been placed on the annotation screen and hides the textarea and button too
      * @param {obj} the pin and popup view to be hidden
    */
    var hidePin = function(pin) {
      pin.find('*').not('img').finish().animate({
        'opacity': 0,
      }, 250, function() {
        $(this).hide();
        pin.removeClass('pin-visible').addClass('pin-hidden');
        findPinPosition(pin);
      });

      if(window.innerWidth < 600) {
        pin.removeClass('fixed-bottom-marker');
      }

      pin.css("background-color", "rgba(221, 221, 221, 0)");
      pin.css("border-color", "rgba(204, 204, 204, 0)");
    }

    /*
     * Handler that launch the annotation screen view based on the sourced item that was clicked
    */
    var openNotesScreen = function() {

      var annotationID = $(this).data('annotationid');
      objItem = getItemByAnnotationId(annotationID);
      objItem.themes = AnnotatorData.themes;

      var itemLeftTemplate = $.templates("#itemLeftTemplate");
      var itemLeftTemplateOutput = itemLeftTemplate.render(objItem);
      $("#item-left").html(itemLeftTemplateOutput);

      var itemRightTemplate = $.templates("#itemRightTemplate");
      var itemRightTemplateOutput = itemRightTemplate.render(objItem);
      $(".content-height").html(itemRightTemplateOutput);

      if(objItem) {
        sendAnalyticsScreen("Markup screen - " + objItem.title);
        $('.annotation-slider-screen').addClass('animated fadeOut');
        $('.annotation-slider-screen').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              $('.annotation-slider-screen').addClass('hidden');
              $('.annotation-notes-screen').removeClass('hidden').addClass('show');

              $('.icon-print').removeClass('disabled');
              $('.icon-home').removeClass('disabled');
        });
      }

      if($(window).width() > 992) {
        $('.show-left-screen').removeClass('hidden-mobile');
        var markers = $.templates("#itemMarkerItems");
        var markersOutput = markers.render(objItem.themes);
        $(".desktop-markers").html(markersOutput);
      }




      setTimeout(function(){
        $('.markers-container').addClass('animated pulse');

      }, 1800);

      $('.markers-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        for(var i = 0; i < markersInJSON.length; i++) {
          var id = markersInJSON[i].theme_id;
          var count = i + 1;
          //$('#' + id).delay( 500 * count ).addClass('animated bounce');

          $('#' + id + ' img').delay(500 * count).queue(function(next) {
            $(this).addClass('animated bounce');
            next();
          });
        }
      });

      // Initialize tooltips again
      $('[data-toggle="tooltip"]').tooltip();

      if($(window).width() <= 992) {
        var markers = $.templates("#itemMarkerItems");
        var markersOutput = markers.render(objItem.themes);
        $("#MobileMarker").html(markersOutput);

        $('.mobile-menu').removeClass('hidden-mobile');
        $('.mobile-markers').removeClass('hidden-mobile');
      }

      pinSetup();
  }

  /*
   * Handler to get the annotation item that was selected
   * @param {int} the id of the source annotation item that was selected
  */
  var getItemByAnnotationId = function(id) {
    var jsonObj = AnnotatorData.sources;
    for (var i = 0; i < jsonObj.length; i++) {
      if(jsonObj[i].id == id) {
        return jsonObj[i];
      }
    };

    return null;
  }

  /*
   * Creates the slider with the sources for the Resource Annotator with the adaptive breakpoints
  */
  var createSlider = function() {
    var sliderTemplate = $.templates("#sliderTemplate");
    var sliderTemplateHTMLOutput = sliderTemplate.render(AnnotatorData.sources);
    $("#annotation-slider").html(sliderTemplateHTMLOutput);

    $(".regular").slick({
      dots: true,
      infinite: true,
      slidesToShow: 3,
      responsive: [
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 750,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });

    var $carousel = $('.regular');
    $(document).on('keydown', function(e) {
        if(e.keyCode == 37) {
            $carousel.slick('slickPrev');
        }
        if(e.keyCode == 39) {
            $carousel.slick('slickNext');
        }
    });
  }

  /*
   * Displays the lost progress modal to the user
  */
  var showLostProgress = function() {
    if(!$(this).hasClass('disabled')) {
      $('#lost-progress').removeClass('hidden').addClass('show');
    }
  }

  /*
   * Displays the lost progress modal to the user
  */
  var showLostProgressEnter = function() {
    if(!$(this).hasClass('disabled')) {
      $('#lost-progress').removeClass('hidden').addClass('show');
    }
  }

  /*
   * Hides the lost progress modal to the user
  */
  var hideLostProgress = function() {
    $('#lost-progress').removeClass('show').addClass('hidden');
  }

  /*
   * Reloads the Resource Annotator page
  */
  var reloadPage = function() {
    location.reload();
  }
  
  /*
   * Changes the text displayed to the user that shows how many resources are available for a marker
   * @param {marker} the current theme's marker
   * @param {int} the amount of markers remaining for this theme
  */
  var setMarkerRemaining = function(marker, amount) {
    marker.find('.markers-remaining').html(amount + ' remaining');
  }

  /*
   * Returns how many resources are still available for a marker
   * @param {marker} the current theme's marker
  */
  var getMarkerRemaining = function(marker) {
    var rawText = marker.find('.markers-remaining').html();
    return parseInt(rawText);
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
    * Return the modal width
    * @return int the value  should be 275
  */

  var getModalWidth = function() {
    return modalWidth;
  }

  /**
    * Return the modal width
    * @return int the value  should be 275
  */

  var getNumberOfMarkers = function() {
    return markerArray.length;
  }


  return {
      init: init,
      getParameterByName: getParameterByName,
      getMarker: getMarker,
      getModalWidth: getModalWidth,
      getNumberOfMarkers: getNumberOfMarkers
  }
})();
