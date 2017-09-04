Explore = (function() {

	var init = function() {
        bindEvents();
    }

    var hideExploreTransition = function() {
        $('.transition-overlay').addClass('animated fadeOut hidden');
    }

    var advancePrevBtn = function() {
        event.preventDefault();
        $('.timeline-wrapper').animate({
            scrollLeft: "-=200px"
        }, "fast");
    }

    var advanceNextBtn = function() {
        event.preventDefault();
        $('.timeline-wrapper').animate({
            scrollLeft: "+=200px"
        }, "fast");
    }

    var getMomentDetails = function() {
        var era = $('.timeline-wrapper').attr('data-era');
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



