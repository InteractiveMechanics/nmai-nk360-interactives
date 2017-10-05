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
        var timelineLeft = $('.timeline-wrapper').position().left;
        var windowWidth = $(window).width();
        if (timelineLeft < 0 && -timelineLeft >= windowWidth) {
            $('.timeline-wrapper').animate({
                left: "+=" + windowWidth 
            }, "fast");
        } else {
            $('.timeline-wrapper').animate({
                left: "+=" + -timelineLeft 
            }, "fast");
        }
        console.log("left " + timelineLeft);
    }

    var advanceNextBtn = function() {
        event.preventDefault();
        var windowWidth = $(window).width(); // 1397px
        var timelineLeft = $('.timeline-wrapper').position().left;
        var leftToScroll = Detail.timelineWidth + timelineLeft - windowWidth;
       
        if (windowWidth < Detail.timelineWidth && leftToScroll >= windowWidth) { // 0 < 2143; 1397 < 2143; 2974 !< 2143
            console.log(Detail.timelineWidth + " and " + timelineLeft + " left to Scroll is " + leftToScroll);
            $('.timeline-wrapper').animate({
                left: "-=" + windowWidth 
            }, "fast");
        } else if (leftToScroll > 0) {
            console.log(timelineLeft);
            $('.timeline-wrapper').animate({
                left: "-=" + leftToScroll
            }, "fast");
        } else {

        }
        //console.log("translateX is" + translateX);
       
        
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



