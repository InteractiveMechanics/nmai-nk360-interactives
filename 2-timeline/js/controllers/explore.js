Explore = (function() {

	var init = function() {
        bindEvents();
    }

    var hideExploreTransition = function() {
        $('.transition-overlay').addClass('animated fadeOut hidden');
    }

    //TODO account for window resize
    var advancePrevBtn = function() {
        event.preventDefault();
        var timelineWidth = $('.timeline-wrapper').width();
        var scrollWidthPrev = $('.timeline-wrapper').scrollLeft();
        var windowWidth = $(window).width();
        if (scrollWidthPrev > 0) {
            $('.timeline-wrapper').animate({
                scrollLeft: "-=" + windowWidth + "px"
            }, "fast");
        }
        console.log("prev scrollWidth " + scrollWidthPrev);
    }

    var advanceNextBtn = function() {
        event.preventDefault();
        var timelineWidth = $('.timeline-wrapper').width();
        var scrolled = $('.timeline-wrapper').scrollLeft();
        var windowWidth = $(window).width();
        var roomToScroll = timelineWidth - windowWidth;
        var leftToScroll = timelineWidth - scrolled;

        if (leftToScroll >= windowWidth) {
            console.log('if statement: left to scroll is' + leftToScroll + ' and scrolled is' + scrolled + " room to scrolll is " + roomToScroll);
            $('.timeline-wrapper').animate({
                scrollLeft: "+=" + windowWidth + "px"
            }, "fast");
        } else {
            console.log('else statement: left to scroll is ' + leftToScroll + ' room to scroll is ' + roomToScroll);
            $('.timeline-wrapper').animate({
                scrollLeft: "+=" + leftToScroll + "px"
            }, "fast");
           
        } 
         console.log("left to scroll is " + leftToScroll + " scrolled is " + scrolled + " room to scroll is " + roomToScroll);
        
        
    }

    var getMomentDetails = function() {
        var era = $(this).attr('data-era');
        var moment = $(this).attr('data-timeline');
        console.log('the era is ' + era + 'the moment is ' + moment);
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



