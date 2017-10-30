Explore = (function() {

	var init = function() {
        bindEvents();
    }


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
        if (timelineLeft < 0 && -timelineLeft >= windowWidth) {
            $('#prev-btn').removeClass('disabled');
            $('#next-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "+=" + windowWidth 
            }, "fast");
        } else if (timelineLeft < 0) {
            $('#prev-btn').removeClass('disabled');
            $('#next-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "+=" + -timelineLeft 
            }, "fast");

            setTimeout(function() { $('#prev-btn').addClass('disabled'); }, 500);
        } else {
            $('#prev-btn').addClass('disabled');
            $('#next-btn').removeClass('disabled');  
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
        var leftToScroll = Detail.timelineWidth + timelineLeft - windowWidth;
       
        if (windowWidth < Detail.timelineWidth && leftToScroll >= windowWidth) { // 0 < 2143; 1397 < 2143; 2974 !< 2143
            $('#next-btn').removeClass('disabled');
            $('#prev-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "-=" + windowWidth 
            }, "fast");
        } else if (leftToScroll > 0) {
            $('#next-btn').removeClass('disabled');
            $('#prev-btn').removeClass('disabled');
            $('.timeline-wrapper').animate({
                left: "-=" + leftToScroll
            }, "fast");
            setTimeout(function() { $('#next-btn').addClass('disabled'); }, 500);
        } else {
            $('#next-btn').addClass('disabled'); 
            $('#prev-btn').removeClass('disabled');
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



