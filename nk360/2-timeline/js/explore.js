Explore = (function() {

	var init = function() {
        bindEvents();
    }

    var stopClick = false;


    /**
    * Hides the transition overlay 
    * @param no param
    * @return {string|int|array} returns nothing
    **/
    var hideExploreTransition = function() {
        $('.transition-overlay').addClass('animated fadeOut hidden');
    }

    
    /**
    * Scrolls the timeline to the left.  If the amount of timeline to be scrolled is greater than the width of the screen, it scrolls left by the width of the screen; if not, it scrolls by the remaining amount to te scrolled.  If the button is click tapped and there is no remaining amount to scroll, the button is disabled. 
    * @param click tap event
    * @return {string|int|array} returns nothing
    **/
    var advancePrevBtn = function(event) {
        event.preventDefault();
        var timelineLeft = $('.timeline-wrapper').position().left;
        var windowWidth = $(window).width();

        if (stopClick) return;
        stopClick = true;

        if (timelineLeft < 0 && -timelineLeft >= windowWidth) {
            $('#prev-btn').removeClass('disabled');
            $('#next-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "+=" + windowWidth 
            }, 500, "linear", function() {
                stopClick = false;
            });
            console.log('this is the if statement for prev ' + timelineLeft);
        } else if (timelineLeft < 0) {
            $('#prev-btn').removeClass('disabled');
            $('#next-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "+=" + -timelineLeft 
            }, 500, "linear",  function() {
                stopClick = false;
            });
            setTimeout(function() { $('#prev-btn').addClass('disabled'); }, 100); //500
            console.log('this is the else if statement ' + timelineLeft);
        } else if (timelineLeft == 0) {
            $('#prev-btn').addClass('disabled');
            $('#next-btn').removeClass('disabled'); 
            console.log('this if timelineLeft is zero ' + timelineLeft) 
            stopClick = false;
        } else {
            console.log('this is the else statement for prev');
            stopClick = false;
        }
    }


     /**
    * Scrolls the timeline to the right.  If the amount of timeline to be scrolled is greater than the width of the screen, it scrolls left by the width of the screen; if not, it scrolls by the remaining amount to te scrolled.  If the button is click tapped and there is no remaining amount to scroll, the button is disabled. 
    * @param click tap event
    * @return {string|int|array} returns nothing
    **/
    var advanceNextBtn = function(event) {
        event.preventDefault();
        var windowWidth = $(window).width(); // 1397px
        var timelineLeft = $('.timeline-wrapper').position().left;
        var timelineWidth = Detail.timelineWidth;
        var leftToScroll = timelineWidth + timelineLeft - windowWidth;
        
        if (stopClick) return;
        stopClick = true;
       
       
        if (windowWidth < timelineWidth && leftToScroll >= windowWidth) { // 0 < 2143; 1397 < 2143; 2974 !< 2143
            $('#next-btn').removeClass('disabled');
            $('#prev-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "-=" + windowWidth 
            }, 500, "swing", function() {
                stopClick = false;
            });
            console.log('this is the if ' + leftToScroll);
        } else if (leftToScroll > 0) {
            $('#next-btn').removeClass('disabled');
            $('#prev-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "-=" + leftToScroll
            }, 500, "linear", function() {
                stopClick = false;
            });
            setTimeout(function() { $('#next-btn').addClass('disabled'); }, 100); //500
            console.log('this is the first else ' + leftToScroll);
        } else if (leftToScroll <= 0) {
            $('#next-btn').addClass('disabled'); 
            $('#prev-btn').removeClass('disabled');
            console.log('this is if leftToScroll is zero' + leftToScroll);
            stopClick = false;
        } else {
            console.log('this is the else' + leftToScroll);
        }
      
        
    }


    /**
    * Displays the modal for the moment in the timline.
    * @param no param
    * @return {string|int|array} returns nothing
    **/
    var getMomentDetails = function() {
        var era = $(this).attr('data-era');
        var moment = $(this).attr('data-timeline');
        Detail.displayModal(era, moment);

    }

    var bindEvents = function() {
        $(document).on('click tap', '#explore-btn', hideExploreTransition);
        $(document).on('click tap', '#prev-btn', advancePrevBtn);
        $(document).on('click tap', '#next-btn', advanceNextBtn);
        $(document).on('click tap', '.timeline-item', getMomentDetails);
    }


    


	return {
		init: init
       
	}


})();



