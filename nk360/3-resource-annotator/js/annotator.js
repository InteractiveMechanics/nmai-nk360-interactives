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

    var skipInstructions = function() {
      window.location.href = window.location.pathname + "?instructions=false";
    }

    var modalWidth = 275;

    var createHeading = function() {
      var arr = markersInJSON;

      if(arr.length == 1) {
        heading =  arr[0].theme_id;
      }

      if(arr.length > 1) {
        for (var i = 0; i < arr.length; i++) {
          if( i == arr.length - 1) {
            heading = heading.substring(0, heading.length - 2);
            heading += " & " + arr[i].theme_id;
          } else {
            heading += arr[i].theme_id + ", ";
          }
        }
      }

    }

    var markerArray = [
      './assets/marker-01@2x.png',
      './assets/marker-02@2x.png',
      './assets/marker-03@2x.png',
      './assets/marker-04@2x.png',
      './assets/marker-05@2x.png',
    ]

    var printEvent = window.matchMedia('print');

    var showView = function() {
      var isShowing = $('.show-right-screen').is(":Visible");
      if(isShowing) {
        $('.show-right-screen').addClass('hidden-mobile');
        $('.show-left-screen').removeClass('hidden-mobile');
      }
    };

    var showContent = function() {
       var isShowing = $('.show-left-screen').is(":Visible");
       if(isShowing) {
        $('.show-left-screen').addClass('hidden-mobile');
        $('.show-right-screen').removeClass('hidden-mobile');
       }
    };

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

    var focusOnTextArea = function() {
      $(this).focus();
    }
    var bindEvents = function() {
        $('body').on('click tap', '.annotation-slider-screen .btn-success', openNotesScreen);
        $('body').on('click tap', '.icon-home', showLostProgress);
        $('body').on('click tap', '#instructions', showIntro);
        $('body').on('click tap', '.close-icon', closePopup);
        $('body').on('click tap', '.summary-link', paraphrasedClicked);
        $('body').on('click tap', '.print-notes', printPage);

        $('body').on('click tap', '.reload-page', skipInstructions);
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

    var printPage = function() {
      if(!$(this).hasClass('disabled')) {
        window.print();
      }
    }

    var showIntro = function() {
      if(!hasShownThemeCard) {
        $('.intro-slider-wrapper').removeClass('hidden').addClass('show');
        hasShownThemeCard = true;
      }
    }

    var closePopup = function() {
      $('.intro-slider-wrapper').removeClass('show').addClass('hidden');
      sendAnalyticsScreen("Selection screen");
    }

    var paraphrasedClicked = function() {
      $(".content-height").animate({ scrollTop: $('#paraphrased').offset().top }, 1000);
    }

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

    var getMarker = function() {
      var marker = markerArray[Math.floor(Math.random() * markerArray.length)];

      var index = markerArray.indexOf(marker);
      if (index > -1) {
        markerArray.splice(index, 1);
      }

      return marker;
    }

    var loadTemplate = function() {
      $('.intro-text').text(AnnotatorData.introduction);
      $('.theme-name').text(heading);
      $('.page-title').text(AnnotatorData.page_title);
    };

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

    var draggableSetup = function() {
      var markers = $('.marker');
      var words = $('.pin-drop');

      draggableEvent(markers);
      droppableEvent(words);
    }

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

    var noteHTMLSnippet = function(src, note, num) {

      return '<div class="note-area">' +
                '<div class="note-pin" style="width:15%; display:inline;"><img src="'+ src +'" width="70%" /></div>' +

                '<div class="note-text" style="width:84%; display:inline;"><p><strong>'+ num +') </strong>'+ note +'</p></div>' +
              '</div><br style="clear:both;" />';
    }

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

      //console.log(width + " " + scroll);

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
    };

    var hidePin = function(pin) {
      pin.find('*').not('img').finish().animate({
        'opacity': 0,
      }, 250, function() {
        $(this).hide();
        pin.removeClass('pin-visible').addClass('pin-hidden');
        findPinPosition(pin);
      });

      pin.css("background-color", "rgba(221, 221, 221, 0)");
      pin.css("border-color", "rgba(204, 204, 204, 0)");
    }

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

    var getItemByAnnotationId = function(id) {
      var jsonObj = AnnotatorData.sources;
      for (var i = 0; i < jsonObj.length; i++) {
        if(jsonObj[i].id == id) {
          return jsonObj[i];
        }
      };

      return null;
    }



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
    }

    var showLostProgress = function() {
      if(!$(this).hasClass('disabled')) {
        $('#lost-progress').removeClass('hidden').addClass('show');
      }
    }

    var hideLostProgress = function() {
      $('#lost-progress').removeClass('show').addClass('hidden');
    }

    var reloadPage = function() {
      location.reload();
    }

    var createCookie = function() {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    }

    var readCookie = function() {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    }

    // setMarkerRemaining changes the text displayed to the user that shows how many resources are available for a marker
    var setMarkerRemaining = function(marker, amount) {
      marker.find('.markers-remaining').html(amount + ' remaining');
    }

    // getMarkerRemaining returns how many resources are still available for a marker
    var getMarkerRemaining = function(marker) {
      var rawText = marker.find('.markers-remaining').html();
      return parseInt(rawText);
    }

    /*var sendAnalyticsScreen = function(foo, bar, foo) {
      //todo
    }*/

    var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    return {
        init: init
    }
})();
